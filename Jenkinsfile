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
            steps {
                sh 'npm install'
            }
        }

        stage('Unit Test') {
            steps {
                sh 'npm test'
            }
        }

        /* ─────────── 여기부터 수정 ─────────── */
        stage('Cypress Test') {
            steps {
                sh '''
                    # Jenkins가 백그라운드 프로세스를 죽이지 않도록 설정
                    export JENKINS_NODE_COOKIE=dontKillMe

                    # 서버 실행 (백그라운드)
                    nohup npm start > devserver.log 2>&1 &

                    # 서버가 뜰 때까지 기다렸다가 테스트 실행
                    npx wait-on http://localhost:3000
                    npx cypress run
                '''
            }
        }
        /* ─────────── 여기까지 ─────────── */

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
    }
}
