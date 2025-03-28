pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
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
                sh 'npm run build'
            }
        }
        stage("Start & Test") {
            steps {
                script {
                    // Jenkins가 백그라운드 프로세스를 kill하지 않도록 환경 변수 설정
                    sh '''
                        export JENKINS_NODE_COOKIE=dontKillMe
                        nohup npx serve -s build -l 3000 > devserver.log 2>&1 &
                    '''
                    // 서버가 기동될 때까지 최대 60초 동안 폴링 (매 1초 시도)
                    sh '''
                        echo "Waiting for server on port 3000..."
                        for i in {1..60}; do
                          if curl -sf http://localhost:3000 > /dev/null; then
                            echo "Server is up!"
                            exit 0
                          fi
                          sleep 1
                        done
                        echo "Server did not start in time."
                        exit 1
                    '''
                    // 최종적으로 3000번 포트에 접속해서 성공 여부 확인
                    sh 'curl --fail http://localhost:3000'
                }
            }
        }
    }

    post {
        always {
            // 빌드 후 백그라운드 서버 프로세스 종료
            sh 'pkill -f "serve -s build" || true'
        }
    }
}
