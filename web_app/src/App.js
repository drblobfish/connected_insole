import "./App.css";
import { useState } from "react";

//small module to handle web bluetooth
import bleManager from "./utils/bleManager";

// insole visualization component
import Insole from "./components/insole_graph";

// utils to test the insole visualization
import { random_values, gradient } from "./utils/insole_graph_utils";

var ble = new bleManager({});
/* create a bleManager object to handle web bluetooth
pass the following parameters :
 - bleService : name of the service
 - deviceName : name of the device
 - bleCharacteristic : name of the characteristic
 - array_length : length of the array of data transmitted
*/

function App() {
  // create a react hook to rerender the elements when
  const [SensorValues, setSensorValues] = useState([
    0, 0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);

  // set the function that ble manager has to call each time a new
  // value is transmitted throug bluetooth
  ble.setOnChangedValues((value) =>
    setSensorValues(value.map((val) => val / 100))
  );

  return (
    <div className="App">
      <header className="App-header">
        <p>REACT WEB BLE</p>
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
        onClick={() => {
          setSensorValues(random_values());
        }}
      >
        Random_Values
      </button>
    </div>
  );
}

export default App;
