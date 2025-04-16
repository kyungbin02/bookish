pipeline {
    agent any
    tools {
        nodejs 'NodeJS' 
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
        stage('Unit Test') {
            steps {
                sh 'npm test'
            }
        }
        stage('Cypress Test') {
            steps {
                sh 'npx cypress run'
            }
        }
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
