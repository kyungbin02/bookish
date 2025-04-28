pipeline {
    agent any
    tools { nodejs 'NodeJS' }             // Jenkins > Global Tool Configuration 에서 등록한 이름

    stages {
        /* 1. 소스 */
        stage('Checkout') {
            steps {
                git url: 'https://github.com/kyungbin02/bookish.git',
                    branch: '07-the-book-detail-view'
            }
        }

        /* 2. 의존 설치 – 진행바 켜기 */
        stage('Install') {
            steps {
                sh 'npm ci --progress=true --loglevel=info'
            }
        }

        /* 3. 단위 테스트 */
        stage('Unit Test') {
            steps {
                sh 'npm test --watchAll=false'
            }
        }

        /* 4. 빌드 */
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        /* 5. JSON-stub 서버 (4000) */
        stage('Start Stub') {
            steps {
                sh '''
                    npm run stub-server -- --port 4000 &
                    echo $! > stub.pid
                    npx wait-on http://localhost:4000/books
                '''
            }
        }

        /* 6. 프런트 dev-server (3000) */
        stage('Start Front') {
            steps {
                sh '''
                    REACT_APP_API_URL=http://localhost:4000 npm start -- --port 3000 &
                    echo $! > front.pid
                    npx wait-on http://localhost:3000
                '''
            }
        }

        /* 7. Cypress E2E */
        stage('Cypress Test') {
            steps {
                sh 'npx cypress run --config baseUrl=http://localhost:3000'
            }
        }
    }

    /* 8. 언제나 두 서버 종료 */
    post {
        always {
            sh '''
                [ -f front.pid ] && kill $(cat front.pid) || true
                [ -f stub.pid  ] && kill $(cat stub.pid)  || true
            '''
        }
    }
}
