pipeline {
    agent any

    tools {
        nodejs 'NodeJS'          // Jenkins 관리 화면에 등록한 NodeJS 도구 이름
    }

    stages {

        /* 1. 소스 가져오기 -------------------------------------------------- */
        stage('Checkout') {
            steps {
                git url: 'https://github.com/kyungbin02/bookish.git',
                    branch: '07-the-book-detail-view'
            }
        }

        /* 2. 의존성 설치 ---------------------------------------------------- */
        stage('Install') {
            steps {
                sh 'npm ci'       // CI 환경에선 npm ci가 더 빠르고 재현성이 높음
            }
        }

        /* 3. 단위 테스트 ---------------------------------------------------- */
        stage('Unit Test') {
            steps {
                sh 'npm test'
            }
        }

        /* 4. Dev 서버 + Cypress ------------------------------------------- */
        stage('Dev Servers & Cypress') {
            steps {
                sh '''
                    # Jenkins 백그라운드 프로세스 살리기
                    export JENKINS_NODE_COOKIE=dontKillMe

                    # ── 서버 3종 실행 ──────────────────────────────────────
                    nohup npm start                          > ui.log   2>&1 &
                    nohup npm run stub-server -- --port 4000 > stub.log 2>&1 &
                    nohup node server.js                     > api.log  2>&1 &

                    # ── 세 포트(3000,4000,5000) 모두 뜰 때까지 대기 ─────
                    npx wait-on http://localhost:3000 \
                                 http://localhost:4000 \
                                 http://localhost:5000 \
                                 --timeout 600000

                    # ── E2E 테스트 실행 ──────────────────────────────────
                    npx cypress run
                '''
            }
        }

        /* 5. 프로덕션 빌드 -------------------------------------------------- */
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
    }
}
