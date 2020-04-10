#include <Arduino.h>
#include <SPI.h>
#include <BLEPeripheral.h>

// tutorial here: https://www.hackster.io/gov/imu-to-you-ae53e1#code

/// ********************************** Hardware ******************************************************

// ********************************** BLE ******************************************************
const char *localName = "TOFI_MOCK_TRAINER";
BLEPeripheral TOFIPeripheral = BLEPeripheral();

BLEService TOFIService = BLEService("ff9c1e42-7b32-11ea-bc55-0242ac130003");

//BLEService LEDService = BLEService("ff9c1e42-7b32-11ea-bc55-0242ac130003");
//BLECharCharacteristic LEDCharacteristic = BLECharCharacteristic("FFD1", BLERead | BLEWrite);
//BLEDescriptor LEDDescriptor = BLEDescriptor("2901", "LED");

BLECharacteristic sensorCharacteristic("ff9c1e42-7b32-11ea-bc55-0242ac130003", BLERead | BLENotify, 12);
BLEDescriptor sensorDescriptor("2901", "Sensor B");

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
  pinMode(PIN_LED1, OUTPUT);
  digitalWrite(PIN_LED1, HIGH);
  pinMode(PIN_LED2, OUTPUT);
  digitalWrite(PIN_LED2, HIGH);
  setupBLE();
  pinMode(PIN_A0, INPUT);
  pinMode(PIN_BUTTON1, INPUT);
  pinMode(PIN_BUTTON2, INPUT);
  pinMode(PIN_BUTTON3, INPUT);
  pinMode(PIN_BUTTON4, INPUT);
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
        int time = millis();
        if (time-lastMillis>600) {
        lastMillis = time;
        oscilator = !oscilator;
        digitalWrite(PIN_LED1, oscilator);
        digitalWrite(PIN_LED2, !oscilator);
        }
      }
      sensorData.a[0] = map(analogRead(PIN_A0), 0, 1023, 0, 65534);
      sensorData.a[1] = 65534;
      sensorData.a[2] = 20000;
      unsigned char *sensors = (unsigned char *)&sensorData;
      sensorCharacteristic.setValue(sensors, 6);
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

  //led service
  //TOFIPeripheral.addAttribute(LEDService);
  // TOFIPeripheral.addAttribute(LEDCharacteristic);
  //TOFIPeripheral.addAttribute(LEDDescriptor);
  // LEDCharacteristic.setEventHandler(BLEWritten, LEDWritten);

  TOFIPeripheral.setEventHandler(BLEConnected, blePeripheralConnectHandler);
  TOFIPeripheral.setEventHandler(BLEDisconnected, blePeripheralDisconnectHandler);

  const unsigned char initializerSensor[6] = {0, 0, 0, 0, 0, 0};

  sensorCharacteristic.setValue(initializerSensor, 12);

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
