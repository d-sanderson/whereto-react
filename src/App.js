import React from 'react';
import MapContainer from './MapContainer'
import './App.css'
class App extends React.Component {
  render() {
  return (
    <div className="App">
      <MapContainer checkStatus={this.props.checkStatus}/>
    </div>
  );
  }
}

export default App;
