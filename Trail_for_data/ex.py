import requests
import time
import random

# ThingSpeak Write API Key
WRITE_API_KEY = "4Z3MG5U3J5C24UPB"

# ThingSpeak API URL
URL = "https://api.thingspeak.com/update?api_key=4Z3MG5U3J5C24UPB&field1=0"

while True:
    # Sample machine data
    temperature = round(random.uniform(25, 40), 2)
    pressure = round(random.uniform(2, 5), 2)
    machine_status = 1  # 1 = Running, 0 = Stopped

    # Data to send
    payload = {
        "api_key": WRITE_API_KEY,
        "field1": temperature,
        "field2": pressure,
        "field3": machine_status
    }

    try:
        response = requests.post(URL, data=payload, timeout=10)

        if response.status_code == 200 and response.text.strip() != "0":
            print("Data sent successfully!")
            print("Entry ID:", response.text)
            print("Temperature:", temperature)
            print("Pressure:", pressure)
            print("Machine Status:", machine_status)
        else:
            print("Failed to send data:", response.text)

    except requests.RequestException as error:
        print("Connection error:", error)

    # Wait 15 seconds between updates
    time.sleep(15)

