FROM node:18-alpine AS builder

RUN mkdir /app
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/site.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80 

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
