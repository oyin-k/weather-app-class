import React from "react";
import { connect } from "react-redux";

import "./styles.css";

import Plot from "./Plot";

import {
  changeLocation,
  setSelectedDate,
  setSelectedTemp,
  fetchData
} from "./actions";

const API_KEY = "29c4d04c20e9ad44e574736343206ca2";
export class App extends React.Component {
  fetchData = e => {
    e.preventDefault();

    if (!API_KEY) {
      console.log("Enter your API_KEY and the enter location");
      return;
    }

    let location = encodeURIComponent(this.props.redux.get("location"));
    let urlPrefix =
      "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/forecast?q=";
    let urlSuffix = "&APPID=" + API_KEY + "&units=metric";

    let url = urlPrefix + location + urlSuffix;

    this.props.dispatch(fetchData(url));
  };

  onPlotClick = data => {
    if (data.points) {
      let number = data.points[0].pointNumber;
      this.props.dispatch(
        setSelectedDate(this.props.redux.getIn(["dates", number]))
      );
      this.props.dispatch(
        setSelectedTemp(this.props.redux.getIn(["temps", number]))
      );
    }
  };

  changeLocation = e => {
    this.props.dispatch(changeLocation(e.target.value));
  };

  render() {
    let currentTemp = "not loaded yet";
    if (this.props.redux.getIn(["data", "list"])) {
      // currentTemp = this.props.data.list[0].main.temp;
      currentTemp = this.props.redux.getIn([
        "data",
        "list",
        "0",
        "main",
        "temp"
      ]);
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
              value={this.props.redux.get("location")}
              onChange={this.changeLocation}
            />
          </label>
        </form>
        {this.props.redux.getIn(["data", "list"]) ? (
          <div>
            {/* Render the current temperature if no specific date is selected */}
            {this.props.redux.getIn(["selected", "temp"]) ? (
              <p>
                The temperature on{" "}
                {this.props.redux.getIn(["selected", "date"])} will be{" "}
                {this.props.redux.getIn(["selected", "temp"])}°C
              </p>
            ) : (
              <p>The current temperature is {currentTemp}°C!</p>
            )}
            <h2>Forecast</h2>
            <Plot
              xData={this.props.redux.get("dates")}
              yData={this.props.redux.get("temps")}
              onPlotClick={this.onPlotClick}
              type="scatter"
            />
          </div>
        ) : null}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    redux: state
  };
}

export default connect(mapStateToProps)(App);
