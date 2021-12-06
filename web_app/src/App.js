import logo from "./assets/logo.svg";
import "./App.css";
import { useState } from "react";

import bleManager from "./utils/bleManager";

import Insole from "./components/insole_graph";

import { random_values,gradient } from "./utils/insole_graph_utils";

function App() {

  const [SensorValues, setSensorValues] = useState(gradient());//[0,0.5,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
  var ble = new bleManager({OnChangedValues:(value)=>setSensorValues(value)});


  return (
    <div className="App">
      <header className="App-header">
        <p>REACT WEB BLE</p>
        <img src={logo} className="App-logo" alt="logo" />
      </header>

      <p>Test 3</p>

      <button
        id="read"
        onClick={() => {
          if (ble.isWebBluetoothEnabled()) {
            ble.read();
          }
        }}
      >
        Connect with BLE device
      </button>
      <button
        id="start"
        onClick={() => {
          if (ble.isWebBluetoothEnabled()) {
            ble.start();
          }
        }}
      >
        Start
      </button>
      <button
        id="stop"
        onClick={() => {
          if (ble.isWebBluetoothEnabled()) {
            ble.stop();
          }
        }}
      >
        Stop
      </button>
      <div className="insole-container">
        <Insole values={SensorValues}></Insole>
      </div>
      <button
        id="stop"
        onClick={() => {setSensorValues(random_values())}}
      >
        Random_Values
      </button>
    </div>
  );
}

export default App;