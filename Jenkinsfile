/*  ──────────────────────────────────────────────
 *  Jenkinsfile  ―  React + json-server + node API
 *  ────────────────────────────────────────────── */

pipeline {
    /* ───────── 공통 ───────── */
    agent any           // 아무 노드나

    tools {
        nodejs 'NodeJS' // Jenkins ▸ 관리 ▸ Global Tool Configuration 에 등록한 이름
    }

    /* ───────── 단계별 ─────── */
    stages {

        /* 1. Git 체크아웃 */
        stage('Checkout') {
            steps {
                git url: 'https://github.com/kyungbin02/bookish.git',
                    branch: '07-the-book-detail-view'
            }
        }

        /* 2. 의존성 설치 */
        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }

        /* 3. 단위 테스트 */
        stage('Unit Test') {
            steps {
                sh 'npm test'
            }
        }

        /* 4. Dev 서버 + Cypress */
        stage('Dev Servers & Cypress') {
            steps {
                sh '''
                    # Jenkins 가 백그라운드 프로세스를 안 죽이게
                    export JENKINS_NODE_COOKIE=dontKillMe

                    echo "🚀  Dev servers starting…"

                    ## ───────── 서버 3종 실행 ─────────
                    nohup npm start                          > ui.log   2>&1 &   # 3000
                    nohup npm run stub-server -- --port 4000 > stub.log 2>&1 &   # 4000
                    nohup node server.js                     > api.log  2>&1 &   # 8080

                    ## ───────── 세 포트가 다 뜰 때까지 대기 ─────────
                    npx wait-on http://localhost:3000 \
                                 http://localhost:4000 \
                                 http://localhost:8080 \
                                 --timeout 600000

                    echo "🧪  Cypress running…"
                    npx cypress run
                '''
            }
        }

        /* 5. 프로덕션 빌드 */
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
    }

    /* ─────── (선택) 빌드 후 정리 ─────── */
    post {
        always {
            echo '🔚  Cleaning up background servers…'
            sh 'pkill -f "react-scripts start"  || true'
            sh 'pkill -f "json-server"          || true'
            sh 'pkill -f "node server.js"       || true'
        }
    }
}