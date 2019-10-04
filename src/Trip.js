import React from 'react';

const Trip = (props) => {
  return (
    <tr key={props.i}>
    <td>{props.destination}</td>
    <td>{props.origin}</td>
    <td>{props.travelMode}</td>
    <td>{props.distance}</td>
    <td>{props.duration}</td>
  </tr>
  )
}
export default Trip


