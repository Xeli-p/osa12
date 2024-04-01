FROM node:20

WORKDIR /usr/src/app

COPY . .

RUN npm install

ENV VITE_BACKEND_URL=http://localhost:8080/api/notes

CMD ["npm","run","dev","--","--host"]
