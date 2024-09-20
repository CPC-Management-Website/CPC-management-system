import json
from flask import Blueprint, request

from app.models import Resources


resource = Blueprint("resource", __name__, url_prefix="/resources")


@resource.route("/", methods=["POST"], strict_slashes=False)
def add_resource():
    resource_topic = request.json["resourceTopic"]
    resource_link = request.json["resourceLink"]
    resource_level = request.json["resourceLevel"]
    resource_season = request.json["seasonID"]
    Resources.add_resource(
        topic=resource_topic,
        link=resource_link,
        level=resource_level,
        season_id=resource_season,
    )
    return ""


@resource.route("/", methods=["GET"], strict_slashes=False)
def get_all_resources():
    season = request.args.get("season")
    resources = Resources.get_all_resources(season_id=season)
    return json.dumps(resources)


@resource.route("/<int:resource_id>", methods=["PATCH"], strict_slashes=False)
def edit_resource(resource_id):
    topic = request.json["topic"]
    level_id = request.json["level_id"]
    link = request.json["link"]
    Resources.update_resource(
        resource_id=resource_id, topic=topic, level_id=level_id, link=link
    )
    return "Success"


@resource.route("/<int:resource_id>", methods=["DELETE"], strict_slashes=False)
def delete_resource(resource_id):
    Resources.delete_resource(resource_id=resource_id)
    return "Success"
