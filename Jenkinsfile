pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                // Jenkins에서 Git 저장소를 체크아웃
                git url: 'https://github.com/your-username/bookish.git', branch: 'main'
            }
        }
        stage('Install') {
            steps {
                // 리눅스 환경 가정. 윈도우라면 bat 'npm install'
                sh 'npm install'
            }
        }
        stage('Start') {
            steps {
                // 백그라운드(&)로 서버 실행
                sh 'npm start &'
                // 서버가 완전히 기동될 시간을 줌
                sh 'sleep 10'
            }
        }
    }
}
