import sys
sys.path.insert(0, "~/.local/lib/python3.6/site-packages")
import pymysql
from flask import Flask, request, jsonify
from datetime import datetime

now = datetime.now()
now = now.strftime('%Y-%m-%d %H:%M:%S')
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello World! ' + 'This is the homepage for group 5'


@app.route('/api')
def get_test():
    connection = pymysql.connect(host='[redacted]',
                                 user='[redacted]',
                                 password='[redacted]',
                                 db='MINI_PROJECT',
                                 charset='utf8mb4',
                                 cursorclass=pymysql.cursors.DictCursor)
    try:
        with connection.cursor() as cursor:
            # Read a single record
            sql = "SELECT `Name`  FROM `Test`"
            cursor.execute(sql)
            result = cursor.fetchone()
            return result
    finally:
        connection.close()


@app.route('/moisture', methods=['POST', 'GET'])
def postMoisture():
    connection = pymysql.connect(host='[redacted]',
                                 user='[redacted]',
                                 password='[redacted]',
                                 db='MINI_PROJECT',
                                 charset='utf8mb4',
                                 cursorclass=pymysql.cursors.DictCursor)
    if (request.method=='POST'):
        try:
            json = request.json
            moisture = json['moisture_content']
            time = json['time_posted'] 
            with connection.cursor() as cursor:
                sql = "INSERT INTO `Moisture` (`id`, `moisture_content`, `time_posted`) VALUES (%s, %s, %s)"
                data = (None, moisture, time) # None due to auto-incrementing id
                cursor.execute(sql, data)
                connection.commit()
            return 'Successfully posted moisture data.'
        finally:
            connection.close()

    if (request.method=='GET'):
        try:
            with connection.cursor() as cursor:
                sql = "SELECT * FROM (SELECT * FROM `Moisture` ORDER BY id DESC LIMIT 10) sub ORDER BY id ASC"
                cursor.execute(sql)
                moistureList = cursor.fetchmany(10)
                return jsonify(moistureList)
        finally:
            connection.close()


@app.route('/schedule', methods=['POST', 'GET'])
def wateringSchedule():
    connection = pymysql.connect(host='[redacted]',
                                 user='[redacted]',
                                 password='[redacted]',
                                 db='MINI_PROJECT',
                                 charset='utf8mb4',
                                 cursorclass=pymysql.cursors.DictCursor)
    if (request.method=='POST'):
        try:
            json = request.json
            start_timestamp = int(json['startTimestamp']) # start timestamp in seconds
            period = int(json['period'])  # period in seconds
            seconds_in_year = 31536000 
            # generate periods for the next year
            future_events = range(start_timestamp, start_timestamp+seconds_in_year, period)
            sql = "INSERT INTO WateringSchedule (timestamp) values "
            for t in future_events:
                sql += '(%d),' % (t)
            sql = sql[:-1] + ';'
            with connection.cursor() as cursor:
                cursor.execute('delete from WateringSchedule')
                cursor.execute(sql)
                connection.commit()
            return jsonify(resultMessage='success', resultCode=200)
        except:
            connection.rollback()
        finally:
            connection.close()

    if (request.method=='GET'):
        try:
            now = datetime.now()
            current_timestamp = int(datetime.timestamp(now))
            with connection.cursor() as cursor:
                sql = 'SELECT timestamp FROM WateringSchedule where timestamp between %d and %d;' % (current_timestamp-10, current_timestamp+3600)
                cursor.execute(sql)
                timestamps = cursor.fetchall()
                timestamps = [t['timestamp'] for t in timestamps]
                return jsonify(timestamps)
        finally:
            connection.close()
            
@app.route('/watering', methods=['POST', 'GET'])
def waterPlant():
    connection = pymysql.connect(host='[redacted]',
                                 user='[redacted]',
                                 password='[redacted]',
                                 db='MINI_PROJECT',
                                 charset='utf8mb4',
                                 cursorclass=pymysql.cursors.DictCursor)
    if (request.method == 'POST'):
        try:
            json = request.json
            success = json['success']
            notes = json['notes']
            time = json['time_posted']
            color = json['color']
            with connection.cursor() as cursor:
                sql = "INSERT INTO `Watering` (`id`, `success`, `notes`, `time_posted`, `color`) VALUES (%s, %s, %s, %s, %s)"
                data = (None, success, notes, time, color)
                cursor.execute(sql, data)
                connection.commit()
            return 'Successfully posted watering data.'
        finally:
            connection.close()

    if (request.method == 'GET'):
        try:
            with connection.cursor() as cursor:
                sql = "SELECT * FROM `Watering`"
                cursor.execute(sql)
                wateringList = cursor.fetchall()
                return jsonify(wateringList)
        finally:
            connection.close()

@app.route('/watering/recent', methods=['GET'])
def recentWatering():
    connection = pymysql.connect(host='[redacted]',
                                 user='[redacted]',
                                 password='[redacted]',
                                 db='MINI_PROJECT',
                                 charset='utf8mb4',
                                 cursorclass=pymysql.cursors.DictCursor)
    try:
        with connection.cursor() as cursor:
            sql = "SELECT * FROM (SELECT * FROM `Watering` ORDER BY id DESC LIMIT 5) sub ORDER BY id DESC"
            cursor.execute(sql)
            recentWateringList = cursor.fetchmany(5)
            return jsonify(recentWateringList)
    finally:
        connection.close()

@app.route('/get-next-watering', methods=['GET'])
def getNextWatering():
    connection = pymysql.connect(host='[redacted]',
                                 user='[redacted]',
                                 password='[redacted]',
                                 db='MINI_PROJECT',
                                 charset='utf8mb4',
                                 cursorclass=pymysql.cursors.DictCursor)
    if request.method == 'GET':
        try:
            timestamp = int(request.args.get('timestamp'))
            with connection.cursor() as cursor:
                sql = "select timestamp from WateringSchedule where timestamp > %d limit 1;" % timestamp
                cursor.execute(sql)
                timestamp = cursor.fetchone()
                print('the result is', jsonify(timestamp))
                return jsonify(timestamp)
        finally:
            connection.close()

@app.route('/temperature', methods=['POST', 'GET'])
def temperature():
    connection = pymysql.connect(host='[redacted]',
                                 user='[redacted]',
                                 password='[redacted]',
                                 db='MINI_PROJECT',
                                 charset='utf8mb4',
                                 cursorclass=pymysql.cursors.DictCursor)
    if (request.method=='POST'):
        try:
            json = request.json
            temp = json['tempF']
            time = json['time_posted']
            with connection.cursor() as cursor:
                sql = "INSERT INTO `Temperature` (`id`, `tempF`, `time_posted`) VALUES (%s, %s, %s)"
                data = (None, temp, time)
                cursor.execute(sql, data)
                connection.commit()
            return 'Successfully posted temperature data.'
        finally:
            connection.close()

    if (request.method=='GET'):
        try:
            with connection.cursor() as cursor:
                sql = "SELECT * FROM (SELECT * FROM `Temperature` ORDER BY id DESC LIMIT 10) sub ORDER BY id ASC"
                cursor.execute(sql)
                temperatureList = cursor.fetchmany(10)
                return jsonify(temperatureList)
        finally:
            connection.close()

@app.route('/humidity', methods=['POST', 'GET'])
def humidity():
    connection = pymysql.connect(host='[redacted]',
                                 user='[redacted]',
                                 password='[redacted]',
                                 db='MINI_PROJECT',
                                 charset='utf8mb4',
                                 cursorclass=pymysql.cursors.DictCursor)
    if (request.method=='POST'):
        try:
            json = request.json
            humidity = json['humidity']
            time = json['time_posted']
            with connection.cursor() as cursor:
                sql = "INSERT INTO `Humidity` (`id`, `humidity`, `time_posted`) VALUES (%s, %s, %s)"
                data = (None, humidity, time)
                cursor.execute(sql, data)
                connection.commit()
            return 'Successfully posted humidity data.'
        finally:
            connection.close()

    if (request.method=='GET'):
        try:
            with connection.cursor() as cursor:
                sql = "SELECT * FROM (SELECT * FROM `Humidity` ORDER BY id DESC LIMIT 10) sub ORDER BY id ASC"
                cursor.execute(sql)
                humidityList = cursor.fetchmany(10)
                return jsonify(humidityList)
        finally:
            connection.close()


if __name__ == '__main__':
    app.run()