FROM node:20.5.0

WORKDIR /app
COPY package*.json ./
RUN npm ci 

COPY . .
RUN npx prisma generate

RUN npm run build
EXPOSE 3000
CMD sh -c "npx prisma db push && npm run seed && npm start"
