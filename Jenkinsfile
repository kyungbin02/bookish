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
                // package-lock.json 싱크 에러 무시하고 그냥 install
                sh 'npm install'
            }
        }
        stage('Cypress') {
            steps {
                sh 'npm run cy:run'
            }
        }
    }
}
