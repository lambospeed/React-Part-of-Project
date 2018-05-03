package aurita.models.map.utility

/** Provides latitude and longtitude coordinates in a map.
  *
  * @constructor create a new geo location.
  * @param latitude the latitude component of the location on the map.
  * @param longitude the longitude component of the location on the map.
  */
case class GeoLocation(latitude: Double, longitude: Double) {
  require(
    latitude >= -90.0 && latitude <= 90.0,
    "Latitude must be between -90 & 90 degrees"
  )
  require(
    longitude >= -180.0 && longitude <= 180.0,
    "Longitude must be between -180 & 180 degrees"
  )
}

/**
 * The companion object.
 */
object GeoLocation {
  import play.api.libs.json.{ Json, OFormat }

  implicit lazy val jsonFormat: OFormat[GeoLocation] = Json.format[GeoLocation]
}
