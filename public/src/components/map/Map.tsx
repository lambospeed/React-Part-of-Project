import * as React from 'react'
import * as redux from 'redux'
import { connect } from 'react-redux'
import { Redirect, RouteComponentProps, withRouter } from 'react-router-dom'
import { getMapSettings, resetMessages } from 'actions'
import { GeoPosition, MapSettings } from 'models/map'
import * as state from 'reducers'
import loadable from 'decorators/loadable'
import { IsSignedIn } from 'api'
import GMap from 'components/map/impl/gmap/GMap'
import { MapRef } from 'components/map/utility'
import {
  DatasetType, DATASETS, ImportedDatasetType, DatasetEntriesType
} from 'components/map/data'
import { dataFormatter } from 'components/map/data/dataFormatter'
import * as styles from './Map.scss'

type OwnProps = {} & RouteComponentProps<{}>

type MapState = { gettingMapSettings: boolean, mapSettings: MapSettings }

type ConnectedState = MapState & { error: string }

type ConnectedDispatch = { getMapSettings: () => void, resetMessages: () => void }

type IProps = ConnectedState & ConnectedDispatch & OwnProps

const mapStateToProps = (state: state.All, ownProps: OwnProps): ConnectedState => ({
  mapSettings: state.mapSettings,
  gettingMapSettings: state.gettingMapSettings,
  error: state.error
})

const mapDispatchToProps = (dispatch: redux.Dispatch<state.All>): ConnectedDispatch => ({
  getMapSettings: () => dispatch(getMapSettings({})),
  resetMessages: () => dispatch(resetMessages())
})

interface IState {
  mapRef: MapRef | undefined,
  activeId: number | undefined,
  markers: Array<DatasetEntriesType>
}

class MapComponent extends React.Component<IProps, IState> {

  constructor(props: IProps, state: IState) {
    super(props)
    this.state = { mapRef: undefined, markers: [], activeId: undefined }
    if (!this.props.mapSettings) { console.log("getting settings ..."); this.props.getMapSettings() }
  }

  shouldComponentUpdate(nextProps: IProps, nextState: IState): boolean {
    let isNewMarkers: boolean =
      this.state.markers.length !== nextState.markers.length
    if (
      !this.state.mapRef ||
      !isNewMarkers ||
      (isNewMarkers && !nextState.markers.length)
    ) { return false } else { return true }
  }

  /****
   * Download dataset function and pass them into state
   */  
  fetchDataset = () => {
    DATASETS.filter((d: DatasetType) => this.state.activeId == d.id).map(
      (dataset: DatasetType, i: number) => {
        const url = [dataset.url].join("")
        fetch(url)
          .then(res => res.json())
          .then((data: ImportedDatasetType) => {
            this.setState((current) => (
              { ...current, markers: this.state.markers.concat(dataFormatter(data)) }
            ))
          })
      }
    )
  }

  setRef = (mapRef0: MapRef) => {
    this.setState((current) => ({ ...current, mapRef: mapRef0 }))
  }

  onChangeEvent: (location: GeoPosition) => void = (location: GeoPosition) => {
    // console.log("New map location = ", location)
    if (this.state.mapRef) {
      // console.log("Map ref location = ", this.state.mapRef.getCenter())
    }
  }

  setDataset = (e: React.MouseEvent<HTMLElement>, datasetId: number) => {
    if (datasetId != this.state.activeId) {
      this.setState(
        (current) => ({ ...current, activeId: datasetId, markers: [] }),
        () => { this.fetchDataset() }
      )
    }
  }

  /****
   * Check if dataset with given id is active
   * @param id the id of the dataset to check
   * @return true if dataset is acive
   */
  isDatasetActive = (id: number) => {
    return id == this.state.activeId
  }

  render () {
    if (IsSignedIn()) {
      if (this.props.mapSettings) {
        console.log("Rendering map ... = ", this.props.mapSettings)
        return <div className = { styles['map']}>
          <header className = { styles['map-header']}>
            <h1 className = { styles['map-title']}>Welcome to Satori</h1>
            <div className = { styles['map-datasets']}>
              { DATASETS.map((dataset: DatasetType, index: number) => (
                  <button
                    key = { index }
                    onClick = { e => this.setDataset(e, dataset.id) }
                    style={{ marginRight: '5px' }}
                    className = { styles[this.isDatasetActive(dataset.id) ? 'active' : '']}
                  >
                    { dataset.datasetName }
                  </button>
                ))
              }
            </div>               
          </header>
          <GMap
            mapSettings = { this.props.mapSettings }
            setRef = { this.setRef }
            onChangeEvent = { this.onChangeEvent }
            markers = { this.state.markers }
          />
        </div>
      } else { return <div>Just a moment, please...</div> }
    } else { return <Redirect to='/' /> }
  }
}

const MapBusy = (p: MapState) => p.gettingMapSettings

const Map = withRouter(
  connect<ConnectedState, ConnectedDispatch, OwnProps>(
    mapStateToProps, mapDispatchToProps
  )(loadable(MapBusy)(MapComponent))
)

export default Map
