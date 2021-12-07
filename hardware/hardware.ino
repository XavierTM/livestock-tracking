
#include <SoftwareSerial.h>

/**
 * Acquire a GPS position and display it on Serial
 */

#include <SIM808.h>



#define SIM_RST   5 ///< SIM808 RESET
#define SIM_RX    6 ///< SIM808 RXD
#define SIM_TX    7 ///< SIM808 TXD
#define SIM_PWR   9 ///< SIM808 PWRKEY
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
SIM808 sim808 = SIM808(SIM_RST);
char position[POSITION_SIZE];

void setup() {
    Serial.begin(SERIAL_BAUDRATE);

    simSerial.begin(SIM808_BAUDRATE);
    sim808.begin(simSerial);


    sim808.powerOnOffGps(true);


    if (sim808.enableGprs("econet.net", NULL, NULL))
      Serial.println("GPRS enabled");
    else
      Serial.println("GPRS failed");
    
}


void loop() {
    
    SIM808GpsStatus status = sim808.getGpsStatus(position, POSITION_SIZE);
    
    if(status < SIM808GpsStatus::Fix) {
        delay(NO_FIX_GPS_DELAY);
        return;
    }

    float lat, lon;
    __StrPtr state;

    sim808.getGpsField(position, SIM808GpsField::Latitude, &lat);
    sim808.getGpsField(position, SIM808GpsField::Longitude, &lon);;


    delay(FIX_GPS_DELAY);
    char response[200]; 
//    String body = "{\"lat\": " + String(lat) + ", \"long\": " + String(lon) + "}";
//    int len = body.length();
//    char bodyChar[len - 1];
//
//    for (int i = 0; i < len; i++) {
//      bodyChar[i] = body.charAt(i);
//    }
//
//    Serial.print("Payload: "); Serial.println(bodyChar);
//    Serial.print("Payload Str: "); Serial.println(body);

    char bodyChar = "{\"lat\": 0, \"long\": 0 }";

    uint16_t responseCode = sim808.httpPost("http://starcad.co.zw:8080/api/coordinates", F("application/json"), bodyChar, response, 200);
    
    Serial.println("Status: " + String(responseCode));
    Serial.print("Response: ");Serial.println(responseCode);
    
}
