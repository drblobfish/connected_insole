// ble setup
#include <bluefruit.h>

uint8_t uvindexvalue[] = {0x0,0x0};
#define UUID16_SVC_ENVIRONMENTAL_SENSING 0x181A
#define UUID16_CHR_UV_INDEX 0x2A76

BLEService environmental_sensing_service = BLEService(UUID16_SVC_ENVIRONMENTAL_SENSING);
BLECharacteristic uv_index_characteristic = BLECharacteristic(UUID16_CHR_UV_INDEX);


// sensor matrix setup

//defining pin to change easily between microcontroller
const int a=A0;
const int b=A1;
const int c=A2;
const int d=A3;

const int d1=12;
const int d2=11;
const int d3=10;
const int d4=9;
const int d5=6;
const int d6=5;

//---------------------
const int nb_row = 4;
const int nb_col = 5;//6;

const int rowPin[] = {A0,A1,A2,A3};
const int colPin[] = {5,6,9,10,11,12};

const int nb_sensor = 16;
uint8_t sensorValues[nb_sensor];

const int sensors[16][2] = {
  {d3,c},
  {d3,b},
  {d4,c},
  {d4,b},
  {d2,d},
  {d2,c},
  {d2,b},
  {d5,d},
  {d1,d},
  {d1,c},
  {d1,b},
  {d1,a},
  {d6,d},
  {d6,c},
  {d6,b},
  {d6,a}};

void setup() {
  Serial.begin(115200);
  delay(500);
  Serial.println("Start!");

  
  // sensor matrix pin setup
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

  for (int i_sens=0;i_sens<nb_sensor;i_sens++){
    // setting the sensor pin HIGH
    digitalWrite(sensors[i_sens][0], HIGH);
    // and all other columns to LOW
    for (int j_col=0;j_col<nb_col;j_col++){
      if (colPin[j_col] != sensors[i_sens][0]){
        digitalWrite(colPin[j_col], LOW);
        }
      }
    sensorValues[i_sens] = analogRead(sensors[i_sens][1]);
    Serial.print(sensorValues[i_sens]);
    Serial.print(", ");
    }
  uv_index_characteristic.indicate(&sensorValues, sizeof(sensorValues));
  Serial.println();

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
  uv_index_characteristic.setFixedLen(16);//number of value to send
  uv_index_characteristic.begin();
  uv_index_characteristic.write(&uvindexvalue, sizeof(uvindexvalue));
}
