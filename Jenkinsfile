pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
    }

    environment {
        SPRING_IMAGE = "my-spring-app"
        REACT_IMAGE = "my-react-app"
        ANDROID_IMAGE = "my-android-app"
        NETWORK = "givu_nginx-network"
        KAFKA_NETWORK = "kafka-network"
        COMPOSE_FILE = "/var/jenkins_home/workspace/givu/docker-compose.yml"
        SPRINGBOOT_PORT = credentials('Springboot-Port')
    }

    stages {


        stage('Checkout') {
            steps {
                checkout scm
            }
        }

                stage('Start Infra Services') {
            steps {
                sh "docker-compose -f ${COMPOSE_FILE} up -d postgres redis"
            }
        }

        stage('Build Spring Boot') {
            steps {
                dir('BE/givu') {
                    sh 'chmod +x gradlew'
                    sh './gradlew build -Dspring.profiles.active=test --no-daemon'
                }
                sh "docker build -t ${SPRING_IMAGE} -f BE/givu/Dockerfile BE/givu"
            }
        }

        stage('Build React') {
    steps {
        withCredentials([string(credentialsId:'REACT_ENV', variable: 'REACT_ENV_CONTENT')]) {
            writeFile file: 'FE/GIVU/.env', text: REACT_ENV_CONTENT

            // 🔍 .env 파일 확인 로그 추가
            sh "echo '------ .env preview ------'"
            sh "cat FE/GIVU/.env"
            sh "echo '---------------------------'"
        }

        sh "docker build -t ${REACT_IMAGE} -f FE/GIVU/Dockerfile FE/GIVU"
    }
}

        stage('Deploy App (Blue-Green)') {
            steps {
                script {
                    def nginxTemplatePath = "/home/ubuntu/nginx/nginx.template.conf"
                    def nginxConfPath = "/home/ubuntu/nginx/nginx.conf"

                    def backendNew = 'backend-v1'
                    def frontendNew = 'frontend-v1'

                    // 살아있는 게 v1인지 v2인지 확인해서 교체할 쪽으로 선택
                    if (sh(script: "docker ps --format '{{.Names}}' | grep backend-v1 || true", returnStdout: true).trim() == 'backend-v1') {
                        backendNew = 'backend-v2'
                    }
                    if (sh(script: "docker ps --format '{{.Names}}' | grep frontend-v1 || true", returnStdout: true).trim() == 'frontend-v1') {
                        frontendNew = 'frontend-v2'
                    }


                    def backendPort = (backendNew == 'backend-v1') ? '1115' : '1116'
                    def frontendPort = (frontendNew == 'frontend-v1') ? '3000' : '3001'
                    // 이걸 기준으로 구버전 컨테이너 명확히 계산
                    def backendOld = (backendNew == 'backend-v1') ? 'backend-v2' : 'backend-v1'
                    def frontendOld = (frontendNew == 'frontend-v1') ? 'frontend-v2' : 'frontend-v1'

                    // 새 컨테이너 실행
                    sh """
                        docker rm -f ${backendNew} || true
                        docker run -d --name ${backendNew} \
                            --network ${NETWORK} \
                            -e PORT=${SPRINGBOOT_PORT} \
                            -v /etc/localtime:/etc/localtime:ro \
                            -v /etc/timezone:/etc/timezone:ro \
                            -p ${backendPort}:8080 \
                            ${SPRING_IMAGE}

                        docker rm -f ${frontendNew} || true
                        docker run -d --name ${frontendNew} \
                            --network ${NETWORK} \
                            -p ${frontendPort}:80 \
                            ${REACT_IMAGE}
                    """

                    sleep time: 5, unit: 'SECONDS'

                    // nginx.conf 생성
                    def sedCommand = """
                        sed -e 's|\\\${BACKEND}|${backendNew}|g' \\
                            -e 's|\\\${FRONTEND}|${frontendNew}|g' \\
                            ${nginxTemplatePath} > ${nginxConfPath}
                    """
                    sh script: sedCommand
                    
                    def nginxExists = sh(script: "docker ps -a --format '{{.Names}}' | grep nginx || true", returnStdout: true).trim()

                    def restartScript = """
                    if [ "${nginxExists}" = "nginx" ]; then
                        docker restart nginx
                    else
                        docker run -d --name nginx \\
                            --network ${NETWORK} \\
                            -p 80:80 \\
                            -v ${nginxConfPath}:/etc/nginx/nginx.conf:ro \\
                            nginx
                    fi
                    """

                    sh script: restartScript

                    // 이전 컨테이너 제거
                    // nginx 재시작 후 이전 것 제거
                    sh """
                        docker stop ${backendOld} || true
                        docker rm ${backendOld} || true
                        docker stop ${frontendOld} || true
                        docker rm ${frontendOld} || true
                    """
                    
                }
            }
        }
    }
}
