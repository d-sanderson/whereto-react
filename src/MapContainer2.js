import React, { Component } from "react";
import { GoogleApiWrapper } from "google-maps-react";

import TripsTable from "./TripsTable";
import RouteDisplay from "./RouteDisplay";
const APIKEY = `${process.env.REACT_APP_API_KEY}`;

const MapContainer2 = (props) => {
    let [derp, setDerp] = React.useState({
      origin: "",
      destination: "",
      travelMode: "DRIVING",
      distance: null,
      distanceNum: 0,
      duration: null,
      options: ["DRIVING", "WALKING", "TRANSIT", "BICYCLING"],
      error: false,
      submitted: false,
    });
    const createTrip = (origin, destination, distance, duration) => {
      const { travelMode } = derp;
      const trip = {
        origin: origin,
        destination: destination,
        travelMode: travelMode,
        distance: distance,
        duration: duration,
      };
      postTrip(trip);
    };
  
    const postTrip = (trip) => {
      return fetch("http://localhost:3001/api/trips", {
        method: "post",
        body: JSON.stringify(trip),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }).then(props.checkStatus);
    };
    const calculateDistance = () => {
      const { google } = props;
      const { origin, destination, travelMode } = derp;
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
            setDerp((prevState) => {
              return {
                ...prevState,
                distance: distance,
                distanceNum: distanceNum,
                duration: duration,
              };
            });
            createTrip(originAddress, destinationAddress, distance, duration);
          } else {
            setDerp({
              error: true,
            });
          }
        }
      );
    };
  
    const updateOrigin = (origin, destination) => {
      setDerp({
        submitted: !derp.submitted,
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
      setDerp({
        submitted: !derp.submitted,
      });
    };
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setDerp((prevState) => {
        return { ...derp, [name]: value };
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
      options,
      origin,
      destination,
      distanceNum,
      duration,
      travelMode,
      submitted,
    } = derp;
    if (error) {
      return (
        <div>
          <h1>Error Communicating with the server</h1>
        </div>
      );
    }
  
    // const travelModeButtons = options.map((option, i) => (
    //   <input
    //     className="travel-mode"
    //     type="button"
    //     key={i}
    //     onClick={handleChange}
    //     value={option}
    //     name="travelMode"
    //   />
    // ));
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
  
        <form className="form" onSubmit={handleSubmit}>
          <h2>Origin</h2>
          <label>Enter an Origin Address:</label>
          <input
            type="text"
            name="origin"
            value={origin}
            onChange={handleChange}
            required
          />
  
          <h2>Destination</h2>
          <label>Enter a Destination Address:</label>
          <input
            type="text"
            name="destination"
            value={destination}
            onChange={handleChange}
            required
          />
  
          <h2>Travel Mode</h2>
          <div>
            <label>Select Mode of Transportation:</label>
          </div>
          {/* {travelModeButtons} */}
          <div>
            <input type="submit" value=" 💾 Submit" />
          </div>
        </form>
      </div>
    );
  };