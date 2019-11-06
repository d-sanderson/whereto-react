import React, { useState } from 'react';
import Trip from './Trip';

const TripsTable = ({data, handleTravelMode, updateOrigin}) => {
  const [open, setOpen] = useState(false);

  const trips = data.map((trip, i) => (
    <Trip
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
            className='toggle'
            value="Close Trips Table"
            onClick={() => setOpen(!open)}
          />
        </div>
        <div className='trips-table'>
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
          <tbody>{trips || '...Trips loading'}</tbody>
        </table>
        </div>
      </div>
    );
  } else {
    return (
      <div className='toggle-container'>
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
