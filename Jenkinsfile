pipeline {
    agent any
    tools {
        nodejs 'NodeJS'  // 관리화면에서 지정한 이름
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
        stage('Test') {
            steps {
                sh 'CI=true npm test -- --watchAll=false --runInBand --testTimeout=30000 --passWithNoTests'
            }
            options {
                timeout(time: 10, unit: 'MINUTES')
            }
        }
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        stage('Start and Run Cypress') {
            steps {
                // 백그라운드에서 서버 시작하고, 서버가 실행되기 전에 cypress가 실행되지 않도록 보장
                sh '''
                npm start &
                npm run server &
                sleep 20
                npx cypress run --headless
                '''
            }
            options {
                timeout(time: 5, unit: 'MINUTES')
            }
        }
    }
    post {
        always {
            // 백그라운드로 실행된 프로세스 정리
            sh 'pkill -f "node.*react-scripts" || true'
            sh 'pkill -f "node.*server" || true'
        }
    }
}
