# Web app to interact with the connected insole via bluetooth

This web app uses the [web Bluetooth API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API) to talk to a nrf 52 microcontroller.

The bluetooth part is based on [this code](https://github.com/hutscape/hutscape.github.io/blob/master/_tutorials/web-ble-gatt/web-ble-gatt.html) that I just refactored into a `BleManager` class.


It uses Reactjs as framework