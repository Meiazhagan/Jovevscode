from flask import Flask, jsonify, send_from_directory
import mysql.connector
from mysql.connector import Error

app = Flask(__name__)

def get_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="12345678",
        database="iot_database"
    )

@app.route("/")
def home():
    return send_from_directory(".", "index.html")

@app.route("/<path:filename>")
def static_files(filename):
    if filename in ("script.js", "style.css"):
        return send_from_directory(".", filename)
    return "Not Found", 404

@app.route("/api/machines")
def get_machines():
    connection = None
    cursor = None

    try:
        connection = get_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM machine_data")
        return jsonify(cursor.fetchall())

    except Error:
        app.logger.exception("Database error")
        return jsonify({"error": "Unable to retrieve machine data"}), 500

    finally:
        if cursor is not None:
            cursor.close()
        if connection is not None and connection.is_connected():
            connection.close()

if __name__ == "__main__":
    app.run(debug=True)