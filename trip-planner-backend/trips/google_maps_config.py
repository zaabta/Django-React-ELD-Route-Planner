import googlemaps
from dotenv import load_dotenv
import os

load_dotenv()

GOOGLE_MAP_API_KEY = os.getenv("GOOGLE_MAP_API_KEY")

gmaps = googlemaps.Client(key=GOOGLE_MAP_API_KEY)