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

  isWebBluetoothEnabled() {
    if (!navigator.bluetooth) {
      console.log("Web Bluetooth API is not available in this browser!");
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
    //this.OnChangedValues(value);
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
    }
    else {
      alert('No device connected')
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
    }
    else {
      alert('No device connected')
    }
  }
}
