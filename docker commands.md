mkdir -p ~/.docker/cli-plugins/
curl -SL https://github.com/docker/compose/releases/download/v2.30.2/docker-compose-linux-x86_64 -o ~/.docker/cli-plugins/docker-compose

docker compose -p poc up
docker compose -p poc2 up

docker build -t poc-server .

docker run -p 5000:5000 poc
docker run -p 4000:5000 poc2

docker push truclinhgm/cattus-nginx:deploy-ready
docker push truclinhgm/poc:deploy-ready
docker push truclinhgm/poc2:deploy-ready
docker login -u truclinhgm
docker tag cattus-nginx truclinhgm/cattus-nginx:deploy-ready
docker tag poc truclinhgm/poc:deploy-ready
docker tag poc2 truclinhgm/poc2:deploy-ready

docker container stop poc2 \
&& docker container remove poc2

docker image remove poc2
docker exec poc2


docker builder prune
docker builder prune -a
docker compose up
truclinhgm/poc:deploy-ready
truclinhgm/poc2:deploy-ready
FROM --platform=linux/amd64 node:18
FROM node:18

docker build --platform=linux/amd64

docker compose build
sudo lsof -i :4000
sudo kill -9 <PID>

ss -lptn 'sport = :4000'