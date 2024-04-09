# Node.js 이미지를 사용합니다.
FROM node:14

# 작업 디렉토리를 설정합니다.
WORKDIR /usr/src/app

# package.json과 package-lock.json을 작업 디렉토리로 복사합니다.
COPY package*.json ./

# 애플리케이션의 모든 의존성을 설치합니다.
RUN npm install

# 소스 코드를 이미지로 복사합니다.
COPY . .

# 애플리케이션을 실행합니다.
CMD [ "npm", "start" ]

# 컨테이너가 리스닝할 포트를 설정합니다. 기본적으로 Create React App은 3000번 포트를 사용합니다.
EXPOSE 3000
