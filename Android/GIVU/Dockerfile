# 안드로이드 SDK 설치 기반 이미지
FROM gradle:8.1.1-jdk17

# 환경변수 설정 (SDK 설치 위치 지정)
ENV ANDROID_HOME=/opt/android-sdk
ENV PATH=${PATH}:${ANDROID_HOME}/cmdline-tools/latest/bin:${ANDROID_HOME}/platform-tools

# SDK 디렉토리 생성
RUN mkdir -p ${ANDROID_HOME}/cmdline-tools

# Command Line Tools 다운로드 및 압축 해제
RUN curl -o cmdline-tools.zip https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip && \
    unzip cmdline-tools.zip -d ${ANDROID_HOME}/cmdline-tools && \
    mv ${ANDROID_HOME}/cmdline-tools/cmdline-tools ${ANDROID_HOME}/cmdline-tools/latest && \
    rm cmdline-tools.zip

# 필요한 SDK 패키지 설치
RUN yes | sdkmanager --sdk_root=${ANDROID_HOME} \
    "platform-tools" \
    "platforms;android-34" \
    "build-tools;34.0.0"

# 프로젝트 복사 및 작업 디렉토리 설정
WORKDIR /app
COPY . .

# local.properties 생성 (Gradle이 SDK 경로 알 수 있도록)
RUN echo "sdk.dir=$ANDROID_HOME" > local.properties

# Gradle로 릴리즈 빌드
RUN chmod +x gradlew
RUN ./gradlew assembleRelease
