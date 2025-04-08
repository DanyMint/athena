#!/bin/bash

cd ./frontend
chmod +x ./install.sh;
sudo ./install.sh;


cd ..
sudo docker compose up --build -d
