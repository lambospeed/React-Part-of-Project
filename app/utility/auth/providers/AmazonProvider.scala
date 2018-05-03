package aurita.utility.auth.providers

import com.mohiva.play.silhouette.api.LoginInfo
import com.mohiva.play.silhouette.api.util.HTTPLayer
import com.mohiva.play.silhouette.impl.exceptions.ProfileRetrievalException
import com.mohiva.play.silhouette.impl.providers.{
  CommonSocialProfile,
  CommonSocialProfileBuilder,
  OAuth2Info,
  OAuth2Provider,
  OAuth2Settings,  
  SocialProfileParser,
  SocialStateHandler
}
import play.api.libs.json.{ Format, JsArray, JsError, Json, JsSuccess, JsValue }
import aurita.utility.auth.providers.AmazonProvider.{ providerId, ProfileRetrievalError }
import scala.concurrent.Future

trait  BaseAmazonProvider extends OAuth2Provider {
  import aurita.utility.auth.providers.AmazonProvider.Endpoints

  override type Content = JsValue

  override val id: String = providerId

  override protected def urls: Map[String, String] = Map(
    "endpoints" -> Endpoints
  )

  override protected def buildProfile(authInfo: OAuth2Info): Future[Profile] = {
    httpLayer.url(urls("endpoints"))
      .withHttpHeaders(("Authorization", s"Bearer ${authInfo.accessToken}"))
      .get()
      .map(response => response.json.validate[AmazonEndpoints])
      .flatMap {
        case JsSuccess(json, _) =>
          httpLayer.url(s"${json.metadataUrl}${settings.apiURL}")
            .withHttpHeaders(("Authorization", s"Bearer ${authInfo.accessToken}")).get()
        case JsError(_) => Future.failed(
          new ProfileRetrievalException(ProfileRetrievalError)
        )
      }
      .flatMap(response => {
        profileParser.parse(response.json, authInfo)
      })
  }
}

class AmazonProfilerParser extends SocialProfileParser[
  JsValue, CommonSocialProfile, OAuth2Info
] {
  override def parse(json: JsValue, authInfo: OAuth2Info) = (json \ "data").as[JsArray]
    .value
    .headOption
    .map(profile => {
      val id = (profile \ "id").as[String]
      val firstName = (profile \ "first_name").asOpt[String]
      val lastName = (profile \ "last_name").asOpt[String]
      val email = (profile \ "email").asOpt[String]
      val fullName = for {
        fn <- firstName
        ln <- lastName
      } yield s"$fn $ln"

      CommonSocialProfile(
        loginInfo = LoginInfo(providerId, id),
        firstName = firstName,
        lastName = lastName,
        fullName = fullName,
        email = email)
    }) match {
    case Some(socialProfile) => Future.successful(socialProfile)
    case None => Future.failed(new ProfileRetrievalException(ProfileRetrievalError))
  }
}

class AmazonProvider (
  protected val httpLayer: HTTPLayer,
  protected val stateHandler: SocialStateHandler,
  val settings: OAuth2Settings
) extends BaseAmazonProvider with CommonSocialProfileBuilder {

  override type Self = AmazonProvider

  override val profileParser = new AmazonProfilerParser

  override def withSettings(f: (Settings) => Settings) =
    new AmazonProvider(httpLayer, stateHandler, f(settings))
}

object AmazonProvider {

  val providerId = "amazon"

  val Endpoints = "https://drive.amazonaws.com/drive/v1/account/endpoint"

  val ProfileRetrievalError =
    s"[Silhouette][$providerId] Could not retrieve info for profile."
}

case class AmazonEndpoints(contentUrl: String, metadataUrl: String)

object AmazonEndpoints {
  implicit val fmt: Format[AmazonEndpoints] = Json.format[AmazonEndpoints]
}