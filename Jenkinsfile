pipeline {
    agent any
    tools {
        nodejs 'NodeJS'            // Jenkins > 관리 > Global Tool Configuration 에서 등록한 이름
    }

    stages {

        /* 1. 소스 내려받기 */
        stage('Checkout') {
            steps {
                git url: 'https://github.com/kyungbin02/bookish.git',
                    branch: '07-the-book-detail-view'
            }
        }

        /* 2. 의존 설치 (devDependencies 포함, Cypress도 설치됨) */
        stage('Install') {
            steps {
                sh 'npm ci'         // lockfile 기반이라 install보다 빠르고 안정적
            }
        }

        /* 3. 단위 테스트 */
        stage('Unit Test') {
            steps {
                sh 'npm test'
            }
        }

        /* 4. 프런트 빌드 */
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        /* 5. dev-server 백그라운드 기동 */
        stage('Start Dev Server') {
            steps {
                sh '''
                    npm start -- --port 3000 &   # & 로 백그라운드 실행
                    echo $! > dev.pid           # PID 저장
                    npx wait-on http://localhost:3000   # 서버 뜰 때까지 대기
                '''
            }
        }

        /* 6. Cypress E2E 실행 (headless) */
        stage('Cypress Test') {
            steps {
                sh 'npx cypress run --config baseUrl=http://localhost:3000'
            }
        }
    }

    /* 7. 파이프라인 끝나면 dev-server 종료 */
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
