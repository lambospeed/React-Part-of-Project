package aurita.controllers.map.daos

import scala.concurrent.ExecutionContext
import slick.basic.DatabaseConfig
import slick.jdbc.JdbcProfile
import aurita.daos.map.{ UserMapSettingsDAO, UserMapSettingsDAOInterface }

/** Provides [[aurita.controllers.map.MapController Map Controller]] with access to DAO
  * objects.
  */
abstract class MapControllerDAO {
  /** The [[UserMapSettingsDAO user map settings DAO]] object. */
  val userMapSettingsDAO: UserMapSettingsDAO
}

/** Implementation of the [[MapControllerDAO Map Controller DAO]].
  *
  * @param dbConfig the database configuration telling Slick how to connect to
  * the JDBC database.
  * @param executionContext the [[https://www.scala-lang.org/api/current/scala/concurrent/ExecutionContext.html trait]] to execute tasks -java Runnable- often using a
  * thread pool under the hood.
  *
  */
class MapControllerDAOImpl(
  protected val dbConfig: DatabaseConfig[JdbcProfile]
)(implicit val executionContext: ExecutionContext) extends MapControllerDAO
  with UserMapSettingsDAOInterface {}

