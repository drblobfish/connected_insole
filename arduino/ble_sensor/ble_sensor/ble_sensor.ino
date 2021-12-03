// ble setup
#include <bluefruit.h>

uint8_t uvindexvalue[] = {0x0,0x0};
#define UUID16_SVC_ENVIRONMENTAL_SENSING 0x181A
#define UUID16_CHR_UV_INDEX 0x2A76

BLEService environmental_sensing_service = BLEService(UUID16_SVC_ENVIRONMENTAL_SENSING);
BLECharacteristic uv_index_characteristic = BLECharacteristic(UUID16_CHR_UV_INDEX);


// sensor matrix setup
const int nb_row = 4;
const int nb_col = 5;//6;

const int rowPin[] = {A0,A1,A2,A3};
const int colPin[] = {5,6,9,10,11,12};
int sensorValues[nb_row*nb_col];

void setup() {
  Serial.begin(115200);
  delay(500);
  Serial.println("Start!");

  
  // sensor matrix pin setup
  for (int i=0;i<nb_row;i++){
    pinMode(rowPin[i], INPUT);
    }
  for (int i=0;i<nb_col;i++){
    pinMode(colPin[i], OUTPUT);
    }

  //ble setup
  Bluefruit.begin();
  Bluefruit.setName("Palm");

  setupESService();
  startAdv();
}

void loop() {

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
      sensorValues[i_col*nb_row+i_row] = analogRead(rowPin[i_row]);
      }
    }

  Serial.print("UV Index: ");
  Serial.print(uvindexvalue[0]);

  if (uv_index_characteristic.indicate(&sensorValues, sizeof(sensorValues))) {
    Serial.print("Updated UV Index: ");
  Serial.print(uvindexvalue[0]);
  Serial.println(uvindexvalue[1]);
  } else {
    Serial.println("UV Index Indicate not set");
  }

  delay(100);
}

void startAdv(void) {
  Bluefruit.Advertising.addService(environmental_sensing_service);

  Bluefruit.Advertising.addFlags(BLE_GAP_ADV_FLAGS_LE_ONLY_GENERAL_DISC_MODE);
  Bluefruit.Advertising.addTxPower();
  Bluefruit.Advertising.addName();
  Bluefruit.Advertising.restartOnDisconnect(true);
  Bluefruit.Advertising.setInterval(32, 244);
  Bluefruit.Advertising.setFastTimeout(30);
  Bluefruit.Advertising.start(0);
}

void setupESService(void) {
  environmental_sensing_service.begin();
  uv_index_characteristic.setProperties(CHR_PROPS_INDICATE);
  uv_index_characteristic.setPermission(SECMODE_OPEN, SECMODE_NO_ACCESS);
  uv_index_characteristic.setFixedLen(20);//number of value to send
  uv_index_characteristic.begin();
  uv_index_characteristic.write(&uvindexvalue, sizeof(uvindexvalue));
}
