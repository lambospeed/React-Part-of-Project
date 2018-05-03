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
import play.api.libs.json.{ JsArray, JsValue }
import aurita.utility.auth.providers.TwentyThreeAndMeProvider.providerId

import scala.concurrent.Future

trait BaseTwentyThreeAndMeProvider extends OAuth2Provider {
  override type Content = JsValue

  override val id = providerId

  override protected def urls: Map[String, String] = Map.empty

  override protected def buildProfile(authInfo: OAuth2Info): Future[Profile] = {
    httpLayer.url(settings.apiURL.getOrElse(""))
      .withHttpHeaders(("Authorization", s"Bearer ${authInfo.accessToken}")).get()
      .flatMap(response => profileParser.parse(response.json, authInfo))
  }
}

/**
  * The profile parser for the common social profile.
  */
class TwentyThreeAndMeProfileParser extends SocialProfileParser[
  JsValue, CommonSocialProfile, OAuth2Info
] {
  import aurita.utility.auth.providers.TwentyThreeAndMeProvider.ProfileRetrievalError

  /**
    * Parses the social profile.
    *
    * @param json     The content returned from the provider.
    * @param authInfo The auth info to query the provider again for additional data.
    * @return The social profile from given result.
    */
  override def parse(json: JsValue, authInfo: OAuth2Info) = (json \ "data").as[JsArray]
    .value
    .headOption
    .map(profile => {
      val id = (profile \ "id").as[String]
      val firstName = (profile \ "first_name").asOpt[String]
      val lastName = (profile \ "last_name").asOpt[String]
      val email = (profile \ "email").asOpt[String]

      CommonSocialProfile(
        loginInfo = LoginInfo(providerId, id),
        firstName = firstName,
        lastName = lastName,
        email = email)
    }) match {
      case Some(socialProfile) => Future.successful(socialProfile)
      case None => Future.failed(new ProfileRetrievalException(ProfileRetrievalError))
    }
}

/**
  * The 23andme Provider.
  *
  * @param httpLayer     The HTTP layer implementation.
  * @param stateHandler  The state provider implementation.
  * @param settings      The provider settings.
  */
class TwentyThreeAndMeProvider (
  protected val httpLayer: HTTPLayer,
  protected val stateHandler: SocialStateHandler,
  val settings: OAuth2Settings
) extends BaseTwentyThreeAndMeProvider with CommonSocialProfileBuilder {

  /**
    * The type of this class.
    */
  override type Self = TwentyThreeAndMeProvider

  /**
    * The profile parser implementation.
    */
  override val profileParser = new TwentyThreeAndMeProfileParser

  /**
    * Gets a provider initialized with a new settings object.
    *
    * @param f A function which gets the settings passed and returns different settings.
    * @return An instance of the provider initialized with new settings.
    */
  override def withSettings(f: (Settings) => Settings) =
    new TwentyThreeAndMeProvider(httpLayer, stateHandler, f(settings))
}


object TwentyThreeAndMeProvider {

  val providerId = "twentythreeandme"

  val ProfileRetrievalError =
    s"[Silhouette][${providerId}] Could not retrieve info for profile."

}