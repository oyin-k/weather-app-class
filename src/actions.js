import axios from "axios";

export function fetchData(url) {
  return function thunk(dispatch) {
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

        dispatch(setData(data));
        dispatch(setDates(dates));
        dispatch(setTemps(temps));
        dispatch(setSelectedDate(""));
        dispatch(setSelectedTemp(null));
      })
      .catch(error => {
        console.log(error);
      });
  };
}

export function changeLocation(location) {
  return {
    type: "CHANGE_LOCATION",
    location: location
  };
}

export function setData(data) {
  return {
    type: "SET_DATA",
    data: data
  };
}

export function setDates(dates) {
  return {
    type: "SET_DATES",
    dates: dates
  };
}

export function setTemps(temps) {
  return {
    type: "SET_TEMPS",
    temps: temps
  };
}

export function setSelectedDate(date) {
  return {
    type: "SET_SELECTED_DATE",
    date: date
  };
}

export function setSelectedTemp(temp) {
  return {
    type: "SET_SELECTED_TEMP",
    temp: temp
  };
}
