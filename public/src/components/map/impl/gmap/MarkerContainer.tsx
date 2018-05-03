import * as React from 'react';
import { Marker, OverlayView } from 'react-google-maps'
import { DatasetEntriesType } from 'components/map/data'
import { GetPixelPositionOffset } from '../../utility'
import * as styles from './GMap.css'
import * as lodash from 'lodash';

interface MarkerContainerProps {
  marker: DatasetEntriesType;
  key: number;
}

interface MarkerContainerState {
  opened: Array<number>;
}

export default class MarkerContainer extends React.Component<MarkerContainerProps, MarkerContainerState> {
    constructor(props: MarkerContainerProps) { 
      super(props);
      this.state = {opened: []}; 
    }

    /**
     * Toggle function for toogle *visibility* of marker.
     * @param {number} id MarkerId
     */
    onClick = ((id: number) => {
      let newOpened:never[] = lodash.xor(this.state.opened, [id]) as never[]
      return this.setState({opened: newOpened});      
    })

    render() {
      let { marker } = this.props;
      let { opened } = this.state;
      return (<div>
        <Marker
          position = {{ lat: marker.latitude, lng: marker.longitude }}
          onClick = { ((e) => this.onClick(marker.id)) }
        />
        { (opened && opened.find(
            (id: number) => id == marker.id
          )) ? <OverlayView
            position = {{ lat: marker.latitude, lng: marker.longitude }}
            mapPaneName = { OverlayView.OVERLAY_MOUSE_TARGET }
            getPixelPositionOffset = { GetPixelPositionOffset }
          >
            <div className = { styles['map-marker'] }>
              <a target="_blank" href={ marker.url }>{ marker.title }</a>
            </div>
          </OverlayView> : ''
        }
      </div>)
    }
}