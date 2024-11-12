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

find /path/to/directory -mindepth 1 -maxdepth 1 -type d -exec rm -rf {} \; && xargs mkdir -p < <(find /path/to/directory -mindepth 1 -maxdepth 1 -type d -print)
find /path/to/directory -mindepth 1 -maxdepth 1 -type d -exec rm -rf {} \; && xargs mkdir -p < <(find /path/to/directory -mindepth 1 -maxdepth 1 -type d -print)
find ./your_subdirectory -mindepth 1 -maxdepth 1 -type d -exec rm -rf {} \; && mkdir -p ./your_subdirectory/{folder1,folder2,folder3}
ls -d ./your_subdirectory/*/ | xargs -I {} rm -rf {} && ls -d ./your_subdirectory/*/ | xargs -I {} mkdir -p {}
Ctrl + P + Q
rm -rf dirName

docker build -t poc .
