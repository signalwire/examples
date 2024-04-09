#!/usr/bin/env bash

docker build -t nodelenny .
docker run -it --rm -v `pwd`/.node-persist:/app/.node-persist --name nodelenny --env-file .env nodelenny