
#include <SoftwareSerial.h>

/**
 * Acquire a GPS position and display it on Serial
 */

#include <SIM808.h>



#define SIM_RST   5 ///< SIM808 RESET
#define SIM_RX    6 ///< SIM808 RXD
#define SIM_TX    7 ///< SIM808 TXD
#define SIM_PWR   4 ///< SIM808 PWRKEY
#define SIM_STATUS  8 ///< SIM808 STATUS

#define SIM808_BAUDRATE 9600    ///< Control the baudrate use to communicate with the SIM808 module
#define SERIAL_BAUDRATE 9600   ///< Controls the serial baudrate between the arduino and the computer
#define NO_FIX_GPS_DELAY 3000   ///< Delay between each GPS read when no fix is acquired
#define FIX_GPS_DELAY  10000    ///< Delay between each GPS read when a fix is acquired

#define POSITION_SIZE   128     ///< Size of the position buffer
#define NL  "\r\n"

#if defined(__AVR__)
    typedef __FlashStringHelper* __StrPtr;
#else
    typedef const char* __StrPtr;
#endif


SoftwareSerial simSerial(SIM_RX, SIM_TX);
SIM808 sim808 = SIM808(SIM_RST, SIM_PWR);
char position[POSITION_SIZE];



void powerOnSIM() {
  digitalWrite(SIM_PWR, HIGH);
  delay(1000);
  digitalWrite(SIM_PWR, LOW);
}

void powerOffSIM() {
  digitalWrite(SIM_PWR, HIGH);
  delay(3000);
  digitalWrite(SIM_PWR, LOW);
}



void setup() {
    Serial.begin(SERIAL_BAUDRATE);

    pinMode(SIM_PWR, OUTPUT);

    simSerial.begin(SIM808_BAUDRATE);
    sim808.begin(simSerial);

    Serial.println("Power on SIM 808");
    powerOnSIM();
    
    Serial.println("Power on GPS");
    sim808.powerOnOffGps(true);


    if (sim808.enableGprs("econet.net", NULL, NULL))
      Serial.println("GPRS enabled");
    else
      Serial.println("GPRS failed");
    
}


void loop() {


    Serial.println("Loop");
    
    SIM808GpsStatus status = sim808.getGpsStatus(position, POSITION_SIZE);
    
    if(status < SIM808GpsStatus::Fix) {
        delay(NO_FIX_GPS_DELAY);
        return;
    }

    char *latRawChar, *longRawChar;
    __StrPtr state;

    sim808.getGpsField(position, SIM808GpsField::Latitude, &latRawChar);
    sim808.getGpsField(position, SIM808GpsField::Longitude, &longRawChar);

    String lat = String(latRawChar);
    String lng = String(longRawChar);
    
    int indexOfFirstComma;

    indexOfFirstComma = lat.indexOf(",");
    if (indexOfFirstComma != -1)
      lat = lat.substring(0, indexOfFirstComma);

    Serial.println("Lat: " + lat);

    indexOfFirstComma = lng.indexOf(",");
    if (indexOfFirstComma != -1)
      lng = lng.substring(0, indexOfFirstComma);

    Serial.println("Long: " + lng);

    

    char response[200]; 
    String body = "{\"lat\": " + lat + ", \"long\": " + lng + "}";
    int len = body.length() + 1;
    char bodyChar[len];
    body.toCharArray(bodyChar, len);

    Serial.print("Payload: "); Serial.println(bodyChar);
    Serial.print("Payload Str: "); Serial.println(body);

    uint16_t responseCode = sim808.httpPost("http://starcad.co.zw:8080/api/coordinates", S_F("application/json"), bodyChar, response, 200);
    
    Serial.println("Status: " + String(responseCode));
    Serial.print("Response: ");Serial.println(responseCode);

    
    delay(FIX_GPS_DELAY);
    
}
