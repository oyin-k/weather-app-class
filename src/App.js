import React from "react";
import "./styles.css";
// import xhr from "xhr";
import axios from "axios";

const API_KEY = "174d161dfbb8a393b67f068baa6fb28b";
class App extends React.Component {
  state = {
    location: "",
    data: {}
  };

  fetchData = e => {
    e.preventDefault();

    if (!API_KEY) {
      console.log("Enter your API_KEY and the enter location");
      return;
    }

    let location = encodeURIComponent(this.state.location);
    let urlPrefix =
      "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/forecast?q=";
    let urlSuffix = "&APPID=" + API_KEY + "&units=metric";

    let url = urlPrefix + location + urlSuffix;

    axios({
      method: "POST",
      url: url,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
        // "Access-Control-Allow-Origin": "*"
      }
    })
      .then(res => {
        const data = res.data;
        this.setState({ data: data });
        console.log(data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  changeLocation = e => {
    this.setState({
      location: e.target.value
    });
  };

  render() {
    let currentTemp = "Specify a location";
    if (this.state.data.list) {
      currentTemp = this.state.data.list[0].main.temp;
    }
    return (
      <div>
        <h1>Weather</h1>
        <form onSubmit={this.fetchData}>
          <label>
            I want to know the weather for
            <input
              placeholder={"City, Country"}
              type="text"
              value={this.state.location}
              onChange={this.changeLocation}
            />
          </label>
        </form>
        <p className="temp-wrapper">
          <span className="temp">{currentTemp}</span>
          <span className="temp-symbol">°C</span>
        </p>
      </div>
    );
  }
}

export default App;
