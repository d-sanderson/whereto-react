import React from 'react';
import MapContainer from './MapContainer'

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      data: []
    };
  }
  componentDidMount() {
    this.loadTripsFromServer();
    setInterval(this.loadTripsFromServer, 2000);
  }
  shouldComponentUpdate(nextProps, nextState) {
    if(this.state.data === nextState.data) {
      return false;
    }
    else {
      return true;
    }
  }

  componentWillUnmount() {
    clearInterval(this.loadTripsFromServer);
  }

  loadTripsFromServer = () => {
    this.getTrips(data =>
      this.setState({
        data: data,
      })
    );
  };

  getTrips(success) {
    return fetch('http://localhost:3001/api/trips', {
      headers: {
        Accept: 'application/json',
      },
    })
      .then(this.checkStatus)
      .then(this.parseJSON)
      .then(success);
  }

   checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      const error = new Error(`HTTP Error ${response.statusText}`);
      error.status = response.statusText;
      error.response = response;
      console.log(error);
      throw error;
    }
  }

  parseJSON(response) {
    return response.json();
  }

  render() {
  return (
    <div className="App">
      <MapContainer data={this.state.data}/>
    </div>
  );
  }
}

export default App;
