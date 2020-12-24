import React, { useState } from "react";
import TripRow from "./TripRow";

const TripsTable = ({ handleTravelMode, updateOrigin }) => {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    loadTripsFromServer();
  },[]);
  const loadTripsFromServer = () => {
    getTrips((data) => setData(data.reverse()));
  };

  const getTrips = async(success) => {
    


    return fetch("http://localhost:3001/api/trips", {
      headers: {
        Accept: "application/json",
      },
    })
      .then(checkStatus)
      .then(parseJSON)
      .then(success);
  };

  const checkStatus = (response) => {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      const error = new Error(`HTTP Error ${response.statusText}`);
      error.status = response.statusText;
      error.response = response;
      console.log(error);
      throw error;
    }
  };
  const parseJSON = (response) => {
    return response.json();
  };
  const [open, setOpen] = useState(false);
  const trips = data.map((trip, i) => (
    <TripRow
      key={i}
      destination={trip.destination}
      origin={trip.origin}
      travelMode={handleTravelMode(trip.travelMode)}
      distance={trip.distance}
      duration={trip.duration}
      updateOrigin={updateOrigin}
    />
  ));

  if (open) {
    return (
      <div>
        <div>
          <input
            type="button"
            className="toggle"
            value="Close Trips Table"
            onClick={() => setOpen(!open)}
          />
        </div>
        <div className="trips-table">
          <table>
            <thead>
              <tr>
                <th>Origin</th>
                <th>Destination</th>
                <th>Travel Mode</th>
                <th>Distance</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>{trips || "...Trips loading"}</tbody>
          </table>
        </div>
      </div>
    );
  } else {
    return (
      <div className="toggle-container">
        <input
          type="button"
          className="toggle"
          value="🚎 View Trips"
          onClick={() => setOpen(!open)}
        />
      </div>
    );
  }
};
export default TripsTable;
