pipeline {
    agent any
    tools {
        nodejs 'NodeJS'          // Jenkins 관리 화면에서 등록한 이름
    }

    environment {
        DEV_PORT = '3000'
        BASE_URL = "http://localhost:${DEV_PORT}"
    }

    stages {
        /* 1) 소스 체크아웃 ------------------------------------------------------ */
        stage('Checkout') {
            steps {
                git url: 'https://github.com/kyungbin02/bookish.git',
                    branch: '07-the-book-detail-view'
            }
        }

        /* 2) 의존성 설치 ------------------------------------------------------- */
        stage('Install') {
            steps {
                sh 'npm ci'        // 설치만, lock-file 기준
            }
        }

        /* 3) 단위 테스트 ------------------------------------------------------- */
        stage('Unit Test') {
            steps {
                sh 'npm test'
            }
        }

        /* 4) **개발 서버 기동**(백그라운드) ----------------------------------- */
        stage('Start') {
            steps {
                sh '''
                    npm start -- --port ${DEV_PORT} &   # CRA dev-server 실행
                    echo $! > .devserver.pid           # PID 저장
                    npx wait-on ${BASE_URL}            # 포트 열릴 때까지 대기
                '''
            }
        }

        /* 5) E2E(Cypress) 테스트 ---------------------------------------------- */
        stage('Cypress Test') {
            steps {
                sh 'npx cypress run --config baseUrl=${BASE_URL}'
            }
        }

        /* 6) 프로덕션 빌드 ----------------------------------------------------- */
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
    }

    /* 파이프라인 끝날 때 dev-server 정리 --------------------------------------- */
    post {
        always {
            sh '''
                if [ -f .devserver.pid ]; then
                    kill $(cat .devserver.pid) || true
                fi
            '''
        }
    }
}
