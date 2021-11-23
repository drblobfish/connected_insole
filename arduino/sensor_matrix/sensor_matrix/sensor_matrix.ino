/*This code provides a way of reading a RX-ES42 plantar pressure sensor matrix
 * 
 * 
 */


int rowPin[] = {A0,A1,A2,A3};
int colPin[] = {2,3,4,5,6,7};
int sensorValues[] = {0,0,0,0};

void setup() {
  // put your setup code here, to run once:
  for (int i=0;i<4;i++){
    pinMode(rowPin[i], INPUT);
    }
  for (int i=0;i<6;i++){
    pinMode(colPin[i], OUTPUT);
    }

}

void loop() {
  // put your main code here, to run repeatedly:

}
