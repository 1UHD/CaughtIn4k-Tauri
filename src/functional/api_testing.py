import requests

#this api key is outdated anyways, fuckers.
api_key = "7f1a269c-1d03-4cf6-aebf-813be77a3de8"
url = f"https://api.hypixel.net/player?key={api_key}&uuid=860d353d-1f1e-4356-a059-fec025a2b590"

req = requests.get(url=url)
data = req.json()

with open("/Users/kurt/Desktop/CaughtIn4k_React/CaughtIn4k_Overlay/src/functional/output.txt", "w") as f:
    f.write(str(data))
