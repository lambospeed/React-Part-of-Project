package aurita.controllers.map

import play.api.mvc.{ Action, AnyContent, AnyContentAsJson, AbstractController, ControllerComponents }
import play.api.Configuration
import scala.concurrent.ExecutionContext
import com.mohiva.play.silhouette.api.Silhouette
import aurita.controllers.map.daos.MapControllerDAO
import aurita.utility.auth.DefaultEnv

/**
 * Manages any Map related HTTP requests.
 *
 * @param cc the base controller components dependencies.
 * @param silhouette the Silhouette stack.
 * @param mapDAO the object giving access to map related DAOs.
 * @param executionContext the [[https://www.scala-lang.org/api/current/scala/concurrent/ExecutionContext.html trait]] to execute tasks -java Runnable- often using a
 * thread pool under the hood.
 * @param configuration the type-safe [[https://www.playframework.com/documentation/2.6.x/api/scala/index.html#play.api.Configuration configuration library]] for JVM languages.
 */
class MapController(
  cc: ControllerComponents,
  silhouette: Silhouette[DefaultEnv],
  mapDAO: MapControllerDAO
)(
  implicit executionContext: ExecutionContext, configuration: Configuration
) extends AbstractController(cc) {
  import com.mohiva.play.silhouette.api.actions.SecuredRequest
  import play.api.libs.json.Json
  import play.api.libs.json.JsValue
  import scala.concurrent.Future
  import aurita.models.map.utility.MapSettings
  import aurita.controllers.auth.utility.ControllerUtility.CheckUserId

  /** Gets the [[aurita.models.map.utility.MapSettings map settings]] associated with the
    * current user.
    *
    * @return the [[https://www.playframework.com/documentation/2.6.x/api/scala/index.html#play.api.mvc.Action Action]]
    * that generates a [[https://www.playframework.com/documentation/2.6.x/api/scala/index.html#play.api.mvc.Results.Ok Http Ok]] JSON result with the [[aurita.models.map.utility.MapSettings map settings]],
    * or a [[https://www.playframework.com/documentation/2.6.x/api/scala/index.html#play.api.mvc.Results.Conflict Http Conflict]] JSON result if there is an error.
    *
    */
  def getMapSettings(): Action[AnyContent] = silhouette.SecuredAction.async {
    implicit request: SecuredRequest[DefaultEnv, AnyContent] => CheckUserId(
      identity = request.identity
    ) { _ =>
      mapDAO.userMapSettingsDAO.getMapSettings(
        userId = request.identity.user.id.getOrElse(0L)
      ) map { ms: MapSettings => Ok(Json.toJson(ms)) }
    }
  }

  /** Create or update [[aurita.models.map.UserMapSettings user map settings]] associated with
    * the current user.
    *
    * @note the body should contain the [[aurita.models.map.utility.MapSettings map settings]]
    * to be upserted in JSON format.
    *
    * @return the [[https://www.playframework.com/documentation/2.6.x/api/scala/index.html#play.api.mvc.Action Action]]
    * that generates a [[https://www.playframework.com/documentation/2.6.x/api/scala/index.html#play.api.mvc.Results.Ok Http Ok]] JSON result with the [[aurita.models.map.utility.MapSettings map settings]],
    * or a [[https://www.playframework.com/documentation/2.6.x/api/scala/index.html#play.api.mvc.Results.Conflict Http Conflict]] JSON result if there is an error.
    *
    */
  def upsertUserMapSettings(): Action[JsValue] = silhouette.SecuredAction.async(parse.json) {
    implicit request: SecuredRequest[DefaultEnv, JsValue] => CheckUserId(
      identity = request.identity
    ) { _ =>
      request.body.validate[MapSettings].fold(
        errors => Future { Conflict(Json.obj(
          "type" -> "mapSettings", "error" -> s"Error in map settings data: ${errors}"
        )) },
        settings => mapDAO.userMapSettingsDAO.upsertUserMapSettings(
          userId = request.identity.user.id.getOrElse(0L), settings = settings
        ) map { ms: MapSettings => Ok(Json.toJson(ms)) }
      )
    }
  }
}
