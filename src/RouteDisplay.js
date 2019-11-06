
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import CountUp from 'react-countup';
const mapStyles = {
  map: {
    border: '1px solid black',
    width: '500px',
    height: '300px',
    zIndex: '-1'
  },
};

export class RouteDisplay extends Component {
  constructor(props) {
    super(props)
    this.state = {
      miles: false,
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.google !== this.props.google || prevProps.origin !== this.props.origin || prevProps.destination !== this.props.destination) {
      this.loadRoute();
    }
    if (this.props.submitted !== prevProps.submitted) {
      this.loadRoute();
    }
  }

  loadRoute() {
    if (this.props && this.props.google) {
      const { google, origin, destination, travelMode } = this.props;
      const maps = google.maps;

      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer();

      directionsService.route(
        {
          origin: { query: origin },
          destination: { query: destination },
          travelMode: travelMode,
        },
        (response, status) => {
          status === 'OK'
            ? directionsRenderer.setDirections(response)
            : window.alert('Directions request failed due to ' + status + '. Record not saved, try again.');
        }
      );

      let { zoom } = this.props;
      let { lat, lng } = this.props.initialCenter;
      const center = new maps.LatLng(lat, lng);
      const mapConfig = Object.assign(
        {},
        {
          center: center,
          zoom: zoom,
        }
      );

      const mapRef = this.refs.map;
      const node = ReactDOM.findDOMNode(mapRef);

      this.map = new maps.Map(node, mapConfig);
      directionsRenderer.setMap(this.map);
    }
  }

  render() {
    const style = Object.assign({}, mapStyles.map);
    const { distance, duration, submitted, travelMode, handleTravelMode } = this.props;
    const { miles } = this.state;
    return (
      <div>
        <div style={style} ref="map">
          Enter an Origin and Destination.
        </div>
        {submitted ?
        <div className='dashboard'>
          {handleTravelMode(travelMode)}

         {!miles ?
            <div>
              <CountUp end={distance} /> <span>km</span>
            </div>:
            <div>
              <CountUp end={distance * 0.621371} /> <span>mi</span>
            </div>}

          <input
            className='convert-btn'
            type='button'
            value={miles ? '>>KM' : '>>MI'}
            onClick={()=>this.setState({
              miles: !miles
            })}
          />
          <h4>⏱ {duration}</h4>
        </div>: ''
          }
      </div>
    );
  }
}
export default RouteDisplay;

RouteDisplay.defaultProps = {
  zoom: 14,
  initialCenter: {
    lat: 35.0844,
    lng: -106.6504,
  },
  visible: true,
  distance: 0,
  duration: 0
};

