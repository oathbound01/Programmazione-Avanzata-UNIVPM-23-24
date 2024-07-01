FROM node:lts-slim
WORKDIR /usr/app
COPY . .

# Dependencies

RUN npm install
RUN npm install -g typescript
RUN npm install -g express
RUN npm install -g nodemon

# App run
RUN tsc app.ts
RUN ["node", "app.js"]