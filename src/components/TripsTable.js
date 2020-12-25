import React, { useState } from "react";
import TripRow from "./TripRow";

const TripsTable = ({ handleTravelMode, updateOrigin }) => {
  const [data, setData] = React.useState([]);
  const [open, setOpen] = useState(false);
  React.useEffect(() => {
    fetchData();
    async function fetchData(){
      let trips = await getTrips();
      setData(trips)
    }
  }, []);
  const getTrips = async () => {
    try {
      const data = await fetch("http://localhost:3001/api/trips", {
        headers: {
          Accept: "application/json",
        },
      });
      const response = await data.json();
      return response;
    } catch (err) {
      throw err;
    }

  };
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
