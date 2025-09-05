from flask_sqlalchemy import SQLAlchemy

from Utils.CalculateTimeToBurnCalories import calculate_time_to_burn_calories
from Utils.image_processing import extract_barcode

db = SQLAlchemy()

import json
import mysql.connector
from mysql.connector import Error
from Repositories.ProductLocalStorageRepository import ProductLocalStorageRepository

def load_db_config(filename):
    with open(filename, 'r') as file:
        config = json.load(file)
    return config

config = load_db_config('configMysql.json')


productLocalStorageRepository = None

try:
    connection = mysql.connector.connect(
        host=config['host'],
        user=config['user'],
        passwd=config['password'],
        database=config['database']
    )
    print("Conectare reușită la MySQL")
    productLocalStorageRepository = ProductLocalStorageRepository(connection)
except Error as e:
    print(f"Eroare la conectare: {e}")
