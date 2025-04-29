pipeline {
    agent any

    tools {
        /* Jenkins > 관리 > Global Tool Configuration
           에서 지정해 둔 NodeJS 도구 이름 */
        nodejs 'NodeJS'
    }

    stages {

        /* 1 ─ 소스 받아오기 ------------------------------------------------ */
        stage('Checkout') {
            steps {
                git url: 'https://github.com/kyungbin02/bookish.git',
                    branch: '07-the-book-detail-view'
            }
        }

        /* 2 ─ 의존성 설치 -------------------------------------------------- */
        stage('Install') {
            steps {
                /* CI 환경은 npm ci 가 빠르고 재현성이 좋음 */
                sh 'npm ci'
            }
        }

        /* 3 ─ 단위 테스트 -------------------------------------------------- */
        stage('Unit Test') {
            steps {
                sh 'npm test'
            }
        }

        /* 4 ─ Dev 서버 3종 + Cypress -------------------------------------- */
        stage('Dev Servers & Cypress') {
            steps {
                sh '''
                    # 백그라운드 프로세스를 Jenkins가 종료하지 못하게
                    export JENKINS_NODE_COOKIE=dontKillMe

                    # ───────────── 서버 기동 ─────────────
                    # (1) React 프런트:   http://localhost:3000
                    nohup npm start > ui.log 2>&1 &

                    # (2) json-server Stub: http://localhost:4000
                    nohup npm run stub-server -- --port 4000 > stub.log 2>&1 &

                    # (3) 사용자 정의 API:  http://localhost:8080
                    nohup node server.js > api.log 2>&1 &

                    # ───────────── 준비 기다리기 ─────────
                    # 3000·4000·8080 세 포트가 모두 열릴 때까지
                    npx wait-on http://localhost:3000 \
                                 http://localhost:4000 \
                                 http://localhost:8080 \
                                 --timeout 600000

                    # ───────────── Cypress E2E ──────────
                    npx cypress run
                '''
            }
        }

        /* 5 ─ 프로덕션 빌드 ----------------------------------------------- */
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
    }
}
