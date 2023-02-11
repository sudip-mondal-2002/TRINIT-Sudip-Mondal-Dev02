FROM node:18-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY prisma ./prisma/
COPY .env ./

RUN npx prisma migrate deploy
RUN npx prisma generate

COPY . .
RUN npm run build

CMD ["npm", "start"]