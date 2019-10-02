import React, { Component } from 'react';
import { GoogleApiWrapper } from 'google-maps-react';
const APIKEY = `${process.env.REACT_APP_API_KEY}`

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
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.duration === nextState.duration ||
      this.state.distance === nextState.distance) {
        return false
      }
    else {
        return true;
      }
  }

  createTrip(distance, duration, origin, destination) {
    const { travelMode } = this.state;
    const trip = {
      origin: origin,
      destination: destination,
      travelMode: travelMode,
      distance: distance,
      duration: duration,
    };
    return fetch('http://localhost:3001/api/trips', {
      method: 'post',
      body: JSON.stringify(trip),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(this.checkStatus);
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
          let distance = res.rows[0].elements[0].distance.text || null;
          let duration = res.rows[0].elements[0].duration.text || null;
          let originAddress = res.originAddresses.toString();
          let destinationAddress = res.destinationAddresses.toString();
          this.setState({
            distance: distance,
            duration: duration
          });
          this.createTrip(
            distance,
            duration,
            originAddress,
            destinationAddress
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
  };

  handleOriginChange = e => {
    this.setState({
      origin: e.target.value,
    });
  };

  handleDestinationChange = e => {
    this.setState({
      destination: e.target.value,
    });
  };

  handleTravelOptionChange = e => {
    e.preventDefault();
    this.setState({
      travelMode: e.target.value,
    });
  };

  render() {
    const { error } = this.state;
    const { data } = this.props
    if (error) {
      return (
        <div>
          <h1>Error Communicating with the server</h1>
        </div>
      );
    }

    const travelModeButtons = this.state.options.map((option, i) => (
      <button key={i} onClick={this.handleTravelOptionChange} value={option}>
        {option}
      </button>
    ));

    let trips = data.map((trip, i) => (
      <tr key={i}>
        <td>{trip.destination}</td>
        <td>{trip.origin}</td>
        <td>{trip.travelMode}</td>
        <td>{trip.distance}</td>
        <td>{trip.duration}</td>
      </tr>
    ));
    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>Destination</th>
              <th>Origin</th>
              <th>TravelMode</th>
              <th>Distance</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>{trips || 'loading'}</tbody>
        </table>
        <form onSubmit={this.handleSubmit}>
          <h1>Origin</h1>
          <label>Enter Origin Address</label>
          <input type="text" onChange={this.handleOriginChange} required/>

          <h1>Destination</h1>
          <label>Enter Destination Address</label>
          <input type="text" onChange={this.handleDestinationChange} required/>

          <h1>Travel Mode</h1>
          <label>Select Mode of Transportation</label>
          {travelModeButtons}
          <div>
            <input type="submit" value="submit" />
          </div>
        </form>
      </div>
    );
  }
}
export default GoogleApiWrapper({
  apiKey: APIKEY
})(MapContainer);
