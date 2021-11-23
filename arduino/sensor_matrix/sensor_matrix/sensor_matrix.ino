/*This code provides a way of reading a RX-ES42 plantar pressure sensor matrix
 * 
 * 
 */
int nb_row = 4;
int nb_col = 6;

int rowPin[] = {A0,A1,A2,A3};
int colPin[] = {2,3,4,5,6,7};
int sensorValues[] = {0,0,0,0};

void setup() {
  // put your setup code here, to run once:
  for (int i=0;i<nb_row;i++){
    pinMode(rowPin[i], INPUT);
    }
  for (int i=0;i<nb_col;i++){
    pinMode(colPin[i], OUTPUT);
    }

}

void loop() {
  // put your main code here, to run repeatedly:
  for (int i_col=0;i_col<nb_col;i_col++){
    digitalWrite(colPin[i_col], HIGH);
    for (int j_col=0;j_col<nb_col;j_col++){
      if (i_col != j_col){
        digitalWrite(colPin[j_col], LOW);
        }
      }
    delay(100);
    }

}
