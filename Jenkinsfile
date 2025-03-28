pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    // CI 환경에서 npm start가 대화형 입력 없이 실행되도록 설정
    environment {
        CI = 'true'
        BROWSER = 'none'
    }

    stages {
        stage("Checkout") {
            steps {
                git url: 'https://github.com/kyungbin02/bookish.git', branch: '07-the-book-detail-view'
            }
        }
        stage("Install") {
            steps {
                sh 'npm ci'
            }
        }
        stage("Build Production") {
            steps {
                // Production 빌드가 필요하지 않다면 이 단계는 생략 가능
                sh 'npm run build'
            }
        }
        stage("Start & Test") {
            steps {
                script {
                    // 백그라운드에서 npm start 실행. JENKINS_NODE_COOKIE는 프로세스 종료를 방지함.
                    sh '''
                        export JENKINS_NODE_COOKIE=dontKillMe
                        nohup npm start > devserver.log 2>&1 &
                    '''
                    // 최대 120초 동안 매 1초마다 서버가 기동했는지 확인하는 폴링 루프
                    sh '''
                        echo "Waiting for server on port 3000..."
                        for i in {1..120}; do
                          if curl -sf http://localhost:3000 > /dev/null; then
                            echo "Server is up!"
                            exit 0
                          fi
                          sleep 1
                        done
                        echo "Server did not start in time."
                        exit 1
                    '''
                    // 최종적으로 curl로 접속 테스트
                    sh 'curl --fail http://localhost:3000'
                }
            }
        }
    }

    post {
        always {
            // 빌드 후 백그라운드 npm start 프로세스 종료
            sh 'pkill -f "npm start" || true'
        }
    }
}
