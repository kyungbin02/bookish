pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    stages {
        stage("Checkout") {
            steps {
                git url: 'https://github.com/kyungbin02/bookish-react.git', branch: 'master'
            }
        }
        stage("Install") {
            steps {
                sh 'npm ci'
            }
        }
        stage("Start App") {
            steps {
                sh 'nohup npm start > bookish.log 2>&1 &'
                sleep 15
                sh 'cat bookish.log'
            }
        }
        stage("Smoke Test") {
            steps {
                sh 'curl --fail http://localhost:3000'
            }
        }
    }

    post {
        always {
            sh 'pkill -f "npm start" || true'
        }
    }
}
