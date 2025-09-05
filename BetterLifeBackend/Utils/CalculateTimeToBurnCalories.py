from math import floor

import requests
from bs4 import BeautifulSoup

calories_burned_per_hour = {
    (40, 50): {"calories_min": 210, "calories_max": 250},
    (51, 60): {"calories_min": 250, "calories_max": 300},
    (61, 70): {"calories_min": 300, "calories_max": 350},
    (71, 80): {"calories_min": 350, "calories_max": 400},
    (81, 90): {"calories_min": 400, "calories_max": 450},
    (91, 100): {"calories_min": 450, "calories_max": 500},
    (101, 110): {"calories_min": 500, "calories_max": 550},
    (111, 120): {"calories_min": 550, "calories_max": 600},
}

def get_calories_burned(weight):
    for (min_weight, max_weight), calories in calories_burned_per_hour.items():
        if min_weight <= weight <= max_weight:
            return calories['calories_min'], calories['calories_max']
    return None

def calculate_time_to_burn_calories(weightUser, kcal, weightProduct):
    calories_to_burn = int(kcal) / 100 * weightProduct

    calories = get_calories_burned(weightUser)

    if calories:
        calories_min, calories_max = calories
        time_min = calories_to_burn / calories_max
        time_max = calories_to_burn / calories_min
        time_min *= 60
        time_max *= 60
        return floor(time_min)
    else:
        return None
