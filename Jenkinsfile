pipeline {
    agent any               // 어디서나

    tools {                 // 관리 ▸ Global Tool Configuration
        nodejs 'NodeJS'     // 거기서 등록한 이름
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
                sh 'npm ci'          // 의존성 설치
            }
        }

        stage('Cypress') {      // Cypress 한 단계로 끝
            steps {
                sh 'npm run cy:run'
            }
        }
    }
}
