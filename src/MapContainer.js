import React, { Component, Fragment } from 'react';
import { GoogleApiWrapper, Map, Polyline } from 'google-maps-react';

import Trip from './Trip';
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
          let distance = res.rows[0].elements[0].distance.text;
          let duration = res.rows[0].elements[0].duration.text;
          let originAddress = res.originAddresses.toString();
          let destinationAddress = res.destinationAddresses.toString();
          this.setState({
            distance: distance,
            duration: duration,
          });
          this.createTrip(
            originAddress,
            destinationAddress,
            distance,
            duration
          );
        } else {
          console.log(status);
          this.setState({
            error: true,
          });
        }
      }
    );
  };

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

  render() {
    const { error, options, origin, destination } = this.state;
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
        type="button"
        key={i}
        onClick={this.handleChange}
        value={option}
        name="travelMode"
      />
    ));

    let trips = data.map((trip, i) => (
      <Trip
        key={i}
        destination={trip.destination}
        origin={trip.origin}
        travelMode={
          trip.travelMode === 'DRIVING'
            ? '🚗'
            : trip.travelMode === 'WALKING'
            ? '🚶🏻‍♂️'
            : trip.travelMode === 'TRANSIT'
            ? '🚎'
            : '🚲'
        }
        distance={trip.distance}
        duration={trip.duration}
      />
    ));
    return (
      <>
        <TripsTable trips={trips} />

        <form onSubmit={this.handleSubmit}>
          <h1>Origin</h1>
          <label>Enter Origin Address</label>
          <input
            type="text"
            name="origin"
            value={origin}
            onChange={this.handleChange}
            required
          />

          <h1>Destination</h1>
          <label>Enter Destination Address</label>
          <input
            type="text"
            name="destination"
            value={destination}
            onChange={this.handleChange}
            required
          />

          <h1>Travel Mode</h1>
          <label>Select Mode of Transportation</label>
          {travelModeButtons}
          <div>
            <input type="submit" value="submit" />
          </div>
        </form>

        <RouteDisplay
          google={this.props.google}
          destination={this.state.destination}
          origin={this.state.origin}
          submitted={this.state.submitted}
          travelMode={this.state.travelMode}
          zoom={14}
        ></RouteDisplay>
      </>
    );
  }
}
export default GoogleApiWrapper({
  apiKey: APIKEY,
})(MapContainer);
