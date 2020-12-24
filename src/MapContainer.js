import React, { Component } from "react";
import { GoogleApiWrapper } from "google-maps-react";
import Form from "./Form";
import TripsTable from "./TripsTable";
import RouteDisplay from "./RouteDisplay";
const APIKEY = `${process.env.REACT_APP_API_KEY}`;

const MapContainer = (props) => {

  const [dataz, setDataz] = React.useState({
      origin: "",
      destination: "",
      travelMode: "DRIVING",
      distance: null,
      distanceNum: 0,
      duration: null,
      error: false,
      submitted: false,
    });

  const createTrip = (origin, destination, distance, duration) => {
    const { travelMode } = dataz
    postTrip({
      origin: origin,
      destination: destination,
      travelMode: travelMode,
      distance: distance,
      duration: duration,
    });
  }

  function postTrip(trip) {
    return fetch("http://localhost:3001/api/trips", {
      method: "post",
      body: JSON.stringify(trip),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then(props.checkStatus);
  }

  const calculateDistance = () => {
    const { google } = props;
    const { origin, destination, travelMode } = dataz;
    const service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [destination],
        travelMode: travelMode,
      },
      (res, status) => {
        let statCheck = res.rows[0].elements[0].status;
        if (statCheck === "ZERO_RESULTS") return;
        if (status === "OK") {
          console.log(statCheck);
          let distance = res.rows[0].elements[0].distance.text;
          let distanceNum = res.rows[0].elements[0].distance.value / 1000;
          let duration = res.rows[0].elements[0].duration.text;
          let originAddress = res.originAddresses.toString();
          let destinationAddress = res.destinationAddresses.toString();
          setDataz({
            ...dataz,
            distance: distance,
            distanceNum: distanceNum,
            duration: duration,
          });
          createTrip(
            originAddress,
            destinationAddress,
            distance,
            duration
          );
        } else {
          setDataz({
            ...dataz,
            error: true,
          });
        }
      }
    );
  };

  const updateOrigin = (origin, destination) => {
    setDataz({
      ...dataz,
      submitted: !dataz.submitted,
      origin: origin,
      destination: destination,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateDistance();
    toggleSubmit();
  };

  const toggleSubmit = () => {
    setDataz({
      ...dataz,
      submitted: !dataz.submitted,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataz({
      ...dataz,
      [name]: value,
    });
  };

  const handleTravelMode = (travelMode) => {
    return travelMode === "DRIVING"
      ? "🚗"
      : travelMode === "WALKING"
      ? "🚶🏻‍♂️"
      : travelMode === "TRANSIT"
      ? "🚎"
      : "🚲";
  };


    const {
      error,
      origin,
      destination,
      distanceNum,
      duration,
      travelMode,
      submitted,
    } = dataz;
    if (error) {
      return (
        <div>
          <h1>Error Communicating with the server</h1>
        </div>
      );
    }
    return (
      <div className="container">
        <RouteDisplay
          google={props.google}
          destination={destination}
          origin={origin}
          submitted={submitted}
          travelMode={travelMode}
          distance={distanceNum}
          duration={duration}
          zoom={14}
          handleTravelMode={handleTravelMode}
        ></RouteDisplay>
        <TripsTable
          handleTravelMode={handleTravelMode}
          updateOrigin={updateOrigin}
        />
        <Form
          destination={destination}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
        />
      </div>
    );
  }


export default GoogleApiWrapper({
  apiKey: APIKEY,
})(MapContainer);
