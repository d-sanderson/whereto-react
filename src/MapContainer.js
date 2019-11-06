import React, { Component} from 'react';
import { GoogleApiWrapper} from 'google-maps-react';

import TripsTable from './TripsTable';
import RouteDisplay from './RouteDisplay';
const APIKEY = `${process.env.REACT_APP_API_KEY}`;

export class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      origin: '',
      destination: '',
      travelMode: 'DRIVING',
      distance: null,
      distanceNum: 0,
      duration: null,
      options: ['DRIVING', 'WALKING', 'TRANSIT', 'BICYCLING'],
      error: false,
      submitted: false,
    };
  }

  createTrip(origin, destination, distance, duration) {
    const { travelMode } = this.state;
    const trip = {
      origin: origin,
      destination: destination,
      travelMode: travelMode,
      distance: distance,
      duration: duration,
    };
    this.postTrip(trip);
  }

  postTrip(trip) {
    return fetch('http://localhost:3001/api/trips', {
      method: 'post',
      body: JSON.stringify(trip),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(this.props.checkStatus);
  }

  calculateDistance = () => {
    const { google } = this.props;
    const { origin, destination, travelMode } = this.state;
    const service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [destination],
        travelMode: travelMode,
      },
      (res, status) => {
        if (status === 'OK') {
          let statCheck = res.rows[0].elements[0].status
          console.log(statCheck)
          if(statCheck === 'ZERO_RESULTS') return
          let distance = res.rows[0].elements[0].distance.text;
          let distanceNum = res.rows[0].elements[0].distance.value / 1000;
          let duration = res.rows[0].elements[0].duration.text;
          let originAddress = res.originAddresses.toString();
          let destinationAddress = res.destinationAddresses.toString();
          this.setState({
            distance: distance,
            distanceNum: distanceNum,
            duration: duration,
          });
          this.createTrip(
            originAddress,
            destinationAddress,
            distance,
            duration
          );
        } else {
          this.setState({
            error: true,
          });
        }
      }
    );
  };

  updateOrigin = (origin, destination) => {
    this.setState({
      submitted: !this.state.submitted,
      origin: origin,
      destination: destination,
    })
  }

  handleSubmit = e => {
    e.preventDefault();
    this.calculateDistance();
    this.toggleSubmit();
  };

  toggleSubmit = () => {
    this.setState({
      submitted: !this.state.submitted,
    });
  }

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  handleTravelMode = (travelMode) => {
    return travelMode === 'DRIVING'
            ? '🚗'
            : travelMode === 'WALKING'
            ? '🚶🏻‍♂️'
            : travelMode === 'TRANSIT'
            ? '🚎'
            : '🚲'
  }

  render() {
    const { error, options, origin, destination, distanceNum, duration, travelMode, submitted } = this.state;
    const { data } = this.props;
    if (error) {
      return (
        <div>
          <h1>Error Communicating with the server</h1>
        </div>
      );
    }

    const travelModeButtons = options.map((option, i) => (
      <input
        className='travel-mode'
        type="button"
        key={i}
        onClick={this.handleChange}
        value={option}
        name="travelMode"
      />
    ));

    return (
      <div className='container'>
        <RouteDisplay
          google={this.props.google}
          destination={destination}
          origin={origin}
          submitted={submitted}
          travelMode={travelMode}
          distance={distanceNum}
          duration={duration}
          zoom={14}
          handleTravelMode={this.handleTravelMode}
        ></RouteDisplay>
        <TripsTable
        data={data}
        handleTravelMode={this.handleTravelMode}
        updateOrigin={this.updateOrigin}
        />

        <form className='form' onSubmit={this.handleSubmit}>
          <h2>Origin</h2>
          <label>Enter an Origin Address:</label>
          <input
            type="text"
            name="origin"
            value={origin}
            onChange={this.handleChange}
            required
          />

          <h2>Destination</h2>
          <label>Enter a Destination Address:</label>
          <input
            type="text"
            name="destination"
            value={destination}
            onChange={this.handleChange}
            required
          />

          <h2>Travel Mode</h2>
          <div><label>Select Mode of Transportation:</label></div>
          {travelModeButtons}
          <div>
            <input type="submit" value=" 💾 Submit" />
          </div>
        </form>


      </div>
    );
  }
}
export default GoogleApiWrapper({
  apiKey: APIKEY,
})(MapContainer);
