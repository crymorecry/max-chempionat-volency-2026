FROM node:22-bookworm-slim

WORKDIR /app
COPY . .
RUN npm i --save
RUN npm run build
EXPOSE 3000
CMD sh -c "npx prisma db push && npm run seed && npm start"