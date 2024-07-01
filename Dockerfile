FROM node:lts-slim
WORKDIR /usr/app
COPY . .

# Dependencies

RUN npm install
RUN npm install -g typescript

# App run
RUN tsc
CMD ["node", "app.js"]