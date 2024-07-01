FROM node:lts-slim
WORKDIR /usr/app
COPY . .

# Dependencies

RUN npm install
RUN npm install -g typescript ts-node nodemon

# App run

RUN tsc
CMD ["nodemon", "app.ts"]