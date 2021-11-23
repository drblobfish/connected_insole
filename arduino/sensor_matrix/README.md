# SENSOR MATRIX


The pressure sensor insole we are using is a 4×6 sensor matrix with 16 pressure sensor (some row/column combination are not assigned).

<img src="/images/insole.jpg">

This code provide a way to measure all the resistance of all the 16 pressure sensor using only 4 analog input and 6 digital output

## Electronics

We use an arduino microcontoller (leonardo for now but eventually we will switch to a feather nrf52)

the wiring to the pressure sensor insole is as follows :

<img src="/images/schematics_matrix.png">
