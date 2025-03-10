import googlemaps
import googlemaps.exceptions
from .google_maps_config import gmaps
from .constants import CYCLE_LIMIT_HOURS , MAX_DRIVING_HOURS_WITHOUT_REST, REST_BREAK_DURATION, AFTER_PICKUP_TIME, BEFORE_DROP_OFF_TIME
from PIL import Image, ImageDraw, ImageFont
from datetime import datetime
from pathlib import Path
import os
import base64
import io
from polyline import encode as polyline_encode, decode as polyline_decode


def get_route_time(start_coords, end_coords):
    start = (start_coords[0], start_coords[1])
    end = (end_coords[0], end_coords[1])
    directions = gmaps.directions(start, end, mode="driving")
    travel_time = directions[0]["legs"][0]["duration"]["value"]
    return travel_time / 3600


def get_coordinates(address):
    geocode_result = gmaps.geocode(address)
    if geocode_result:
        location = geocode_result[0]["geometry"]["location"]
        return location["lat"], location["lng"]
    return None


def format_travel_time(travel_time):
    hours = int(travel_time)
    minutes = int((travel_time - hours) * 60)
    return f"{hours} hours and {minutes} minutes"


def get_route_coords(start_coords, end_coords):
    try:
        directions = gmaps.directions(
            (start_coords[0], start_coords[1]),
            (end_coords[0], end_coords[1]),
            mode="driving"
        )
        if directions:
            route = directions[0]["legs"][0]["steps"]
            coordinates = []
            for step in route:
                step_polyline = step["polyline"]["points"]
                step_coords = polyline_decode(step_polyline)
                coordinates.extend(step_coords)
            return coordinates
    except googlemaps.exceptions.ApiError as e:
        print(f"API Error: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")
    return []


def get_route_polyline(start_coords, end_coords):
    try:
        directions = gmaps.directions(
            (start_coords[0], start_coords[1]),
            (end_coords[0], end_coords[1]),
            mode="driving"
        )
        if directions:
            polyline = directions[0]["overview_polyline"]["points"]
            return polyline

    except googlemaps.exceptions.ApiError as e:
        print(f"API Error: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")
    return None

def get_combined_polyline(coords_list):
    combined_coords = []
    for coords in coords_list:
        combined_coords.extend(coords)
    return polyline_encode(combined_coords)

def calculate_remaining_cycle_time(current_cycle_used):
    remaining_time = CYCLE_LIMIT_HOURS - current_cycle_used
    return remaining_time


def calculate_fuel_stops(distance):
    fuel_stop_distance = 1000
    fuel_stops = distance // fuel_stop_distance
    if distance % fuel_stop_distance != 0:
        fuel_stops += 1
    return fuel_stops


def get_route_distance(start_coords, end_coords):
    start = (start_coords[0], start_coords[1])
    end = (end_coords[0], end_coords[1])
    directions = gmaps.directions(start, end, mode="driving")
    if directions:
        distance = directions[0]["legs"][0]["distance"]["value"]
        return distance / 1609.34
    return None

def find_rest_stop_along_route(start_coords, end_coords, driving_hours, total_duration):
    target_duration = driving_hours

    if driving_hours >= total_duration:
        return None

    directions_result = gmaps.directions(start_coords, end_coords, mode="driving", departure_time="now")

    if not directions_result:
        return None

    route = directions_result[0]
    legs = route['legs'][0]

    current_duration = 0
    target_location = None

    for step in legs['steps']:
        current_duration += step['duration']['value']
        
        if current_duration >= target_duration:
            target_location = step['end_location']
            break

    if target_location:

        places_result = gmaps.places_nearby(target_location, radius=5000, type='rest_area')

        if places_result['status'] == 'OK':
    
            rest_stop = places_result['results'][0]
            return rest_stop['geometry']['location']

    return None


def calculate_rest_stops(total_driving_time, start_coords, end_coords):
    rest_stops = []
    if total_driving_time > MAX_DRIVING_HOURS_WITHOUT_REST:
        num_rest_breaks = int(total_driving_time // MAX_DRIVING_HOURS_WITHOUT_REST)

        for i in range(1, num_rest_breaks + 1):
            rest_stop_coords = find_rest_stop_along_route(start_coords, end_coords, i * MAX_DRIVING_HOURS_WITHOUT_REST, total_driving_time)
            if rest_stop_coords:
                rest_stops.append({
                    "coords": rest_stop_coords,
                    "duration": REST_BREAK_DURATION,
                    "reason": f"Rest break after {i * MAX_DRIVING_HOURS_WITHOUT_REST} hours of driving"
                })
    
    return rest_stops


def log(input):
    try:
        BASE_DIR = Path(__file__).resolve().parent.parent
        LOG_TEMPLATE_PATH = BASE_DIR / "trips" / "logs" / "template" / "blank-paper-log.png"
        OUTPUT_PATH = BASE_DIR / "trips" / "logs"
        if not LOG_TEMPLATE_PATH.exists():
            return "Log template image not found"

        image = Image.open(LOG_TEMPLATE_PATH)
        draw = ImageDraw.Draw(image)
        font = ImageFont.load_default()
        
        try:
            date_obj = datetime.strptime(input.get("date", "N/A"), "%Y-%m-%d")
            day, month, year = str(date_obj.day), str(date_obj.month), str(date_obj.year)
        except ValueError:
            day, month, year = "N/A", "N/A", "N/A"
        
        text_positions = [
            ((90, 35), input.get("starting", "N/A")),
            ((295, 35), input.get("destination", "N/A")),
            ((230, 10), day),
            ((180, 10), month),
            ((265, 10), year),
            ((60, 70), str(input.get("total_miles_driving", "N/A"))),
            ((145, 70), str(input.get("total_mileage_today", "N/A"))),
            ((230, 87), input.get("main_office_address", "N/A")),
            ((230, 110), input.get("home_terminal_address", "N/A")),
            ((60, 105), input.get("Numbers", "N/A"))
        ]

        for position, text in text_positions:
            draw.text(position, text, fill="black", font=font)

        temp_img_path = os.path.join(OUTPUT_PATH, "temp_log.png")
        image.save(temp_img_path)
        
        img_byte_arr = io.BytesIO()
        image.save(img_byte_arr, format="PNG")
        img_byte_arr.seek(0)

        img_base64 = base64.b64encode(img_byte_arr.read()).decode("utf-8")

        return img_base64         

    except Exception as e:
        print(f"Error generating log: {e}")


def get_changing_times(on_duty_time_start, total_time_needed):
    driving_start_time = on_duty_time_start + AFTER_PICKUP_TIME
    driving_end_time = on_duty_time_start + total_time_needed - BEFORE_DROP_OFF_TIME

    statuses = [
        {"start_hour": on_duty_time_start, "end_hour": on_duty_time_start + AFTER_PICKUP_TIME, "status": "on-duty"},
        {"start_hour": driving_start_time, "end_hour": driving_end_time, "status": "driving"},
        {"start_hour": driving_end_time, "end_hour": driving_end_time + BEFORE_DROP_OFF_TIME, "status": "on-duty"},
        {"start_hour": driving_end_time + BEFORE_DROP_OFF_TIME, "end_hour": on_duty_time_start + total_time_needed, "status": "off-duty"}
    ]

    changing_times = []
    
    for status in statuses:
        start_hour = int(status['start_hour'])
        start_minute = int((status['start_hour'] % 1) * 60)
        end_hour = int(status['end_hour'])
        end_minute = int((status['end_hour'] % 1) * 60)
        
        changing_times.append(
            {"hour": f"{start_hour}:{str(start_minute).zfill(2)}", "status": status['status']},
            {"hour": f"{end_hour}:{str(end_minute).zfill(2)}", "status": status['status']}
        )

    return [dict(t) for t in {tuple(d.items()) for d in changing_times}]


def get_address_from_coords(lat, lng):
    reverse_geocode_result = gmaps.reverse_geocode((lat, lng))
        
    if not reverse_geocode_result:
        return None
        
    best_result = reverse_geocode_result[0]
    return best_result.get('formatted_address'),