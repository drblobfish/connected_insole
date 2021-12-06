/*
This code is a quick refactoring of the code made by
Sayanee Basu for the website hutscape.github.io and
available under the MIT licence

I just wrapped it in a class for a more object oriented
use and added support for transfer of full data arays

Original code can be found here
https://github.com/hutscape/hutscape.github.io/blob/master/_tutorials/web-ble-gatt/web-ble-gatt.html


Copyright (c) 2021 Sayanee Basu.
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/


export default class bleManager {
  constructor({
    bleService = "environmental_sensing",
    deviceName = "Palm",
    bleCharacteristic = "uv_index",
    array_length = 16,
    OnChangedValues = (values) => console.log(values),
  }) {
    this.bleService = bleService;
    this.deviceName = deviceName;
    this.bleCharacteristic = bleCharacteristic;
    this.bluetoothDeviceDetected = undefined;
    this.gattCharacteristic = undefined;
    this.array_length = array_length;
    this.OnChangedValues = OnChangedValues;
  }

  setOnChangedValues(OnChangedValues) {
    this.OnChangedValues = OnChangedValues;
  }

  isWebBluetoothEnabled() {
    if (!navigator.bluetooth) {
      console.log("Web Bluetooth API is not available in this browser!");
      alert("Web Bluetooth API is not available in this browser!");
      return false;
    }

    return true;
  }

  getDeviceInfo() {
    let options = {
      optionalServices: [this.bleService],
      filters: [{ name: this.deviceName }],
    };

    console.log("Requesting any Bluetooth Device...");
    return navigator.bluetooth
      .requestDevice(options)
      .then((device) => {
        this.bluetoothDeviceDetected = device;
        console.log("device found");
      })
      .catch((error) => {
        console.log("Argh! " + error);
      });
  }

  read() {
    return (
      this.bluetoothDeviceDetected ? Promise.resolve() : this.getDeviceInfo()
    )
      .then(() => this.connectGATT())
      .then((_) => {
        console.log("Reading UV Index...");
        return this.gattCharacteristic.readValue();
      })
      .catch((error) => {
        console.log("Waiting to start reading: " + error);
        console.log(error);
      });
  }

  connectGATT() {
    console.log("connecting gatt");
    if (
      this.bluetoothDeviceDetected.gatt.connected &&
      this.gattCharacteristic
    ) {
      return Promise.resolve();
    }

    return this.bluetoothDeviceDetected.gatt
      .connect()
      .then((server) => {
        console.log("Getting GATT Service...");
        return server.getPrimaryService(this.bleService);
      })
      .then((service) => {
        console.log("Getting GATT Characteristic...");
        return service.getCharacteristic(this.bleCharacteristic);
      })
      .then((characteristic) => {
        this.gattCharacteristic = characteristic;
        this.gattCharacteristic.addEventListener(
          "characteristicvaluechanged",
          this.handleChangedValue.bind(this)
        );
      });
  }

  handleChangedValue(event) {
    let value = [];
    for (let i = 0; i < this.array_length; i++) {
      value.push(event.target.value.getUint8(i));
    }
    console.log(value);
    if (this.OnChangedValues) {
      this.OnChangedValues(value);
    }
  }

  start() {
    if (this.gattCharacteristic) {
      this.gattCharacteristic
        .startNotifications()
        .then((_) => {
          console.log("Start reading...");
          document.querySelector("#start").disabled = true;
          document.querySelector("#stop").disabled = false;
        })
        .catch((error) => {
          console.log("[ERROR] Start: " + error);
        });
    } else {
      alert("No device connected");
    }
  }

  stop() {
    if (this.gattCharacteristic) {
      this.gattCharacteristic
        .stopNotifications()
        .then((_) => {
          console.log("Stop reading...");
          document.querySelector("#start").disabled = false;
          document.querySelector("#stop").disabled = true;
        })
        .catch((error) => {
          console.log("[ERROR] Stop: " + error);
        });
    } else {
      alert("No device connected");
    }
  }
}
