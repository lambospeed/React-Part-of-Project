package aurita.controllers.auth

import com.mohiva.play.silhouette.api.Environment
import com.mohiva.play.silhouette.api.repositories.AuthInfoRepository
import com.mohiva.play.silhouette.impl.providers.SocialProviderRegistry
import play.api.cache.AsyncCacheApi
import play.api.i18n.{ I18nSupport, MessagesApi }
import play.api.mvc.{ AbstractController, ControllerComponents }

import scala.concurrent.ExecutionContext
import aurita.utility.auth.DefaultEnv
import aurita.utility.mail.Mailer
import aurita.daos.auth.UserService
import aurita.controllers.auth.daos.AuthControllerDAO
import aurita.utility.strings.FormatString.formatString

/**
  * The social authentication controller.
  *
  * @param messagesApi The Play messages API.
  * @param silhouette The Silhouette stack.
  * @param userService The user service implementation.
  * @param authInfoRepository The auth info service implementation.
  * @param socialProviderRegistry The social provider registry.
  */
class SocialAuthController(
  messagesApi: MessagesApi,
  mailer: Mailer,
  cc: ControllerComponents,
  silhouette: Environment[DefaultEnv],
  userService: UserService,
  authInfoRepository: AuthInfoRepository,
  socialProviderRegistry: SocialProviderRegistry,
  controllerDAO: AuthControllerDAO,
  cache: AsyncCacheApi
)(
  implicit executionContext: ExecutionContext
) extends AbstractController(cc) with I18nSupport {
  import com.mohiva.play.silhouette.api.exceptions.ProviderException
  import com.mohiva.play.silhouette.api.{ AuthInfo, LoginEvent, SignUpEvent }
  import com.mohiva.play.silhouette.impl.providers.{
    CommonSocialProfileBuilder, SocialProvider
  }
  import play.api.libs.json.Json
  import play.api.mvc.{ AnyContent, Request, Result }
  import scala.concurrent.Future
  import scala.concurrent.duration._
  import UserService.FormatToUsername

  lazy val logger = new aurita.utility.messages.Log(this.getClass)

  type SocialProvider0 = SocialProvider with CommonSocialProfileBuilder

  /**
    * Authenticates a user against a social provider.
    *
    * @param providerId The Id of the provider to authenticate against.
    * @return The result to display.
    */
  def authenticate(providerId: String) = Action.async { r =>
    cacheAuthTokenForOauth1(r) { implicit request =>
      (socialProviderRegistry.get[SocialProvider](id = providerId) match {
        case Some(provider: SocialProvider0) => _processAuth(
          providerId = providerId, provider = provider
        )
        case _ => Future.failed(new ProviderException(
          s"Cannot authenticate with unknown social provider ${providerId}"
        ))
      }).recover {
        case e: ProviderException => {
          logger.error("Failure authenticating due to provider exception", e)
          Unauthorized(Json.obj(
            "type" -> "social",
            "error" -> e.getMessage,
            "mesg" -> "Failure authenticating"
          ))
        }
        case e: SocialAuthValidationError => Unauthorized(Json.obj(
          "type" -> "social",
          "error" -> e.getMessage,
          "code" -> e.code,
          "mesg" -> "Social sign in validation error"
        ))
      }
    }
  }

  private def _processAuth(
    providerId: String, provider: SocialProvider0
  )(implicit request: Request[_]): Future[Result] = provider.authenticate flatMap {
    case Left(result: Result) => Future.successful(result)
    case Right(authInfo) => for {
      profile <- provider.retrieveProfile(authInfo = authInfo)
      email <- profile.email match {
        case Some(email) if email.length > 0 => Future.successful(email)
        case _ => Future.failed(NoEmailProvided(providerId = providerId))
      }
      fullName <- profile.fullName match {
        case Some(fullName) if fullName.trim.length > 3 =>
          Future.successful(fullName.trim)
        case _ => Future.failed(NoFullNameProvided(providerId = providerId))
      }
      existingUser <- controllerDAO.userDAO.findByEmail(email)
      suffix <- existingUser.map(u => Future.successful(u.usernameSuffix))
        .getOrElse(_createSuffix(username = FormatToUsername(fullName)))
      identity <- userService.save(profile = profile, suffix = suffix)
      authInfo <- authInfoRepository.save(
        loginInfo = profile.loginInfo, authInfo = authInfo
      )
      authenticator <- silhouette.authenticatorService.create(
        loginInfo = profile.loginInfo
      )
      token <- silhouette.authenticatorService.init(authenticator = authenticator)
    } yield {
      existingUser match {
        case Some(user) => silhouette.eventBus.publish(LoginEvent(identity, request))
        case None => silhouette.eventBus.publish(SignUpEvent(identity, request))
      }
      Ok(Json.obj(
        "token" -> token,
        "id" -> identity.user.id.get,
        "fullName" -> identity.user.fullName.get,
        "username" -> identity.user.username,
        "role" -> identity.user.roleName
      ))
    }
  }

  /**
    * Satellizer executes multiple requests to the same application endpoints
    * for OAuth1.
    *
    * So this function caches the response from the OAuth provider and returns
    * it on the second request. Not nice, but it works as a temporary workaround
    * until the bug is fixed.
    *
    * @param request The current request.
    * @param f The action to execute.
    * @return A result.
    * @see https://github.com/sahat/satellizer/issues/287
    */
  private def cacheAuthTokenForOauth1(
    request: Request[AnyContent]
  )(f: Request[AnyContent] => Future[Result]): Future[Result] = {
    request.getQueryString(
      "oauth_token"
    ) -> request.getQueryString("oauth_verifier") match {
      case (Some(token), Some(verifier)) => cache.get[Result](
        token + "-" + verifier
      ) flatMap { _ match {
        case Some(result) => Future.successful(result)
        case None => f(request).map { result =>
          cache.set(token + "-" + verifier, result, 1 minute)
          result
        }
      } }
      case _ => f(request)
    }
  }

  /**
    * Generates suffix for given username so concatenated string ("username" + "suffix")
    * is unique in USER table. If username is already unique then return None.
    *
    * @param username the user's username
    * @param suffix the number added as a suffix to make the username unique
    * @return optional suffix
    */
  private def _createSuffix(
    username: String, suffix: Option[Int] = None
  ): Future[Option[Int]] = controllerDAO.userDAO.fullUsernameExists(
    username = username, suffix = None
  ).flatMap { _ match {
    case true => _createSuffix(
      username = username, suffix = Some(suffix.fold(1)(_ + 1))
    )
    case false => Future.successful(suffix)
  } }
}

sealed abstract class SocialAuthValidationError(
  val code: Int, message: String
) extends RuntimeException(message: String)

case class NoEmailProvided(providerId: String) extends SocialAuthValidationError(
  code = 1,
  message = s"""Login through ${providerId} requires access to an email address associated
               |with your ${providerId} account.""".tcombine
)

case class NoFullNameProvided(providerId: String) extends SocialAuthValidationError(
  code = 1,
  message = s"""Login through ${providerId} requires access to a full name with length > 3
               |associated with your ${providerId} account.""".tcombine
)
