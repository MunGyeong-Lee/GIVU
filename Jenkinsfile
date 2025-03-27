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
        NETWORK = "givu_nginx-network"
        KAFKA_NETWORK = "kafka-network"
        COMPOSE_FILE = "/var/jenkins_home/workspace/givu/docker-compose.yml"
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

                
                
                // 1. 먼저 Spring Boot 빌드 시도
                dir('BE/givu') {
                    sh 'chmod +x gradlew'
                    sh './gradlew build --no-daemon'
                }
                // 2. 빌드 성공했을 때만 Docker 이미지 빌드
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
//        stage('Build Android') {
//            steps {
//                sh "docker build -t ${ANDROID_IMAGE} -f Android/GIVU/Dockerfile Android/GIVU"
                // temp-android 컨테이너를 일시적으로 생성
//                sh "docker create --name temp-android ${ANDROID_IMAGE}"
                //그 안에 있는 apk 파일을 꺼낸 뒤,
                // 절대경로: ~/jenkins-data/workspace/givu/apk-output
//                sh "docker cp temp-android:/app/app/build/outputs/apk/release ./apk-output"
                //컨테이너는 제거
//                sh "docker rm temp-android"
//            }
//        }
				
            
            stage('Deploy App (Blue-Green)') {
                steps {
                    script {
                        def nginxTemplatePath = "/home/ubuntu/nginx/nginx.template.conf"
                        def nginxConfPath = "/home/ubuntu/nginx/nginx.conf"

                        // ✅ 현재 살아있는 컨테이너 이름 확인
                        def backendActive = sh(script: "docker ps -a --format '{{.Names}}' | grep backend-v1 || true", returnStdout: true).trim()
                        def frontendActive = sh(script: "docker ps -a --format '{{.Names}}' | grep frontend-v1 || true", returnStdout: true).trim()

                        def backendNew = (backendActive == 'backend-v1') ? 'backend-v2' : 'backend-v1'
                        def frontendNew = (frontendActive == 'frontend-v1') ? 'frontend-v2' : 'frontend-v1'

                        def backendPort = (backendNew == 'backend-v1') ? '1115' : '1116'
                        def frontendPort = (frontendNew == 'frontend-v1') ? '3000' : '3001'

                        // ✅ 기존 컨테이너 제거 & 새 컨테이너 실행
                        sh """
                            docker rm -f ${backendNew} || true
                            docker run -d --name ${backendNew} \
                                --network ${NETWORK} \
                                -e PORT=8080 \
                                -p ${backendPort}:8080 \
                                ${SPRING_IMAGE}

                            docker rm -f ${frontendNew} || true
                            docker run -d --name ${frontendNew} \
                                --network ${NETWORK} \
                                -p ${frontendPort}:80 \
                                ${REACT_IMAGE}
                        """

                        sleep(5)

                        // ✅ nginx.conf 생성 (템플릿 -> 실제 conf)
                        sh """
                            sed -e 's|\\$\\{BACKEND\\}|${backendNew}|g' \
                                -e 's|\\$\\{FRONTEND\\}|${frontendNew}|g' \
                                ${nginxTemplatePath} > ${nginxConfPath}
                        """

                        // ✅ nginx가 없다면 run, 있으면 restart
                        def nginxExists = sh(script: "docker ps -a --format '{{.Names}}' | grep nginx || true", returnStdout: true).trim()
                        if (nginxExists == 'nginx') {
                            sh "docker restart nginx"
                        } else {
                            sh """
                                docker run -d --name nginx \
                                    --network ${NETWORK} \
                                    -p 80:80 \
                                    -v ${nginxConfPath}:/etc/nginx/nginx.conf:ro \
                                    nginx
                            """
                        }

                        // ✅ 이전 컨테이너 제거
                        sh """
                            docker stop ${backendActive} || true
                            docker rm ${backendActive} || true
                            docker stop ${frontendActive} || true
                            docker rm ${frontendActive} || true
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
