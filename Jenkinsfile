pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/kyungbin02/bookish.git', branch: '07-the-book-detail-view'
            }
        }
        stage('Install & Start') {
            steps {
                script {
                    // 'node:16' 이미지를 사용하여, 해당 컨테이너 내부에서 npm 명령어를 실행합니다.
                    docker.image('node:16').inside {
                        sh 'npm install'
                        sh 'npm start &'
                        sh 'sleep 10'
                    }
                }
            }
        }
    }
}
