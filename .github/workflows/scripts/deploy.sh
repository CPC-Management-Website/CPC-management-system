#!/bin/bash

# Login into Docker Hub
echo $DOCKERHUB_TOKEN | docker login -u $DOCKERHUB_USERNAME --password-stdin

# Pull the image corresponding to the commit of the workflow
docker pull $DOCKERHUB_USERNAME/$IMAGE_NAME:sha-${GITHUB_SHA::7}

# Stop the running container
docker ps
docker stop $CONTAINER_NAME || echo "Failed to stop $CONTAINER_NAME"
docker rm $CONTAINER_NAME || echo "Failed to remove $CONTAINER_NAME"

# Add the environment variables to a .env file
echo "$ENVIRONMENT_VARIABLES" > .env

# Run the Docker container
docker run -d --env-file .env -e WORKERS=$NUM_WORKERS -p $CONTAINER_PORT:5000 --name $CONTAINER_NAME -v $LOGS_VOLUME:/src/logs -v $VJUDGE_SESSION_VOLUME:/src/cache $DOCKERHUB_USERNAME/$IMAGE_NAME:sha-${GITHUB_SHA::7}

# Remove .env file
rm .env

# Wait to see if the container will crash for any reason
sleep 10

# Check running containers
docker ps

# Fail the workflow if the container is not running
# If the condition evaluates to false the script will immediately exit
if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
  echo "Container is running."
fi
