import React from 'react';

const Trip = (props) => {
  return (
  <tr
  onClick={() => props.updateOrigin(props.origin, props.destination)}
  key={props.i}>
    <td>{props.origin}</td>
    <td>{props.destination}</td>
    <td>{props.travelMode}</td>
    <td>{props.distance}</td>
    <td>{props.duration}</td>
  </tr>
  )
}
export default Trip


