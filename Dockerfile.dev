FROM node:10
WORKDIR /usr/src/app
ENV PORT 5000

COPY package*.json ./
RUN npm i

CMD ["npm", "run", "dev"]
