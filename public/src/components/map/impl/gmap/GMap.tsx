import * as React from 'react'
import {
  GoogleMap, withGoogleMap, withScriptjs
} from 'react-google-maps'
import { GeoPosition } from 'models/map'
import { compose, withProps, withHandlers } from 'recompose'
// import HeatmapLayer from 'react-google-maps/lib/components/visualization/HeatmapLayer'
import { ChildMapProps } from 'components/map/utility'
import { MapRef } from 'components/map/utility'
import 'components/map/impl/gmap/GMap.css'
import {
  default as MarkerClusterer
} from 'react-google-maps/lib/components/addons/MarkerClusterer'
import { DatasetEntriesType } from 'components/map/data'
import MarkerContainer from './MarkerContainer';

type OwnProps = {
  onChange?: () => void,
  onMapMounted?: () => void,
  onMarkerClustererClick?: () => void,
}

type GMapProps = OwnProps & ChildMapProps

interface GMapState { }

/**
  * Contains the underlying Map impl reference.
  *
  */
class GMapRef extends MapRef {
  private _ref: google.maps.Map

  constructor(ref: google.maps.Map) {
    super()
    this._ref = ref
  }

  getCenter(): GeoPosition | undefined {
    if (this._ref) {
      let pos: google.maps.LatLng = this._ref.getCenter()
      return { latitude: pos.lat(), longitude: pos.lng() }
    } else { return undefined }
  }
}

export default class GMap extends React.Component<GMapProps, GMapState> {
  constructor(props: GMapProps) { super(props) }

  shouldComponentUpdate(nextProps: GMapProps, nextState: GMapState) {
    let isNewMarkers: boolean =
      this.props.markers.length !== nextProps.markers.length
    console.log("Is new markers = ", isNewMarkers)
    if (isNewMarkers) { return true } else { return false }
  }

  render() {
    const GOOGLE_MAP_URL: string = 'https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyBDdi6FWp1FF-aUJtE8DZyPJAlLtMMNwkE&libraries=visualization'
    let MyGoogleMap: React.ComponentClass<any> = compose<GMapProps, GMapState>(
      withProps({
        googleMapURL: GOOGLE_MAP_URL,
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `400px` }} />,
        mapElement: <div style={{ height: `100%` }} />
      }),
      withHandlers(() => {
        type MapObj = { map: google.maps.Map | undefined }
        const refs: MapObj = { map: undefined }
        return {
          onMapMounted: () => (ref: google.maps.Map) => {
            console.log('onMapMounted')
            this.props.setRef(new GMapRef(ref))
            refs.map = ref
          },
          onChange: (props: GMapProps) => () => {
            const map: google.maps.Map | undefined = refs.map
            if (map) {
              let location: GeoPosition = {
                latitude: map.getCenter().lat(), longitude: map.getCenter().lng()
              }
              this.props.onChangeEvent(location)
            }
          },
          onMarkerClustererClick: () => (markerClusterer: any) => {
            const clickedMarkers = markerClusterer.getMarkers()
            console.log(`Current clicked markers length: ${clickedMarkers.length}`)
            console.log(clickedMarkers)
          }
        }
      }),
      withScriptjs,
      withGoogleMap
    )(props => <GoogleMap
      defaultCenter = {
        {
          lat: this.props.mapSettings.centerLocation.latitude,
          lng: this.props.mapSettings.centerLocation.longitude
        }
      }
      defaultZoom = { 3 }
      defaultMapTypeId = { 'satellite' }
      onCenterChanged = { props.onChange }
      ref = { props.onMapMounted }
      options = {{ disableDefaultUI: false }}
    >
      <MarkerClusterer
        onClick = { props.onMarkerClustererClick }
        averageCenter
        enableRetinaIcons
        gridSize = { 60 }
      >
        { this.props.markers.map((marker: DatasetEntriesType, index: number) => (
          <MarkerContainer key={index} marker={marker} />
        )) }
      </MarkerClusterer>
    </GoogleMap>
  )
  return <MyGoogleMap/>
 }
}