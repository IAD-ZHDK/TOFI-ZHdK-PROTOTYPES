#include <Arduino.h>
#include <SPI.h>
#include <BLEPeripheral.h>
#include <Adafruit_ADS1015.h>

// reference on setting up the nrf52 here: https://docs.platformio.org/en/latest/tutorials/nordicnrf52/arduino_debugging_unit_testing.html#tutorial-nordicnrf52-arduino-debugging-unit-testing
// reference on using BLEPeripheral here: https://www.hackster.io/gov/imu-to-you-ae53e1#code

/// ********************************** Hardware ******************************************************
Adafruit_ADS1115 ads1115(0x49);
// ********************************** BLE ******************************************************
const char *localName = "TOFI_MOCK_TRAINER";
BLEPeripheral TOFIPeripheral = BLEPeripheral();

BLEService TOFIService = BLEService("ff9c1e42-7b32-11ea-bc55-0242ac130003");

//BLEService LEDService = BLEService("ff9c1e42-7b32-11ea-bc55-0242ac130003");
//BLECharCharacteristic LEDCharacteristic = BLECharCharacteristic("FFD1", BLERead | BLEWrite);
//BLEDescriptor LEDDescriptor = BLEDescriptor("2901", "LED");

BLECharacteristic sensorCharacteristic("ff9c1e42-7b32-11ea-bc55-0242ac130003", BLERead | BLENotify, 6);
BLEDescriptor sensorDescriptor("2901", "Sensors");

//BLECharacteristic btnCharacteristic("ff9c1e42-7b32-11ea-bc55-0242ac130003", BLERead | BLENotify, 1);
//BLEDescriptor btnDescriptor("2901", "btns");





//****************************************************************************************************

void setupBLE();

boolean connected = false;
int lastMillis;
boolean oscilator = false;
/**
* The union directive allows 3 variables to share the same memory location.
*/
union {
  uint16_t a[3];
  unsigned char bytes[6];
} sensorData;

void setup()
{
  // ADC
  ads1115.begin();  // Initialize ads1115
  //
  pinMode(PIN_LED1, OUTPUT);
  digitalWrite(PIN_LED1, HIGH);
  pinMode(PIN_LED2, OUTPUT);
  digitalWrite(PIN_LED2, HIGH);
  setupBLE();
  pinMode(PIN_A0, INPUT);
  //pinMode(PIN_BUTTON1, INPUT);
  //pinMode(PIN_BUTTON2, INPUT);
  //pinMode(PIN_BUTTON3, INPUT);
  //pinMode(PIN_BUTTON4, INPUT);
}

void loop()
{
  BLECentral central = TOFIPeripheral.central();
  if (central)
  {
    while (central.connected())
    {
      if (connected)
      {
        // led blink while connected
        int time = millis();
        if (time-lastMillis>600) {
        lastMillis = time;
        oscilator = !oscilator;
        digitalWrite(PIN_LED1, oscilator);
        digitalWrite(PIN_LED2, !oscilator);
        }
      }
      int adc0 = ads1115.readADC_SingleEnded(0);
      int adc1 = ads1115.readADC_SingleEnded(1);
      int adc2 = ads1115.readADC_SingleEnded(2);
      //sensor data
      sensorData.a[0] = adc0;
      sensorData.a[1] = adc1;
      sensorData.a[2] = adc2;
      unsigned char *sensors = (unsigned char *)&sensorData;
      sensorCharacteristic.setValue(sensors, 6);
      //btn data
      /*
      boolean btn1 = !digitalRead(PIN_BUTTON1); 
      boolean btn2 = !digitalRead(PIN_BUTTON2); 
      boolean btn3 = !digitalRead(PIN_BUTTON3); 
      boolean btn4 = !digitalRead(PIN_BUTTON4);  
      uint8_t Buffer= 00000000 ^ btn1;
      Buffer = Buffer << 1;
      Buffer= Buffer ^ btn2;
      Buffer = Buffer << 1;
      Buffer= Buffer ^ btn3;
      Buffer = Buffer << 1;
      Buffer= Buffer ^ btn4;
      unsigned char *btns = (unsigned char *)&Buffer;
      btnCharacteristic.setValue(btns, 1);
      */
    }
  }
}

void blePeripheralConnectHandler(BLECentral &central)
{
  connected = true;
}

void blePeripheralDisconnectHandler(BLECentral &central)
{

  connected = false;
}

void bleConected()
{
}

void setupBLE()
{
  // Advertise name
  TOFIPeripheral.setLocalName(localName);
  TOFIPeripheral.setDeviceName(localName);
  TOFIPeripheral.setAdvertisedServiceUuid(TOFIService.uuid());
  TOFIPeripheral.addAttribute(TOFIService);
  TOFIPeripheral.addAttribute(sensorCharacteristic);
  TOFIPeripheral.addAttribute(sensorDescriptor);

  // TOFIPeripheral.addAttribute(btnCharacteristic);
  // TOFIPeripheral.addAttribute(btnDescriptor);

  // led service
  // TOFIPeripheral.addAttribute(LEDService);
  // TOFIPeripheral.addAttribute(LEDCharacteristic);
  // TOFIPeripheral.addAttribute(LEDDescriptor);
  // LEDCharacteristic.setEventHandler(BLEWritten, LEDWritten);

  TOFIPeripheral.setEventHandler(BLEConnected, blePeripheralConnectHandler);
  TOFIPeripheral.setEventHandler(BLEDisconnected, blePeripheralDisconnectHandler);

  const unsigned char initializerSensor[6] = {0, 0, 0, 0, 0, 0};
  sensorCharacteristic.setValue(initializerSensor, 6);
  
  //const unsigned char initializerbtn[1] = {0};
  //btnCharacteristic.setValue(initializerbtn, 1);

  TOFIPeripheral.begin();
}

/* void LEDWritten(BLECentral& central, BLECharacteristic& characteristic)
{
        if (LEDCharacteristic.value()) {
          digitalWrite(PIN_LED2, LOW);
        } else {
          digitalWrite(PIN_LED2, HIGH);
        }
}
*/
