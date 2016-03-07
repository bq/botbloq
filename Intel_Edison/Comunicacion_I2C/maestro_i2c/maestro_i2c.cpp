#include <mraa.hpp>
#include <stdio.h>
#include <stdlib.h>
#include <iostream>
#include <signal.h>

#define I2C_ADDRESS 0x56
#define BUS 1

using namespace std;

mraa::I2c* i2c;
mraa::Result response;

int main(int argc, char **argv)
{

  uint8_t data = 0;

  i2c = new mraa::I2c(BUS);
  i2c->address(I2C_ADDRESS);
  response = i2c->writeByte(0);

  if (response == 5)
  {
    cout << "\n" << endl;
    while (response == 5)
    {
      cout << "Error: no ha sido posible comunicarse con el esclavo" << endl;
      cout << "Reintentando establecer comunicacion con el esclavo" << endl;
      response = i2c->writeByte(0);
      sleep(1);
    }
  }

  cout << "\nComunicacion Establecida\n" << endl;

  while(response != 5)
  { 
    data = i2c->readByte();
    response = i2c->writeByte(data);
    usleep(250);
  }

  cout << "Error: comunicacion con el esclavo perdida\n" << endl;

  return 0;
}
