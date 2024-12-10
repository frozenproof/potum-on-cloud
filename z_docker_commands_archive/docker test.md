# Docker normal version
```
docker build -t poc .

docker run -p 5000:5000 poc
```

# Docker compose version
```
docker compose up
```

docker push truclinhgm/cattus-nginx:deploy-ready
docker push truclinhgm/poc:deploy-ready

docker login -u truclinhgm

docker tag cattus-nginx truclinhgm/cattus-nginx:deploy-ready
docker tag poc-server truclinhgm/poc:deploy-ready

docker image list

docker build -t poc .
