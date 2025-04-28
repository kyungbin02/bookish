pipeline {
    agent any
    tools { nodejs 'NodeJS' }

    stages {
        /* 1. 소스 내려받기 */
        stage('Checkout') {
            steps {
                git url: 'https://github.com/kyungbin02/bookish.git', branch: '07-the-book-detail-view'
            }
        }

        /* 2. 의존 설치 */
        stage('Install') {
            steps { sh 'npm ci' }      // install 대신 ci, 더 빠름
        }

        /* 3. 단위 테스트 */
        stage('Unit Test') {
            steps { sh 'npm test' }
        }

        /* 4. 프런트 빌드 */
        stage('Build') {
            steps { sh 'npm run build' }
        }

        /* 5. dev-server 켜 두기 (백그라운드) */
        stage('Start Dev Server') {
            steps {
                sh '''
                    npm start -- --port 3000 &   # & ← 핵심!
                    echo $! > dev.pid           # PID 저장
                    sleep 10                    # 10초 대기
                '''
            }
        }

        /* 6. Cypress E2E */
        stage('Cypress Test') {
            steps {
                sh 'npx cypress run --config baseUrl=http://localhost:3000'
            }
        }
    }

    /* 7. 파이프라인이 끝나면 서버 종료 */
    post {
        always {
            sh '''
                [ -f dev.pid ] && kill $(cat dev.pid) || true
            '''
        }
    }
}
