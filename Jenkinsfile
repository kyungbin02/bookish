pipeline {
    agent any  // 노드 아무곳이나, Node.js가 설치된 곳에서 빌드
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
                // 빌드 스크립트가 있으면 (예: React, Vue, Angular 등)
                sh 'npm run build'
            }
        }
        stage('Start') {
            steps {
                // 단순 서버 실행 확인이라면 이렇게
                sh 'npm start'
            }
        }
    }
}
