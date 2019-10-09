import React, { useState } from 'react';

const TripsTable = props => {
  const [open, setOpen] = useState(false);
  if (open) {
    return (
      <div>
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
        <div>
          <input type="button" value="-" onClick={() => setOpen(!open)} />
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <input type="button" value="+" onClick={() => setOpen(!open)} />
      </div>
    );
  }
};
export default TripsTable;
