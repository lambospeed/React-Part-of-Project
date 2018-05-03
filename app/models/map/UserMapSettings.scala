package aurita.models.map

import aurita.models.utility.Common

/** Provides saved map settings of a [[User user]].
  *
  * Data model for the
  * [[aurita.daos.auth.UserMapSettingsDAOInterface.UserMapSettingsDAOImpl.tableQuery user map settings]]
  * database table.
  *
  * @constructor create a new user map settings.
  * @param id the primary key.
  * @param userId the foreign key to the [[User user]].
  * @param centerLatitude the latitude of the map center.
  * @param centerLongitude the longitude of the map center.
  */
case class UserMapSettings(
  id: Option[Long], userId: Long, centerLatitude: Double, centerLongitude: Double
) extends Common[UserMapSettings] {
  import aurita.models.map.utility.GeoLocation

  def getCenterLocation: GeoLocation = GeoLocation(
    latitude = centerLatitude, longitude = centerLongitude
  )
}

/**
 * The companion object.
 */
object UserMapSettings {
  import play.api.libs.json.{ Json, OFormat }

  implicit lazy val jsonFormat: OFormat[UserMapSettings] = Json.format[UserMapSettings]
}
