import requests
import mysql.connector
import time

# --------------------------------
# ThingSpeak Configuration
# --------------------------------
CHANNEL_ID = "3528809"
READ_API_KEY = "CXLFB7XQEI79T8HG"

THINGSPEAK_URL = (
    f"https://api.thingspeak.com/channels/3528809/feeds.json?api_key=CXLFB7XQEI79T8HG&results=2"
    f"{3528809}/feeds.json"
)

# --------------------------------
# MySQL Configuration
# --------------------------------
DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "12345678",
    "database": "iot_database"
}


def fetch_thingspeak_data():
    params = {"results": 100}

    if READ_API_KEY:
        params["api_key"] = READ_API_KEY

    response = requests.get(
        THINGSPEAK_URL,
        params=params,
        timeout=15
    )

    response.raise_for_status()
    data = response.json()

    return data.get("feeds", [])


def store_in_mysql(feeds):
    connection = mysql.connector.connect(**DB_CONFIG)
    cursor = connection.cursor()

    insert_query = """
        INSERT IGNORE INTO machine_data
        (entry_id, recorded_at, temperature,
         pressure, machine_status)
        VALUES (%s, %s, %s, %s, %s)
    """

    inserted = 0

    try:
        for feed in feeds:
            values = (
                int(feed["entry_id"]),
                feed.get("created_at"),
                float(feed["field1"])
                    if feed.get("field1") else None,
                float(feed["field2"])
                    if feed.get("field2") else None,
                int(float(feed["field3"]))
                    if feed.get("field3") else None
            )

            cursor.execute(insert_query, values)
            inserted += cursor.rowcount

        connection.commit()
        print(f"New records stored: {inserted}")

    finally:
        cursor.close()
        connection.close()


# --------------------------------
# Main Program
# --------------------------------
while True:
    try:
        feeds = fetch_thingspeak_data()

        if feeds:
            store_in_mysql(feeds)
            print("ThingSpeak data fetched successfully.")
        else:
            print("No data found in ThingSpeak.")

    except (requests.RequestException,
            mysql.connector.Error,
            ValueError,
            KeyError) as error:
        print("Error:", error)

    # Check again after 60 seconds
    time.sleep(60)