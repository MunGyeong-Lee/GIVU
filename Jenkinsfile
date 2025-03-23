pipeline {
    agent any

    options {
        skipDefaultCheckout(true) // ✅ Jenkins 기본 checkout 비활성화
    }


		
		// 환경 변수 정의
    environment {
        SPRING_IMAGE = "my-spring-app"
        REACT_IMAGE = "my-react-app"
        ANDROID_IMAGE = "my-android-app"
        NETWORK = "nginx-network"
        KAFKA_NETWORK = "kafka-network"
        COMPOSE_FILE = "docker-compose.yml"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm // ✅ 반드시 필요!
            }
        }

		// 스프링 부트 서버 코드를 도커 이미지로 빌드(repo에 있는 스프링부트 dockerfile 가지고!)
        stage('Build Spring Boot') {
            steps {
                sh "docker build -t ${SPRING_IMAGE} -f BE/givu/Dockerfile BE/givu"
            }
        }
				
				// 리엑트 코드를 도커 이미지로 빌드(repo에 있는 리엑트 dockerfile 가지고!)
        stage('Build React') {
            steps {
                sh "docker build -t ${REACT_IMAGE} -f FE/GIVU/Dockerfile FE/GIVU"
            }
        }

				// 안드로이드 코드를 도커 이미지로 빌드(repo에 있는 안드로이드 dockerfile 가지고!)
        stage('Build Android') {
            steps {
                sh "docker build -t ${ANDROID_IMAGE} -f Android/GIVU/Dockerfile Android/GIVU"
                // temp-android 컨테이너를 일시적으로 생성
                sh "docker create --name temp-android ${ANDROID_IMAGE}"
                //그 안에 있는 apk 파일을 꺼낸 뒤,
                // 절대경로: ~/jenkins-data/workspace/givu/apk-output
                sh "docker cp temp-android:/app/app/build/outputs/apk/release ./apk-output"
                //컨테이너는 제거
                sh "docker rm temp-android"
            }
        }
				
				// 백엔드 무중단 배포
        stage('Deploy Backend (Blue-Green)') {
            steps {
                script {
	                  // 현재 실행 중인 백엔드 컨테이너가 backend-v1인지 확인
                    def active = sh(script: "docker ps --format '{{.Names}}' | grep backend-v1 || true", returnStdout: true).trim()
                    // 새로 띄울 컨테이너를 backend-v2 또는 backend-v1로 결정
                    def newContainer = (active == 'backend-v1') ? 'backend-v2' : 'backend-v1'
                    // 새 포트(1115 or 1116)로 실행
                    def newPort = (newContainer == 'backend-v1') ? '1115' : '1116'

                    sh """
                        docker run -d --name ${newContainer} \
                            --network ${NETWORK} \
                            -e PORT=8080 \
                            -p ${newPort}:8080 \
                            ${SPRING_IMAGE}

                        sleep 5
                        sed -i 's/${active}/${newContainer}/g' ./nginx/nginx.conf || true
                        docker restart nginx

                        docker stop ${active} || true
                        docker rm ${active} || true
                    """
                }
            }
        }
				
				// 프론트 무중단 배포
        stage('Deploy Frontend (Blue-Green)') {
            steps {
                script {
                    def active = sh(script: "docker ps --format '{{.Names}}' | grep frontend-v1 || true", returnStdout: true).trim()
                    def newContainer = (active == 'frontend-v1') ? 'frontend-v2' : 'frontend-v1'

                    sh """
                        docker run -d --name ${newContainer} \
                            --network ${NETWORK} \
                            -p 3000:80 \
                            ${REACT_IMAGE}

                        sleep 3
                        sed -i 's/${active}/${newContainer}/g' ./nginx/nginx.conf || true
                        docker restart nginx

                        docker stop ${active} || true
                        docker rm ${active} || true
                    """
                }
            }
        }
				
				// zookeeper kafka kafka-ui postgres redis 서비스를 생성하고 실행
				// 일단 zookeeper kafka kafka-ui 는 뺀 상태
        stage('Start Infra Services') {
            steps {
                sh "docker-compose -f ${COMPOSE_FILE} up -d postgres redis"
            }
        }
    } // stages 닫기
} // pipeline 닫기
