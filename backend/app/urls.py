import json
import os

path = os.path.dirname(__file__) + "/../../view/src/urls/server_urls.json"
url_file = open(path)
urls = json.load(url_file)
