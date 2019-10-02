import React from 'react';

class Form extends React.Component {
  constructor(props) {
    super(props)
    this.state ={

    }
  }
render() {

  return (
    <form onSubmit={this.props.handleSubmit}>
    <h1>Origin</h1>
    <label>Enter Origin Address</label>
    <input type="text" onChange={this.props.handleOriginChange} required/>

    <h1>Destination</h1>
    <label>Enter Destination Address</label>
    <input type="text" onChange={this.props.handleDestinationChange} required/>

    <h1>Travel Mode</h1>
    <label>Select Mode of Transportation</label>
    {this.props.travelModeButtons}
    <div>
      <input type="submit" value="submit" />
    </div>
  </form>

  )
  }
}
export default Form
