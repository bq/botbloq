#include <Wire.h>

#define dir_i2c 0x56
#define pin 7
#define potenciometro A0
#define vel_serie 9600

int espera;
bool conectado = false;

void setup() {
  Wire.begin(dir_i2c);               
  Wire.onReceive(byteRecibido);
  Wire.onRequest(bytePedido);
  Serial.begin(vel_serie);
  pinMode(pin, OUTPUT);
}

void loop() {
  Parpadeo(espera);
}

void byteRecibido(int bytes) {
  int x = Wire.read();
  espera = 2 * x;  
}

void bytePedido() {
  int x = analogRead(potenciometro) / 4;
  Serial.println(x);
  Wire.write(x);
}

void Parpadeo(int esperar) {
  digitalWrite(pin, HIGH);
  delay(esperar);              
  digitalWrite(pin, LOW);    
  delay(esperar);
}

