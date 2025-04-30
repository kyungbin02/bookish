pipeline {
    agent any
    tools {
        nodejs 'NodeJS'
    }
    stages {
        stage("Checkout") {
            steps {
                git url: 'https://github.com/kyungbin02/bookish.git',
                    branch: '07-the-book-detail-view'
            }
        }
        stage("Install") {
            steps {
                sh 'npm install'
            }
        }
        stage("Test") {
            steps {
                sh 'npm test'
            }
        }
        stage("Build Frontend") {
            steps {
                sh 'npm run build'
            }
        }
        stage("Start Backend (json-server)") {
            steps {
                // 루트의 db.json 을 API 서버로 실행
                sh 'nohup npx json-server --watch db.json --port 8080 > json-server.log 2>&1 &'
                sh 'sleep 10'
            }
        }
        stage("Start Frontend") {
            steps {
                sh 'nohup npm start > server.log 2>&1 &'
                sh 'sleep 15'
            }
        }
        stage("Cypress Test") {
            steps {
                sh 'npx cypress run'
            }
        }
    }
}
