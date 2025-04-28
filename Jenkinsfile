pipeline {
    agent any
    tools { nodejs 'NodeJS' }

    stages {
        stage('Checkout')   { steps { git url: 'https://github.com/kyungbin02/bookish.git', branch: '07-the-book-detail-view' } }
        stage('Install')    { steps { sh 'npm install' } }
        stage('Unit Test')  { steps { sh 'npm test'    } }
        stage('Build')      { steps { sh 'npm run build' } }

        /* dev-server 백그라운드 기동 */
        stage('Start') {
            steps {
                sh '''
                    npm start -- --port 3000 &   # & 붙여서 백그라운드
                    echo $! > dev.pid           # PID 저장
                    sleep 10                    # 서버 뜨는 시간
                '''
            }
        }

        /* Cypress E2E */
        stage('Cypress Test') {
            steps {
                sh 'npx cypress run --config baseUrl=http://localhost:3000'
            }
        }
    }

    /* 파이프라인 끝나면 dev-server 종료 */
    post {
        always {
            sh '''
                if [ -f dev.pid ]; then
                  kill $(cat dev.pid) || true
                fi
            '''
        }
    }
}
