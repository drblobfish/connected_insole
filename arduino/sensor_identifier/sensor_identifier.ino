/*This code provides a way of reading a RX-ES42 plantar pressure sensor matrix
 * 
 * 
 */
const int nb_row = 4;
const int nb_col = 6;

const int rowPin[] = {A0,A1,A2,A3};
const int colPin[] = {2,3,4,5,6,7};
int sensorValues[nb_row*nb_col];

void setup() {
  // put your setup code here, to run once:
  for (int i=0;i<nb_row;i++){
    pinMode(rowPin[i], INPUT);
    }
  for (int i=0;i<nb_col;i++){
    pinMode(colPin[i], OUTPUT);
    }

  Serial.begin(9600);

}

void loop() {
  // for each row
  for (int i_col=0;i_col<nb_col;i_col++){
    
    // setting the i_col pin HIGH and all other columns to LOW
    digitalWrite(colPin[i_col], HIGH);
    for (int j_col=0;j_col<nb_col;j_col++){
      if (i_col != j_col){
        digitalWrite(colPin[j_col], LOW);
        }
      }

    //measuring all rows
    for (int i_row=0;i_row<nb_row;i_row++){
      Serial.print(colPin[i_col]);
      Serial.print(",");
      Serial.print(rowPin[i_row]);
      Serial.print(" : ");
      Serial.print(analogRead(rowPin[i_row]));
      Serial.print(" , ");
      }
    }
  Serial.println();
  delay(1000);
  

}
