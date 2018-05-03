package aurita.controllers.auth.utility

object ControllerUtility {
  import play.api.libs.json.Json
  import play.api.mvc.Result
  import play.api.mvc.Results.{ BadRequest, Conflict, Ok }
  import scala.concurrent.Future
  import scala.concurrent.ExecutionContext
  import aurita.models.auth.IdentityImpl

  /** Execute given function if [[aurita.models.auth.IdentityImpl Identity]] contains a
    * user id.
    *
    * @param identity the [[aurita.models.auth.IdentityImpl identity implementation]]
    * containing the user id.
    * @param successFn the function to execute if [[aurita.models.auth.IdentityImpl identity]]
    * contains a user id.
    * @return the [[Result Http Result]] from the executed function, or a
    * [[play.api.mvc.Results.Conflict Http Conflict]] if the
    * [[aurita.models.auth.IdentityImpl identity]] contains no user id.
    *
    */
  def CheckUserId(identity: IdentityImpl)(successFn: (Boolean) => Future[Result])(
    implicit executionContext: ExecutionContext
  ): Future[Result] = identity.user.id match {
    case Some(userId) => successFn(identity.user.roleName == "admin")
    case None => Future {
      BadRequest(
        Json.toJson(
          Json.obj(
            "error" -> s"Error getting user id from identity = ${identity}"
          )
        )
      )
    }
  }

}