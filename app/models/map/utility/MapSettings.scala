package aurita.models.map.utility

/**
 * Provides the saved settings of a Map.
 *
 * @constructor create a new map settings.
 * @param centerLocation the geolocation of the map center.
 */
case class MapSettings(centerLocation: GeoLocation)

/**
 * The companion Map Settings object.
 */
object MapSettings {
  import play.api.libs.json.{ Json, OFormat }

  /**
   * Converts the [[MapSettings Map Settings]] object to Json and vice versa.
   */
  implicit lazy val jsonFormat: OFormat[MapSettings] = Json.format[MapSettings]
}
