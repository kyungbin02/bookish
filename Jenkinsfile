pipeline {
    agent any
    tools {
        nodejs 'NodeJS'  // 관리화면에서 지정한 이름
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
                sh 'CI=true npm test -- --watchAll=false --maxWorkers=2 --testTimeout=10000'
            }
            options {
                timeout(time: 3, unit: 'MINUTES')
            }
        }
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        stage('Start Servers') {
            steps {
                sh 'npm start &'
                sh 'npm run server &'
                sh 'npx wait-on --timeout 60000 http://localhost:3000 http://localhost:8080'
            }
        }
        stage('Cypress') {
            steps {
                sh 'npx cypress run --headless'
            }
        }
    }
}
