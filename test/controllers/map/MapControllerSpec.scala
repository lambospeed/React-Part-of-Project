package aurita.test.controllers.map

import aurita.test.utility.TestAuthEnvironment
import aurita.utility.auth.DefaultEnv
import com.mohiva.play.silhouette
import org.junit.runner.RunWith
import org.specs2.runner.JUnitRunner
import play.api.test.FakeRequest
import play.api.test.Helpers._
import silhouette.test._

trait MapControllerSpecHelper extends TestAuthEnvironment {
  import aurita.models.auth.{ IdentityImpl, UserReadable }
  import java.util.UUID
  import scala.concurrent.ExecutionContext
  import silhouette.api.LoginInfo

  implicit val executionContext: ExecutionContext = ExecutionContext.global

  val testUser: UserReadable = UserReadable(
    id = Some(1),
    groupName = "dummy",
    roleName = "fooRole",
    statusValue = "fooStatus",
    userId = UUID.randomUUID().toString,
    avatarURL = None,
    email = "test@meetsatori.com",
    firstName = Option("John"),
    lastName = Option("Doe"),
    username = "fooUser",
    usernameSuffix = Option(23)
  )

  val testLoginInfo: LoginInfo = LoginInfo(
    providerID = "credentials", providerKey = "test@meetsatori.com"
  )

  implicit val testIdentity: IdentityImpl =
    IdentityImpl(user = testUser, loginInfo = testLoginInfo)

  class WithDepsApplication()(
    implicit val executionContext: ExecutionContext
  ) extends TestApplication
}

@RunWith(classOf[JUnitRunner])
class MapControllerSpec extends MapControllerSpecHelper {

  "Map Controller" should {

    "get the map settings" in new WithDepsApplication {
      implicit val fakeRequest = FakeRequest(
        aurita.controllers.map.routes.MapController.getMapSettings
      ).withAuthenticator[DefaultEnv](testIdentity.loginInfo)
      val ans = route(app, fakeRequest).get
      status(ans) must equalTo(OK)
      contentType(ans) must beSome.which(_ == "application/json")
    }
  }
}
