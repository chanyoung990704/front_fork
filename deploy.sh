#!/bin/bash

cd /home/ubuntu/deploy/

# 이미지 파일명과 컨테이너 이름 설정
IMAGE_TAR="urmovie_front.tar"
CONTAINER_NAME="urmovie_front"

# 기존에 실행 중인 같은 이름의 컨테이너가 있으면 중지하고 삭제
if [ $(sudo docker ps -aq -f name=^${CONTAINER_NAME}$) ]; then
    echo "Stopping and removing existing container..."
    sudo docker stop $CONTAINER_NAME > /dev/null 2>&1
    sudo docker rm $CONTAINER_NAME > /dev/null 2>&1
fi

# .tar 파일로부터 Docker 이미지 로드
sudo docker load -i $IMAGE_TAR > /dev/null 2>&1

# 로드된 이미지의 ID 얻기
IMAGE_ID=$(sudo docker images -q | head -n 1)

# Docker 컨테이너 실행
sudo docker run -d -p 3000:3000 --name $CONTAINER_NAME $IMAGE_ID > /dev/null 2>&1
