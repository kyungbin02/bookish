pipeline {
    agent any
    tools {
        nodejs 'NodeJS'  // Global Tool Configuration에서 등록한 NodeJS 이름
    }
    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/kyungbin02/bookish.git', branch: '07-the-book-detail-view'
            }
        }
        stage('Install') {
            steps {
                sh 'npm install'
            }
        }
        stage('Cypress Test') {
            steps {
                sh 'npx cypress run'
            }
        }
    }
}
