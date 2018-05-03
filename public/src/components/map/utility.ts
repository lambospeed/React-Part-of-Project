import { GeoPosition, MapSettings } from 'models/map'
import { DatasetEntriesType } from 'components/map/data'

/**
 * Common props for all Map implementations.
 */
export type ChildMapProps = {
  /**
    * Called when the map center position changes.
    * @param location the new center location of the map.
    */
  onChangeEvent: (location: GeoPosition) => void,

  /**
    * Save the Map impl reference in the Map wrapper.
    * @param mapRef0 the Map reference wrapper containing the Map impl reference to save.
    */
  setRef: (mapRef0: MapRef) => void,

  /* The user map settings. */
  mapSettings: MapSettings

  markers: Array<DatasetEntriesType>
}

/**
 * Base class for referencing the Map.
 */
export abstract class MapRef {
  /**
    * Gets the current map center position.
    * @returns the current map center or undefined if there is none.
    */
  abstract getCenter(): GeoPosition | undefined
}



/**
 * PixelPositionOffset calculator, used for calculate padding between Marker and OverlayView
 */
export const GetPixelPositionOffset = (width: number, height: number) => ({
  x: -(width / 2),
  y: -(height / 2),
})
