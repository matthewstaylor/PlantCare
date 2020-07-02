#Import Files
import spidev #use to transmit data with SPI
import RPi.GPIO as GPIO
import requests
import sys
import Adafruit_DHT
from numpy import interp #To scale analog values
from time import sleep #To add delay cycles
from datetime import datetime


spi = spidev.SpiDev() #Created an object
spi.open(0,0)#Start SPI

GPIO.setwarnings(False)    # Ignore warnings for now
GPIO.setmode(GPIO.BOARD)   # Use physical pin numbering for moisture sensor
GPIO.setup(3, GPIO.OUT, initial = GPIO.LOW)   # Set pin 3 to be an output pin and set off by default

test_datetime = datetime.now()
test_timestamp = int(datetime.timestamp(test_datetime)) # the current timestamp in seconds
watering_schedule = []

tempSensor = Adafruit_DHT.DHT11

#Read MCP3008 ADC Data
def analogInput(channel):
    spi.max_speed_hz = 1350000#Setup SPI data rate. Do not modify this
    adc = spi.xfer2([1,(8+channel)<<4,0])#do not modify
    data = ((adc[1]&3) << 8) + adc[2]#do not modify
    return data#Return data rate

#Function for running pump
def water_plant():
    print("Pump Activated")#notify that pump has run
    GPIO.output(3, GPIO.HIGH)#Turn on pump @pin3
    sleep(1)#set pump run time, we have to measure how much water gets pumped for a period of time 2.5 ml/second
    GPIO.output(3, GPIO.LOW)#Turn off pump @pin3
   
   
def primePump():
    print("Pump Primed")#notify that pump has run
    GPIO.output(3, GPIO.HIGH)#Turn on pump @pin3
    sleep(3)#set pump run time, we have to measure how much water gets pumped for a period of time 2.5 ml/second
    GPIO.output(3, GPIO.LOW)#Turn off pump @pin3
   
def getSchedule():
    url = 'http://ec2-52-14-234-1.us-east-2.compute.amazonaws.com/schedule'
    scheduleData = requests.get(url)  # get raw data
    scheduleData = scheduleData.json()  # transform to JSON format
    scheduleDataInt = []
    print(scheduleData)  # access individual column data with list indices e.g. scheduleData[0]
    scheduleDataInt = [int(numeric_string) for numeric_string in scheduleData]
    return scheduleDataInt

#Function for getting temperature and humidity, mostly used for testing
def temp():
    humidity, temperature = Adafruit_DHT.read_retry(tempSensor,4)#USES GPIO PIN NUMBERING UNLIKE THE MOISTURE SENSOR, PHYSICAL PIN 7
    temperature = (temperature*(9/5))+32
    if humidity is not None and temperature is not None:
        print('Temp={0:0.1f}* Humidity={1:0.1f}%'.format(temperature, humidity))
    else:
        print("Failed to read temperature and humidity.")


def postWatering(pumpVar):
   
    if pumpVar == 1:
       
        setColor = 'green'
        notification = 'Successful pump'
    else:
        setColor = 'red'
        notification = 'Unsuccessful pump'
       
       
    now = datetime.now()
    now = now.strftime('%Y-%m-%d %H:%M:%S')
    url = 'http://ec2-52-14-234-1.us-east-2.compute.amazonaws.com/watering'
    myobj = {
        'success': True,
        'notes': notification,
        'time_posted': now,
        'color': setColor
    }
   
    x = requests.post(url, json=myobj)
    print(x.text)


def moistureFail():
    now = datetime.now()
    now = now.strftime('%Y-%m-%d %H:%M:%S')
    url = 'http://ec2-52-14-234-1.us-east-2.compute.amazonaws.com/watering'
    myobj = {
        'success': False,
        'notes': 'Moisture Level Above 75%',
        'time_posted': now,
        'color': 'red'
    }
   
    x = requests.post(url, json=myobj)
    print(x.text)


       
def postMoisture(moisture):
    now = datetime.now()
    now = now.strftime('%Y-%m-%d %H:%M:%S')
    url = 'http://ec2-52-14-234-1.us-east-2.compute.amazonaws.com/moisture'
    myobj = {
    'moisture_content': moisture,
    'time_posted': now
    }

    x = requests.post(url, json = myobj)
    print(x.text)


def postTemperature():
    now = datetime.now()
    now = now.strftime('%Y-%m-%d %H:%M:%S')
    url = 'http://ec2-52-14-234-1.us-east-2.compute.amazonaws.com/temperature'
   
    humidity, temperature = Adafruit_DHT.read_retry(tempSensor,4)#USES GPIO PIN NUMBERING UNLIKE THE MOISTURE SENSOR, PHYSICAL PIN 7
    temperature = (temperature*(9/5))+32
   
    myobj = {
        'tempF': temperature,  # temperature in fahrenheit
        'time_posted': now  # current time
    }

    x = requests.post(url, json = myobj)
    print(x.text)
   
    return

def postHumidity():
    now = datetime.now()
    now = now.strftime('%Y-%m-%d %H:%M:%S')
    url = 'http://ec2-52-14-234-1.us-east-2.compute.amazonaws.com/humidity'
   
   
    humidity, temperature = Adafruit_DHT.read_retry(tempSensor,4)#USES GPIO PIN NUMBERING UNLIKE THE MOISTURE SENSOR, PHYSICAL PIN 7
    if humidity > 120:
        humidity = humidity - 50

    myobj = {
        'humidity': humidity,  # humidity
        'time_posted': now  # current time
    }

    x = requests.post(url, json = myobj)
    print(x.text)


while True:
    #primePump()
    pumpVar = 0
    moisture = analogInput(0) #Read from CH0
    moisture = interp(moisture, [0, 1023], [0,100])
    moisture = int(moisture)
    print("Moisture Content: ", moisture)#Print moisture percentage
   
    #get schedule data
    #watering_schedule = getSchedule()
    watering_schedule = getSchedule()
    #Call moisture sensor and send to website
    postMoisture(moisture)
    #Call temperature sensor and send to website
    postTemperature()
    #Call humidity sensor and send to website
    postHumidity()
   
   
    now = datetime.now()
    datetime.timestamp(now)
   
    current_timestamp = int(datetime.timestamp(now)) # the current timestamp in seconds for t
    print("", current_timestamp)
   
    #Check Timestamps
    for t in watering_schedule:
        if current_timestamp in range(t-15, t+25):
                if(moisture < 75):
                    pumpVar = 1
                    watering_schedule.remove(t)
                    water_plant() # call the watering function here  IF YOU UNCOMMENT THIS THE PUMP WILL ACTUALLY RUN.  It is kinda annoying so please leave it be
                    postWatering(pumpVar)
                else:
                    watering_schedule.remove(t)
                    moistureFail()      
           
    sleep(10)#set update speed for website