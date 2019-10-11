import React, { useState } from 'react';

const TripsTable = props => {
  const [open, setOpen] = useState(false);
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
          <tbody>{props.trips || '...Trips loading'}</tbody>
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
