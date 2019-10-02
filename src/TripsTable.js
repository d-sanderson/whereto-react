import React from 'react';

const TripsTable = (props) => {
  return (
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

  )
}
export default TripsTable


