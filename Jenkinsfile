pipeline {
    agent any
    tools { nodejs 'NodeJS' }          // Jenkins > 관리 > Global Tool 에 등록한 이름

    stages {
        /* 1. 소스 */
        stage('Checkout') {
            steps {
                git url: 'https://github.com/kyungbin02/bookish.git',
                    branch: '07-the-book-detail-view'
            }
        }

        /* 2. 의존성 */
        stage('Install')  { steps { sh 'npm ci' } }

        /* 3. 단위 테스트 */
        stage('Unit Test') { steps { sh 'npm test' } }

        /* 4. Dev 서버 + Cypress */
        stage('Dev Servers & Cypress') {
            steps {
                sh '''
                    export JENKINS_NODE_COOKIE=dontKillMe

                    # ── dev 서버 3개 기동 ─────────────────────
                    nohup npm start                          > ui.log   2>&1 &
                    nohup npm run stub-server -- --port 4000 > stub.log 2>&1 &
                    nohup node server.js                     > api.log  2>&1 &

                    # ── 포트 3000·4000·8080 열릴 때까지 대기 ─
                    echo "⏳  waiting for dev servers…"
                    npx wait-on http://localhost:3000 http://localhost:4000 http://localhost:8080 --timeout 600000

                    # ── Cypress 실행 ─────────────────────────
                    echo "🚀  running cypress…"
                    npx cypress run
                '''
            }
        }

        /* 5. 프로덕션 빌드 */
        stage('Build') { steps { sh 'npm run build' } }
    }
}
