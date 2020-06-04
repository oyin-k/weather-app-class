import React from "react";
import "./styles.css";

import axios from "axios";

import Plot from "./Plot";

const API_KEY = "29c4d04c20e9ad44e574736343206ca2";
class App extends React.Component {
  state = {
    location: "",
    data: {},
    dates: [],
    temps: [],
    slected: {
      date: "",
      temp: null
    }
  };

  onPlotClick = data => {
    if (data.points) {
      this.setState({
        selected: {
          date: data.points[0].x,
          temp: data.points[0].y
        }
      });
    }
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
        let data = res.data;
        let list = data.list;
        let dates = [];
        let temps = [];

        for (let i = 0; i < list.length; i++) {
          dates.push(list[i].dt_txt);
          temps.push(list[i].main.temp);
        }
        // console.log(dates, temps);
        this.setState({
          data: data,
          dates: dates,
          temps: temps,
          selected: {
            date: "",
            temp: null
          }
        });
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
    let currentTemp = "not loaded yet";
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
        {this.state.data.list ? (
          <div className="wrapper">
            {/* Render the current temperature if no specific date is selected */}
            <p className="temp-wrapper">
              <span className="temp">
                {this.state.selected.temp
                  ? this.state.selected.temp
                  : currentTemp}
              </span>
              <span className="temp-symbol">°C</span>
              <span className="temp-date">
                {this.state.selected.temp ? this.state.selected.date : ""}
              </span>
            </p>
            <h2>Forcast</h2>
            <Plot
              xData={this.state.dates}
              yData={this.state.temps}
              onPlotClick={this.onPlotClick}
              type="scatter"
            />
          </div>
        ) : null}
      </div>
    );
  }
}

export default App;
