
import React from 'react';
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

export const RouteDisplay2 = (props) => {


  const [miles, setMiles] = React.useState([])
//   componentDidUpdate(prevProps, prevState) {
//     if (this.props.submitted !== prevProps.submitted) {
//       this.loadRoute();
//     }
//   }

  function loadRoute() {
    if (props && props.google) {
      const { google, origin, destination, travelMode } = props;
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

      let { zoom } = props;
      let { lat, lng } = props.initialCenter;
      const center = new maps.LatLng(lat, lng);
      const mapConfig = Object.assign(
        {},
        {
          center: center,
          zoom: zoom,
        }
      );

      const mapRef = React.useRef();
      const node = ReactDOM.findDOMNode(mapRef);

      const map = new maps.Map(node, mapConfig);
      directionsRenderer.setMap(map);
    }
  }

    const style = Object.assign({}, mapStyles.map);
    const { distance, duration, submitted, travelMode, handleTravelMode } = props;
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
            onClick={()=>setMiles({
              miles: !miles
            })}
          />
          <h4>⏱ {duration}</h4>
        </div>: ''
          }
      </div>
    );
  }
export default RouteDisplay2;

RouteDisplay2.defaultProps = {
  zoom: 14,
  initialCenter: {
    lat: 35.0844,
    lng: -106.6504,
  },
  visible: true,
  distance: 0,
  duration: 0
};

