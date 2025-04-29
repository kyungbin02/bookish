pipeline {
    agent any
    tools {
        nodejs 'NodeJS'          // Jenkins 관리 화면에서 등록한 NodeJS 도구 이름
    }

    stages {
        stage("Checkout") {
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

        stage('Test') {          // Jest 등 단위 테스트
            steps {
                sh 'npm test'
            }
        }

        /* ──────── 추가 ──────── */
        stage('Cypress Test') {  // E2E 테스트
            steps {
                sh 'npx cypress run'
            }
        }
        /* ────────────────────── */

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Start') {
            steps {
                sh 'npm start'
            }
        }
    }
}
