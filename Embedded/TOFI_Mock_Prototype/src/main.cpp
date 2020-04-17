#include <Arduino.h>
#include <SPI.h>
#include <BLEPeripheral.h>

// reference on setting up the nrf52 here: https://docs.platformio.org/en/latest/tutorials/nordicnrf52/arduino_debugging_unit_testing.html#tutorial-nordicnrf52-arduino-debugging-unit-testing
// reference on using BLEPeripheral here: https://www.hackster.io/gov/imu-to-you-ae53e1#code

/// ********************************** Hardware ******************************************************
const int minDifference = 5; //minimum change on adc before value is sent
u_int16_t adc0Last = 0;
u_int16_t adc1Last = 0;
u_int16_t adc2Last = 0;
u_int16_t adc3Last = 0;
// weighted moving avarage values
u_int16_t adc0 = 0;
u_int16_t adc1 = 0;
u_int16_t adc2 = 0;
u_int16_t adc3 = 0;
// ********************************** BLE ******************************************************
const char *localName = "TOFI_MOCK_TRAINER";
BLEPeripheral TOFIPeripheral = BLEPeripheral();

BLEService TOFIService = BLEService("ff9c1e42-7b32-11ea-bc55-0242ac130003");

//BLEService LEDService = BLEService("ff9c1e42-7b32-11ea-bc55-0242ac130003");
//BLECharCharacteristic LEDCharacteristic = BLECharCharacteristic("FFD1", BLERead | BLEWrite);
//BLEDescriptor LEDDescriptor = BLEDescriptor("2901", "LED");

BLECharacteristic sensorCharacteristic("ff9c1e42-7b32-11ea-bc55-0242ac130003", BLERead | BLENotify, 8);
BLEDescriptor sensorDescriptor("2901", "Sensors");

//BLECharacteristic btnCharacteristic("ff9c1e42-7b32-11ea-bc55-0242ac130003", BLERead | BLENotify, 1);
//BLEDescriptor btnDescriptor("2901", "btns");

//****************************************************************************************************

void setupBLE();

boolean connected = false;
double lastMillisLed;
double lastMillisPoll;
boolean oscilator = false;
/**
* The union directive allows 3 variables to share the same memory location.
*/
union {
  uint16_t a[4];
  unsigned char bytes[8];
} sensorData;

void setup()
{
  //
  pinMode(PIN_LED1, OUTPUT);
  digitalWrite(PIN_LED1, HIGH);
  pinMode(PIN_LED2, OUTPUT);
  digitalWrite(PIN_LED2, HIGH);
  setupBLE();
  analogReadResolution(14);
  pinMode(PIN_A0, INPUT);
  pinMode(PIN_A1, INPUT);
  pinMode(PIN_A2, INPUT);
  pinMode(PIN_A3, INPUT);
  pinMode(PIN_BUTTON1, INPUT);
}

void loop()
{
  BLECentral central = TOFIPeripheral.central();
  if (central)
  {
    while (central.connected())
    {

      double time = millis();
      // led blink while connected
      if (time - lastMillisLed > 600)
      {
        lastMillisLed = time;
        oscilator = !oscilator;
        digitalWrite(PIN_LED1, oscilator);
        digitalWrite(PIN_LED2, !oscilator);
      }

      if (time - lastMillisPoll > 5)
      {
        lastMillisPoll = time;
        adc0 = floor(adc0 * 0.6);
        adc1 = floor(adc1 * 0.6);
        adc2 = floor(adc2 * 0.6);
        adc3 = floor(adc3 * 0.6);

        //impedence is too high for analog pins, so double reading here as a workaround to avoid wrong measurements 
        analogRead(PIN_A0);
        adc0 = floor(analogRead(PIN_A0) * 0.4);
        analogRead(PIN_A1);
        adc1 = floor(analogRead(PIN_A1) * 0.4);
        analogRead(PIN_A2);
        adc2 = floor(analogRead(PIN_A2) * 0.4);
        analogRead(PIN_A3);
        adc3 = floor(analogRead(PIN_A3) * 0.4);
        //sensor data

        if (abs(adc0Last - adc0) > minDifference || abs(adc1Last - adc1) > minDifference || abs(adc2Last - adc2) > minDifference || abs(adc3Last - adc3) > minDifference)
        {
          adc0Last = adc0;
          adc1Last = adc1;
          adc2Last = adc2;
          adc3Last = adc3;
          sensorData.a[0] = adc0;
          sensorData.a[1] = adc1;
          sensorData.a[2] = adc2;
          sensorData.a[3] = adc3;
          unsigned char *sensors = (unsigned char *)&sensorData;
          sensorCharacteristic.setValue(sensors, 8);
        }
      }
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

  const unsigned char initializerSensor[8] = {0, 0, 0, 0, 0, 0, 0, 0};
  sensorCharacteristic.setValue(initializerSensor, 8);

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