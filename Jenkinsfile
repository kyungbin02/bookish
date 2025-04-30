pipeline {
    agent any
    tools {
        nodejs 'NodeJS'  // 관리 화면에서 지정한 이름
    }
    stages {
        stage("Checkout") {
            steps {
                git url: 'https://github.com/kyungbin02/bookish.git', branch: '07-the-book-detail-view'
            }
        }
        stage('Install') {
            steps {
                sh 'npm install'
            }
        }
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        stage('Start Server') {
            steps {
                sh 'nohup npm start > server.log 2>&1 &'
                sh 'sleep 20'
            }
        }
        stage('Cypress Test') {
            steps {
                sh 'npx cypress run'
            }
        }
    }
}
