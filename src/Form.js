import React from "react";

const Form = ({ origin, handleSubmit, handleChange, destination }) => {
  const travelModeButtons = [
    "DRIVING",
    "WALKING",
    "TRANSIT",
    "BICYCLING",
  ].map((option, i) => (
    <input
      className="travel-mode"
      type="button"
      key={i}
      onClick={handleChange}
      value={option}
      name="travelMode"
    />
  ));

  return (
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
      {travelModeButtons}
      <div>
        <input type="submit" value=" 💾 Submit" />
      </div>
    </form>
  );
};

export default Form;
