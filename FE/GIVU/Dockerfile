# ────────────── Build Stage ──────────────
# Node.js 기반으로 React 빌드 수행
FROM node:18 AS build
WORKDIR /app
# package.json, package-lock.json 둘 다 있으면 복사
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ────────────── Run Stage ──────────────
# Nginx를 사용하여 정적 파일 서빙
FROM nginx:latest
WORKDIR /usr/share/nginx/html
COPY --from=build /app/build ./

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
