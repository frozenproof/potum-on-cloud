mkdir -p ~/.docker/cli-plugins/
curl -SL https://github.com/docker/compose/releases/download/v2.30.2/docker-compose-linux-x86_64 -o ~/.docker/cli-plugins/docker-compose

docker-compose -p poc up

docker build -t poc-server .

docker run -p 5000:5000 poc

docker push truclinhgm/cattus-nginx:deploy-ready
docker push truclinhgm/poc:deploy-ready
docker login -u truclinhgm
docker tag cattus-nginx truclinhgm/cattus-nginx:deploy-ready
docker tag poc-server truclinhgm/poc:deploy-ready
docker builder prune

docker compose up

FROM --platform=linux/amd64 node:18
FROM node:18

docker build --platform=linux/amd64

docker compose build

