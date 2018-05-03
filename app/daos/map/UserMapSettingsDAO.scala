package aurita.daos.map

import scala.concurrent.Future
import aurita.daos.utility.{ DAOHelpers, CRUD }
import aurita.models.map.UserMapSettings
import aurita.daos.auth.UserDAOInterface
import aurita.models.map.utility.MapSettings
import slick.dbio.Effect.Write

/** Provide the declaration of data access methods associated with the
  * [[UserMapSettingsDAOInterface.UserMapSettingsDAOImpl.tableQuery user map settings]]
  * database table.
  *
  * The methods are defined in
  * [[UserMapSettingsDAOInterface.UserMapSettingsDAOImpl UserMapSettingsDAOImpl]].
  *
  */
trait UserMapSettingsDAO extends CRUD[UserMapSettings] {
  import slick.dbio.{ DBIOAction, NoStream }

  /** Get the [[UserMapSettings map settings]] associated with a
    * [[aurita.models.auth.User user]].
    *
    * @param userId the id of the user.
    * @return the [[UserMapSettings user map settings]].
    *
    */
  def getMapSettings(userId: Long): Future[MapSettings]

  /** Upserts a new [[aurita.models.map.utility.MapSettings map settings]] for a
    * [[aurita.models.auth.User user]].
    *
    * @param userId the id of the user.
    * @param settings the new [[aurita.models.map.utility.MapSettings map settings]].
    * @return the upserted [[UserMapSettings user map settings]].
    *
    */
  def upsertUserMapSettings(userId: Long, settings: MapSettings): Future[MapSettings]

  def createUserMapSettingsAction(
    userId: Long, settings: MapSettings
  ): DBIOAction[MapSettings, NoStream, Write]
}

/** Provides DAO interface for data access to the
  * [[UserMapSettingsDAOInterface.UserMapSettingsDAOImpl.tableQuery user map settings join]]
  * database table.
  *
  * ==Overview==
  * The implemented instance of [[UserMapSettingsDAO]] is accessed by mixing in
  * [[UserMapSettingsDAOInterface]]
  * {{{
  * class Foo(id: Long) extends UserMapSettingsDAOInterface {
  *   def fooFn: UserMapSettings = userMapSettingsDAO.findById(id)
  * }
  * }}}
  *
  * You can also access [[UserMapSettingsTable]]
  * {{{
  * class Foo() extends UserMapSettingsDAOInterface {
  *   val tableQuery: TableQuery[UserMapSettingsTable] =
  *     TableQuery[UserMapSettingsTable]
  * }
  * }}}
  */
trait UserMapSettingsDAOInterface extends DAOHelpers
  with UserDAOInterface {
  import profile.api._
  import com.softwaremill.macwire.wire
  import scala.concurrent.ExecutionContext

  implicit val executionContext: ExecutionContext

  /** The user map settings data access implementation instance. */
  lazy val userMapSettingsDAO: UserMapSettingsDAO = wire[UserMapSettingsDAOImpl]

  /** Implementation of data access methods associated with the
    * [[UserMapSettingsDAOImpl.tableQuery user map settings database table]].
    */
  class UserMapSettingsDAOImpl() extends UserMapSettingsDAO
    with CRUDImpl[UserMapSettingsTable, UserMapSettings] {
    import aurita.models.map.utility.GeoLocation
    import slick.dbio.Effect.Read

    /** The user map settings database table.
      * @see [[http://slick.typesafe.com/doc/3.1.0/schemas.html#table-query]]
      */
    protected val tableQuery = TableQuery[UserMapSettingsTable]

    lazy val logger = new aurita.utility.messages.Log(this.getClass)

    def getMapSettings(userId: Long): Future[MapSettings] = db.run(
      _getMapSettings(userId = userId)
    )

    def upsertUserMapSettings(
      userId: Long, settings: MapSettings
    ): Future[MapSettings] = {
      db.run(_upsertUserMapSettings(userId = userId, settings = settings))
    }

    def _upsertUserMapSettings(
      userId: Long, settings: MapSettings
    ): DBIOAction[MapSettings, NoStream, Read with Write] = (for {
      ms <- tableQuery.filter(_.userId === userId).result.headOption flatMap {
        _ match {
          case None => createUserMapSettingsAction(userId = userId, settings = settings)
          case Some(ums0) => _updateUserMapSettings(
            userId = userId, settings = settings
          ) flatMap { _ match {
            case true => slick.dbio.DBIOAction.successful(MapSettings(
              centerLocation = GeoLocation(
                latitude = settings.centerLocation.latitude,
                longitude = settings.centerLocation.longitude
              )
            ))
            case false => slick.dbio.DBIOAction.failed(new Exception(
              s"Unable to update ${ums0} with settings = ${settings}"
            ))
          } }
        }
      }
    } yield (ms))

    def _updateUserMapSettings(
      userId: Long, settings: MapSettings
    ): DBIOAction[Boolean, NoStream, Read with Write] = (for {
      status <- tableQuery.filter(_.userId === userId).map(
        m => (m.centerLatitude, m.centerLongitude)
      ).update(
        (settings.centerLocation.latitude, settings.centerLocation.longitude)
      ) flatMap {
        case 0 => slick.dbio.DBIOAction.successful(false)
        case _ => slick.dbio.DBIOAction.successful(true)
      }
    } yield (status))

    def createUserMapSettingsAction(
      userId: Long, settings: MapSettings
    ): DBIOAction[MapSettings, NoStream, Write] = (for {
      ums <- (tableQuery returning tableQuery.map(_.id) into (
        (ans, id) => ans.copy(id = Option(id))
      )) += UserMapSettings(
        id = None,
        userId = userId,
        centerLatitude = settings.centerLocation.latitude,
        centerLongitude = settings.centerLocation.longitude
      )
    } yield (MapSettings(centerLocation = GeoLocation(
      latitude = ums.centerLatitude, longitude = ums.centerLongitude
    ))))

    def _getMapSettings(userId: Long): DBIOAction[MapSettings, NoStream, Read] =
      tableQuery.filter(_.userId === userId).result.headOption flatMap { _ match {
        case Some(ums) => slick.dbio.DBIOAction.successful(MapSettings(
          centerLocation = GeoLocation(
            latitude = ums.centerLatitude, longitude = ums.centerLongitude
          )
        ))
        case None => slick.dbio.DBIOAction.failed(
          new Exception(s"Map settings not found for user with id = ${userId}")
        )
      } }
  }

  /** The user map settings database table row.
    * @see [[http://slick.typesafe.com/doc/3.1.0/schemas.html#table]]
    */
  class UserMapSettingsTable(tag: Tag) extends RichTable[UserMapSettings](
    tag = tag, name = "USER_MAP_SETTINGS"
  ) {
    def userId = column[Long]("USER_ID", DBType("BIGINT NOT NULL"))

    def centerLatitude = column[Double]("CENTER_LATITUDE", DBType("DOUBLE NOT NULL"))

    def centerLongitude = column[Double]("CENTER_LONGITUDE", DBType("DOUBLE NOT NULL"))

    def userMapSettingsUC =
      index("UMSETTINGS_USER_UC", userId, unique = true)

    def userFK =
      foreignKey("UMSETTINGS_USER_FK", userId, TableQuery[UserTable])(_.id)

    def * = (
      id.?,
      userId,
      centerLatitude,
      centerLongitude
    ) <> ((UserMapSettings.apply _).tupled, UserMapSettings.unapply)

    def ? = (
      id.?,
      userId,
      centerLatitude,
      centerLongitude
    ).shaped <> (
      {
        r =>
          import r._
          _1.map(_ => (UserMapSettings.apply _).tupled((_1, _2, _3, _4)))
      },
      maybeUnapply
    )
  }
}
