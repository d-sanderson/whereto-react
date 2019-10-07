import React, { Component } from 'react';
import ReactDOM from 'react-dom';

const mapStyles = {
  map: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
};

export class RouteDisplay extends Component {
  constructor(props) {
    super(props);
    const { lat, lng } = this.props.initialCenter;
    this.state = {
      currentLocation: {
        lat: lat,
        lng: lng,
      },
    };
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.google !== this.props.google) {
      this.loadMap();
    }
    if (prevState.currentLocation !== this.state.currentLocation) {
      this.recenterMap();
    }
    if (this.props.submitted !== prevProps.submitted) {
      this.loadRoute();
    }
  }

  componentDidMount() {
    if (this.props.centerAroundCurrentLocation) {
      if (navigator && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
          const coords = pos.coords;
          this.setState({
            currentLocation: {
              lat: coords.latitude,
              lng: coords.longitude,
            },
          });
        });
      }
    }
  }

  loadRoute() {
    if (this.props && this.props.google) {
      const { google } = this.props;
      const maps = google.maps;

      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer();

      directionsService.route(
        {
          origin: { query: this.props.origin },
          destination: { query: this.props.destination },
          travelMode: this.props.travelMode,
        },
        function(response, status) {
          if (status === 'OK') {
            directionsRenderer.setDirections(response);
            console.log(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        }
      );

      let { zoom } = this.props;
      const { lat, lng } = this.state.currentLocation;
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

  renderChildren() {
    const { children } = this.props;
    if (!children) return;

    return React.Children.map(children, c => {
      if (!c) return;
      return React.cloneElement(c, {
        map: this.map,
        google: this.props.google,
        mapCenter: this.state.currentLocation,
      });
    });
  }

  recenterMap() {
    const map = this.map;
    const current = this.state.currentLocation;

    const google = this.props.google;
    const maps = google.maps;

    if (map) {
      let center = new maps.LatLng(current.lat, current.lng);
      map.panTo(center);
    }
  }

  render() {
    const style = Object.assign({}, mapStyles.map);
    return (
      <div>
        <div style={style} ref="map">
          Enter an Origin and Destination.
        </div>
        {this.renderChildren()}
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
  centerAroundCurrentLocation: false,
  visible: true,
};
