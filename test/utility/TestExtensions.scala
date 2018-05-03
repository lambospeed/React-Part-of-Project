package aurita.test.utility

import _root_.controllers.AssetsComponents
import aurita.actors.SocketClientFactory
import aurita.{ AppComponents, AuritaAppLoader }
import aurita.controllers.auth.daos.AuthControllerDAO
import aurita.controllers.map.daos.MapControllerDAO
import aurita.daos.auth.{
  UserDAO, UserService, UserTokenDAO, UserXGroupDAO
}
import aurita.daos.map.UserMapSettingsDAO
import aurita.models.auth.{ IdentityImpl, User }
import aurita.utility.auth.DefaultEnv
import aurita.utility.mail.Mailer
import com.mohiva.play.silhouette
import com.softwaremill.macwire.wire
import org.specs2.mock.Mockito
import org.specs2.mutable.SpecificationLike
import play.api.{
  ApplicationLoader,
  BuiltInComponents,
  BuiltInComponentsFromContext,
  NoHttpFiltersComponents
}
import play.api.ApplicationLoader.Context
import play.api.db.slick.evolutions.SlickEvolutionsComponents
import play.api.db.slick.DbName
import play.api.db.slick.SlickComponents
import play.api.cache.ehcache.EhCacheComponents
import play.api.libs.ws.ahc.AhcWSComponents
import scala.concurrent.{ ExecutionContext, Future }
import silhouette.api.Environment
import silhouette.api.LoginInfo
import silhouette.api.util.PasswordInfo
import silhouette.persistence.daos.DelegableAuthInfoDAO
import slick.basic.DatabaseConfig
import slick.jdbc.JdbcProfile

class TestApplicationLoader(
  appBuilder: Context => BuiltInComponentsFromContext
) extends ApplicationLoader {
  import play.api.ApplicationLoader.Context
  import play.api.BuiltInComponentsFromContext
  import play.api.LoggerConfigurator

  def load(context: Context) = {
    // make sure logging is configured
    LoggerConfigurator(context.environment.classLoader).foreach {
      _.configure(context.environment)
    }
    appBuilder(context).application
  }
}

trait TestEnvironment extends SpecificationLike
  with Mockito {
  import play.api.test.WithApplicationLoader
  import org.specs2.specification.Scope

  abstract class TestSimpleApplication
    extends WithApplicationLoader(new TestApplicationLoader(
      context => new TestSimpleAppComponents(context)
    )) with TestSlickApi with Scope

  abstract class ExistingComponentsApplication
    extends WithApplicationLoader(new TestApplicationLoader(
      context => new AppComponents(context)
    )) with Scope
}

trait TestAuthEnvironment extends SpecificationLike
  with Mockito {
  import play.api.test.WithApplicationLoader
  import org.specs2.specification.Scope
  import silhouette.test.FakeEnvironment

  implicit val testIdentity: IdentityImpl

  implicit val executionContext: ExecutionContext

  implicit lazy val authEnv: Environment[DefaultEnv] =
    FakeEnvironment[DefaultEnv](Seq(testIdentity.loginInfo -> testIdentity))

  abstract class TestApplication
    extends WithApplicationLoader(new TestApplicationLoader(
      context => new TestAppComponents(context)
    )) with TestSlickApi with Scope
}

class TestSimpleAppComponents(
  context: Context
) extends TestSlickComponents(context: Context)
  with NoHttpFiltersComponents {
  import play.api.routing.{ Router, SimpleRouter }
  import _root_.router.Routes

  lazy val router: Router = new SimpleRouter {
    def routes: Router.Routes = Map.empty
  }
}

class TestAppComponents(context: Context)(
  implicit
  val testIdentity: IdentityImpl, implicit val authEnv: Environment[DefaultEnv]
) extends TestSlickComponents(context)
  with TestSilhouetteContext
  with EhCacheComponents
  with AssetsComponents
  with NoHttpFiltersComponents
  with AhcWSComponents {
  import _root_.router.Routes
  import aurita.controllers.auth.{
    ForgotPasswordController,
    SignInController,
    SignUpController,
    SocialAuthController
  }
  import aurita.controllers.HomeController
  import aurita.controllers.map.MapController
  import aurita.MainActorSystemTag
  import com.softwaremill.tagging._
  import play.api.cache.AsyncCacheApi
  import play.api.Configuration
  import play.api.routing.Router

  lazy implicit val myConfiguration: Configuration = configuration

  lazy val cacheApi: AsyncCacheApi = defaultCacheApi

  lazy val prefix: String = "/"
  lazy val router: Router = wire[Routes]

  lazy val mailer: Mailer = wire[TestMailerImpl]
  lazy val mainActorSystem = actorSystem.taggedWith[MainActorSystemTag]
  lazy val userDAO: UserDAO = wire[TestUserDAO]
  lazy val userMapSettingsDAO: UserMapSettingsDAO = wire[TestUserMapSettingsDAO]
  lazy val userTokenDAO: UserTokenDAO = wire[TestUserTokenDAO]
  lazy val userXGroupDAO: UserXGroupDAO = wire[TestUserXGroupDAO]
  lazy val authControllerDAO: AuthControllerDAO = wire[TestAuthControllerDAOImpl]
  lazy val mapControllerDAO: MapControllerDAO = wire[TestMapControllerDAOImpl]
  lazy val socketClientFactory: SocketClientFactory = wire[TestSocketClientFactory]
  lazy val homeController: HomeController = wire[HomeController]
  lazy val mapController: MapController = wire[MapController]
  lazy val forgotPasswordController: ForgotPasswordController =
    wire[ForgotPasswordController]
  lazy val signInController: SignInController = wire[SignInController]
  lazy val signUpController: SignUpController = wire[SignUpController]
  lazy val socialAuthController: SocialAuthController = wire[SocialAuthController]
}

class TestSocketClientFactory() extends SocketClientFactory {
  import akka.actor.Props

  lazy val name: Option[String] = None
  def socketClientProps(userId: Long): Props = Props.empty
}

abstract class TestSlickComponents(context: Context)
  extends BuiltInComponentsFromContext(context)
  with SlickComponents
  with SlickEvolutionsComponents {
  import play.api.db.slick.DbName
  import play.api.db.evolutions.Evolutions
  import play.api.inject.{ SimpleInjector, Injector, NewInstanceInjector }

  // Define your dependencies and controllers
  lazy val dbConfig: DatabaseConfig[JdbcProfile] =
    slickApi.dbConfig[JdbcProfile](DbName("test"))

  override lazy val injector: Injector =
    new SimpleInjector(NewInstanceInjector) +
      router +
      cookieSigner +
      csrfTokenSigner +
      httpConfiguration +
      slickApi
  lazy val dbNameVal: String = TestSlickComponents.dbName.value
  Evolutions.cleanupEvolutions(database = dbApi.database(dbNameVal), autocommit = true)
  Evolutions.applyEvolutions(database = dbApi.database(dbNameVal), autocommit = true)
}

object TestSlickComponents { lazy val dbName: DbName = DbName("test") }

trait TestSlickApi {
  import play.api.Application
  import play.api.db.slick.SlickApi

  def app: Application

  lazy val api: SlickApi = app.injector.instanceOf[SlickApi]
  protected val dbConfig: DatabaseConfig[JdbcProfile] =
    api.dbConfig[JdbcProfile](TestSlickComponents.dbName)
}

trait TestSilhouetteContext {
  import play.api.mvc.BodyParsers
  import silhouette.api.services.AvatarService
  import silhouette.impl.services.GravatarService
  import silhouette.api.{ Silhouette, SilhouetteProvider }
  import silhouette.api.actions.{
    SecuredAction,
    SecuredErrorHandler,
    SecuredRequestHandler,
    UnsecuredAction,
    UnsecuredErrorHandler,
    UnsecuredRequestHandler,
    UserAwareAction,
    UserAwareRequestHandler,
    DefaultSecuredAction,
    DefaultSecuredErrorHandler,
    DefaultSecuredRequestHandler,
    DefaultUnsecuredAction,
    DefaultUnsecuredErrorHandler,
    DefaultUnsecuredRequestHandler,
    DefaultUserAwareAction,
    DefaultUserAwareRequestHandler
  }
  import silhouette.api.repositories.AuthInfoRepository
  import silhouette.persistence.repositories.DelegableAuthInfoRepository
  import silhouette.api.util.{ HTTPLayer, PlayHTTPLayer }
  import silhouette.api.util.{
    Clock,
    PasswordHasher,
    PasswordHasherRegistry
  }
  import silhouette.password.BCryptPasswordHasher
  import silhouette.impl.providers.{
    CredentialsProvider,
    SocialProviderRegistry
  }
  import play.api.libs.ws.WSClient
  import play.api.i18n.MessagesApi

  implicit val executionContext: ExecutionContext
  implicit val authEnv: Environment[DefaultEnv]
  implicit val testIdentity: IdentityImpl

  implicit val materializer: akka.stream.Materializer

  val silhouetteDefaultBodyParser: BodyParsers.Default = new BodyParsers.Default
  val wsClient: WSClient
  val messagesApi: MessagesApi

  lazy val socialProviderRegistry: SocialProviderRegistry = SocialProviderRegistry(
    Seq()
  )

  lazy val securedErrorHandler: SecuredErrorHandler =
    wire[DefaultSecuredErrorHandler]
  lazy val securedRequestHandler: SecuredRequestHandler =
    wire[DefaultSecuredRequestHandler]
  lazy val securedAction: SecuredAction = wire[DefaultSecuredAction]
  lazy val unsecuredErrorHandler: UnsecuredErrorHandler =
    wire[DefaultUnsecuredErrorHandler]
  lazy val unsecuredRequestHandler: UnsecuredRequestHandler =
    wire[DefaultUnsecuredRequestHandler]
  lazy val unsecuredAction: UnsecuredAction = wire[DefaultUnsecuredAction]
  lazy val userAwareRequestHandler: UserAwareRequestHandler =
    wire[DefaultUserAwareRequestHandler]
  lazy val userAwareAction: UserAwareAction = wire[DefaultUserAwareAction]
  lazy val silhouetteEnv: Silhouette[DefaultEnv] = wire[SilhouetteProvider[DefaultEnv]]
  lazy val userService: UserService = wire[TestUserService]
  lazy val passwordHasher: PasswordHasher = new BCryptPasswordHasher
  lazy val passwordHasherRegistry: PasswordHasherRegistry =
    new PasswordHasherRegistry(current = passwordHasher)
  lazy val passwordInfoDelegableDAO: DelegableAuthInfoDAO[PasswordInfo] =
    new TestPasswordInfoDAO
  lazy val httpLayer: HTTPLayer = wire[PlayHTTPLayer]
  lazy val avatarService: AvatarService = new GravatarService(httpLayer = httpLayer)
  lazy val authInfoRepository: AuthInfoRepository =
    new DelegableAuthInfoRepository(passwordInfoDelegableDAO)
  lazy val credentialsProvider: CredentialsProvider = wire[CredentialsProvider]
  lazy val clock: Clock = wire[Clock]
}

class TestPasswordInfoDAO extends DelegableAuthInfoDAO[PasswordInfo] {
  implicit val executionContext: ExecutionContext = ExecutionContext.global

  lazy val _testPasswordInfo: PasswordInfo = PasswordInfo(
    hasher = "abcde123456", password = "abcd4567", salt = Some("09876zyxwv")
  )

  def add(loginInfo: LoginInfo, authInfo: PasswordInfo): Future[PasswordInfo] =
    Future { _testPasswordInfo }
  def find(loginInfo: LoginInfo): Future[Option[PasswordInfo]] =
    Future { Some(_testPasswordInfo) }
  def update(
    loginInfo: LoginInfo, authInfo: PasswordInfo
  ): Future[PasswordInfo] = Future { _testPasswordInfo }
  def save(
    loginInfo: LoginInfo, authInfo: PasswordInfo
  ): Future[PasswordInfo] = Future { _testPasswordInfo }
  def remove(loginInfo: LoginInfo): Future[Unit] = Future {}
}

class TestUserService(
  implicit val testIdentity: IdentityImpl, authEnv: Environment[DefaultEnv]
) extends UserService {
  import aurita.models.auth.UserXLoginInfo
  import silhouette.impl.providers.CommonSocialProfile

  implicit val executionContext: ExecutionContext = ExecutionContext.global

  lazy val testUserLoginInfo: UserXLoginInfo = UserXLoginInfo(
    id = Some(1), loginInfoId = 1, userId = 1
  )

  def insert(identity: IdentityImpl): Future[UserXLoginInfo] =
    Future.successful(testUserLoginInfo)

  def retrieve(loginInfo: LoginInfo): Future[Option[IdentityImpl]] =
    Future.successful(Some(testIdentity))

  /**
   * Saves the social profile for a user.
   *
   * If a user exists for this profile then update the user,
   * otherwise create a new user with the given profile.
   *
   * @param profile The social profile to save.
   * @param suffix the username suffix
   * @return The user for whom the profile was saved.
   */
  override def save(
    profile: CommonSocialProfile, suffix: Option[Int]
  ): Future[IdentityImpl] = Future.successful(testIdentity)
}

class TestMailerImpl extends Mailer {
  import play.api.i18n.MessagesProvider

  def welcome(email: String, name: String, link: String)(
    implicit
    messagesProvider: MessagesProvider
  ): Unit = {}

  def postSignUpWelcome(email: String, name: String)(
    implicit
    messagesProvider: MessagesProvider
  ): Unit = {}

  def forgotPassword(email: String, name: String, link: String)(
    implicit
    messagesProvider: MessagesProvider
  ): Unit = {}

  def error(name: String, mesg: String)(
    implicit
    messagesProvider: MessagesProvider
  ): Unit = {}
}

class TestUserTokenDAO() extends UserTokenDAO {
  import aurita.models.auth.UserToken
  import aurita.models.auth.utility.ResetPasswordData
  import java.sql.Timestamp

  implicit val executionContext: ExecutionContext = ExecutionContext.global

  lazy val expiresOn: Timestamp =
    (new Timestamp(System.currentTimeMillis + 100000))

  lazy val testUserToken: UserToken =
    UserToken(
      id = Some(1),
      tokenId = "abcde12345",
      userId = 1,
      expiresOn = expiresOn
    )

  lazy val testUser: User =
    User(
      id = Some(1),
      groupId = 1,
      roleId = 4,
      statusId = 5,
      userId = "fsDD5845",
      avatarURL = None,
      email = "foo@gmail.com",
      firstName = Some("Joe"),
      lastName = Some("Doe"),
      username = "foo",
      usernameSuffix = None
    )

  lazy val testLoginInfo: silhouette.api.LoginInfo =
    silhouette.api.LoginInfo(
      providerID = "credentials", providerKey = "foo@gmail.com"
    )

  lazy val testResetPasswordData: ResetPasswordData = ResetPasswordData(
    loginInfo = testLoginInfo,
    token = testUserToken,
    user = testUser
  )

  def findByTokenId(tokenId: String): Future[Option[UserToken]] =
    Future { Option(testUserToken) }

  def insert(token: UserToken): Future[UserToken] = Future { testUserToken }

  def upsert(token: UserToken): Future[UserToken] = Future { testUserToken }

  def getResetPasswordDataByUserId(
    userId: Long
  ): Future[Option[ResetPasswordData]] =
    Future { Option(testResetPasswordData) }

  def findByUserId(userId: Long): Future[Option[UserToken]] =
    Future { Some(testUserToken) }

  def deleteByTokenId(tokenId: String): Future[Int] = Future { 1 }
}

class TestMapControllerDAOImpl(
  val userMapSettingsDAO: UserMapSettingsDAO
) extends MapControllerDAO {}

class TestAuthControllerDAOImpl(
  val userTokenDAO: UserTokenDAO, val userDAO: UserDAO, val userXGroupDAO: UserXGroupDAO
) extends AuthControllerDAO {}

class TestUserDAO() extends UserDAO {
  import aurita.models.auth.UserReadable

  implicit val executionContext: ExecutionContext = ExecutionContext.global

  lazy val _testUser: User =
    User(
      id = Some(1),
      groupId = 1,
      roleId = 4,
      statusId = 5,
      userId = "fsDD5845",
      avatarURL = None,
      email = "foo@gmail.com",
      firstName = Some("Joe"),
      lastName = Some("Doe"),
      username = "foo",
      usernameSuffix = None
    )

  lazy val _testUserReadable: UserReadable =
    UserReadable(
      id = Some(1),
      groupName = "fooGroup3",
      roleName = "fooRole4",
      statusValue = "fooStatus5",
      userId = "fsDD5845",
      avatarURL = None,
      email = "foo@gmail.com",
      firstName = Some("Joe"),
      lastName = Some("Doe"),
      username = "foo",
      usernameSuffix = None
    )

  def length: Future[Int] = Future { 1 }

  def fullUsernameExists(
    username: String, suffix: Option[Int]
  ): Future[Boolean] = Future { true }

  def findById(id: Long): Future[Option[User]] = Future { Option(_testUser) }

  def findByEmail(email: String): Future[Option[User]] = Future { Option(_testUser) }

  def findByUsername(username: String): Future[Option[User]] = Future { Option(_testUser) }

  def findUserReadableById(id: Long): Future[Option[UserReadable]] =
    Future { Option(_testUserReadable) }

  def isValidUsernameOrEmail(username: String, email: String): Future[Boolean] =
    Future { true }

  def updateStatus(id: Long, statusValue: String): Future[Int] = Future { 1 }

  def all: Future[Seq[User]] = Future { Seq(_testUser) }
}

class TestUserXGroupDAO() extends UserXGroupDAO {}

class TestUserMapSettingsDAO() extends UserMapSettingsDAO {
  import aurita.models.map.utility.{ GeoLocation, MapSettings }
  import slick.dbio.{ DBIOAction, NoStream }
  import slick.dbio.Effect.Write

  implicit val executionContext: ExecutionContext = ExecutionContext.global

  lazy val _mapSettings: MapSettings =
    MapSettings(centerLocation = GeoLocation(latitude = 20.1, longitude = -89.3))

  def getMapSettings(userId: Long): Future[MapSettings] = Future { _mapSettings }

  def upsertUserMapSettings(userId: Long, settings: MapSettings): Future[MapSettings] =
    Future { _mapSettings }

  def createUserMapSettingsAction(
    userId: Long, settings: MapSettings
  ): DBIOAction[MapSettings, NoStream, Write] = slick.dbio.DBIOAction.successful(
    _mapSettings
  )
}
