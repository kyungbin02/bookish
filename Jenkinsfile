pipeline {
    agent any
    tools {
        nodejs 'NodeJS'
    }

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/kyungbin02/bookish.git',
                    branch: '07-the-book-detail-view'
            }
        }

        stage('Install') {
            steps { sh 'npm ci' }            // 패키지 설치
        }

        stage('Unit Test') {
            steps { sh 'npm test' }          // Jest·RTL
        }

        /* ───── 여기 추가 ───── */
        stage('Dev Servers') {               // UI + Stub + API
            steps {
                sh '''
                    export JENKINS_NODE_COOKIE=dontKillMe

                    # ➊ React(3000)  ➋ Stub-server(4000)  ➌ Node API(5000)
                    nohup npm start                   > ui.log   2>&1 &
                    nohup npm run stub-server -- --port 4000 > stub.log 2>&1 &
                    nohup node server.js              > api.log 2>&1 &

                    # 세 포트가 모두 뜰 때까지 대기
                    npx wait-on http://localhost:3000 http://localhost:4000 http://localhost:5000
                '''
            }
        }
        /* ──────────────────── */

        stage('Cypress Test') {
            steps { sh 'npx cypress run' }
        }

        stage('Build') {
            steps { sh 'npm run build' }
        }
    }
}
