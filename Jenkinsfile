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
                // 프로덕션 빌드
                sh 'npm run build'
            }
        }
        stage("Start Prod") {
            steps {
                // 정적 서버로 배포 (포트 3000)
                sh 'nohup npx serve -s build -l 3000 > bookish.log 2>&1 &'
                // 서버가 뜨는 데 걸리는 시간 (10~15초 정도면 충분)
                sleep 10
                // 로그 확인
                sh 'cat bookish.log'
            }
        }
        stage("Smoke Test") {
            steps {
                // 3000번 포트에서 페이지를 잘 내려주는지 확인 (200 응답이 아니면 실패)
                sh 'curl --fail http://localhost:3000'
            }
        }
    }

    post {
        always {
            // 서버 프로세스 종료
            sh 'pkill -f "serve -s build" || true'
        }
    }
}
