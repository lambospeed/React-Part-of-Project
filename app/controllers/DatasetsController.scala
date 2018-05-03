package aurita.controllers

import play.api.mvc.{
  AbstractController, Action, AnyContent, ControllerComponents, Request, WebSocket
}
import play.api.{ Configuration, Environment }
import play.api.libs.ws.WSClient
import com.softwaremill.tagging.@@
import akka.actor.ActorSystem
import akka.stream.Materializer
import com.mohiva.play.silhouette.api.Silhouette
import scala.concurrent.ExecutionContext
import controllers.Assets
import aurita.MainActorSystemTag
import aurita.actors.SocketClientFactory
import aurita.utility.auth.DefaultEnv
import java.io.File

/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */
class DatasetsController(
  assets: Assets,
  cc: ControllerComponents,
  silhouette: Silhouette[DefaultEnv],
  socketClientFactory: SocketClientFactory,
  system: ActorSystem @@ MainActorSystemTag,
  environment: Environment,
  ws: WSClient
)(
  implicit val materializer: Materializer,
  implicit val executionContext: ExecutionContext,
  implicit val configuration: Configuration
) extends AbstractController(cc) {
  import play.api.libs.streams.ActorFlow
  import play.api.Mode
  import scala.concurrent.Future

  def fetch(file: String) = Action {
    val absolutePath = new File("").getAbsolutePath();
    Ok.sendFile(
      content = new java.io.File(s"${absolutePath}/conf/data/${file}"),
      fileName = _ => file
    )
  }



}