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
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        stage('Start Server (Background)') {
            steps {
                script {
                    // 백그라운드로 서버 실행 (React dev server or your start script)
                    sh "nohup npm start &"
                    // 잠깐 대기 (서버 뜰 때까지)
                    sleep 5
                }
            }
        }
        stage('Cypress Test') {
            steps {
                sh 'npx cypress run'
            }
        }
        // 필요하다면 여기서 서버를 종료할 수도 있고,
        // Docker 환경이면 파이프라인 끝나면 자동으로 컨테이너가 정리될 수도 있습니다.
    }
}
