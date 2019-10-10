import React, { useState } from 'react';

const TripsTable = props => {
  const [open, setOpen] = useState(false);
  if (open) {
    return (
      <div className='trips-table'>
        <div>
          <input
            type="button"
            className='toggle'
            value="Close Trips Table"
            onClick={() => setOpen(!open)}
          />
        </div>
        <table>
          <thead>
            <tr>
              <th>Destination</th>
              <th>Origin</th>
              <th>Travel Mode</th>
              <th>Distance</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>{props.trips || '...Trips loading'}</tbody>
        </table>
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
