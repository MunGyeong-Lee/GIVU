# Android SDK + Gradle이 포함된 이미지 사용
FROM gradle:8.1.1-jdk17 AS build
WORKDIR /app
COPY . .

# Gradle 빌드를 실행하여 APK 생성
RUN chmod +x gradlew
RUN ./gradlew assembleRelease

# 최종적으로 빌드된 APK는 `/app/app/build/outputs/apk/release/` 경로에 생성됨.
