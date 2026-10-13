from flask import Flask, jsonify
import mysql.connector

app = Flask(__name__)

# Connect to MySQL
def get_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="12345678",
        database="iot_database"
    )

# API to fetch table data
@app.route("/api/machines", methods=["GET"])
def get_machines():
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute("SELECT * FROM machine_data")
        records = cursor.fetchall()
        return jsonify(records)
    finally:
        cursor.close()
        connection.close()

if __name__ == "__main__":
    app.run(debug=True)