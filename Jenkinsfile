pipeline {
    agent any

    /* Jenkins → 관리 → Global Tool Configuration 에서
       NodeJS 도구 이름을 ‘NodeJS’ 로 등록해 두었다고 가정 */
    tools {
        nodejs 'NodeJS'
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
                sh 'npm ci'        // CI 환경 = npm ci 가 더 빠르고 재현성↑
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
                    # Jenkins 가 백그라운드 프로세스를 죽이지 않도록
                    export JENKINS_NODE_COOKIE=dontKillMe

                    echo "🚀  starting dev servers…"

                    # ── 1) 서버 3종 실행 ───────────────────────────────
                    nohup npm start                          > ui.log   2>&1 &
                    nohup npm run stub-server -- --port 4000 > stub.log 2>&1 &
                    nohup node server.js                     > api.log  2>&1 &

                    # ── 2) 세 포트(3000, 4000, 8080) 모두 뜰 때까지 대기
                    npx wait-on http://localhost:3000 \
                                 http://localhost:4000 \
                                 http://localhost:8080 \
                                 --timeout 600000

                    # ── 3) E2E 테스트 실행 ────────────────────────────
                    echo "🧪  Cypress running…"
                    npx cypress run
                '''
            }

            /* 실패‧성공과 무관하게 백그라운드 서버 정리 */
            post {
                always {
                    echo '🔚  Cleaning up background servers…'
                    sh '''
                        pkill -f "react-scripts start" || true
                        pkill -f "json-server"         || true
                        pkill -f "node server.js"      || true
                    '''
                }
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
