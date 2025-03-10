from rest_framework.response import Response
from rest_framework.decorators import api_view
import json
from .utils import get_coordinates, get_route_time, format_travel_time, get_route_distance, get_route_coords, calculate_remaining_cycle_time, calculate_fuel_stops, log, calculate_rest_stops, get_changing_times, get_address_from_coords
from .constants import PICKUP_DROPOFF_DELAY_HOURS
from polyline import encode as polyline_encode


@api_view(["GET"])
def plan_trip(request):
    current_location = request.GET.get("current_location", "")
    pickup = request.GET.get("pickup", "")
    dropoff = request.GET.get("dropoff", "")
    current_cycle_used = request.GET.get("current_cycle_used", "")

    if not pickup or not dropoff:
        return Response({"error": "Pickup and dropoff locations are required."}, status=400)

    total_time_needed = 0
    total_distance = 0
    route_polyline_current_coords_pickup_coords = None
    current_coords = None
    pickup_coords = get_coordinates(pickup)

    if current_location:
        current_coords = get_coordinates(current_location)
        if not current_coords:
            return Response({"error": "Could not find coordinates for the current location."}, status=400)
        time_to_pickup = get_route_time(current_coords, pickup_coords)
        distance_to_pickup = get_route_distance(current_coords, pickup_coords)
        route_polyline_current_coords_pickup_coords = get_route_coords(current_coords, pickup_coords)

        total_time_needed += time_to_pickup
        total_distance += distance_to_pickup

    dropoff_coords = get_coordinates(dropoff)
    if not pickup_coords or not dropoff_coords:
        return Response({"error": "Could not find coordinates for the given addresses."}, status=400)

    time_to_dropoff = get_route_time(pickup_coords, dropoff_coords)
    distance_to_dropoff = get_route_distance(pickup_coords, dropoff_coords)
    route_polyline_pickup_coords_pickup_coords = get_route_coords(pickup_coords, dropoff_coords)

    total_time_needed += time_to_dropoff + PICKUP_DROPOFF_DELAY_HOURS
    total_distance += distance_to_dropoff

    fuel_stops = calculate_fuel_stops(total_distance)

    remaining_time = calculate_remaining_cycle_time(int(current_cycle_used))

    if total_time_needed > remaining_time:
        return Response({
            "error": f"Insufficient remaining driving time. You need {total_time_needed - remaining_time:.2f} more hours."
        }, status=400)

    rest_stops = calculate_rest_stops(
        total_time_needed, pickup_coords, dropoff_coords)
    
    for stop in rest_stops:
        lat, lng = stop["coords"]["lat"], stop["coords"]["lng"]
        stop["address"] = get_address_from_coords(lat, lng)[0]

    return Response({
        "current_coords": current_coords,
        "pickup_coords": pickup_coords,
        "dropoff_coords": dropoff_coords,
        "travel_time": format_travel_time(total_time_needed),
        "total_distance_miles": total_distance,
        "route": polyline_encode(route_polyline_current_coords_pickup_coords + route_polyline_pickup_coords_pickup_coords),
        "fuel_stops": fuel_stops,
        "remaining_cycle_time": remaining_time,
        "rest_stops": rest_stops
    }, status=200)


@api_view(["POST"])
def generate_log(request):
    try:
        data = json.loads(request.body)
        res = log(data)

        return Response({"log": res})

    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(['POST'])
def get_status_times(request):
    on_duty_time_start = float(request.data.get('on_duty_time_start'))
    total_time_needed = float(request.data.get('total_time_needed'))

    changing_times = get_changing_times(on_duty_time_start, total_time_needed)

    return Response(changing_times, safe=False)
