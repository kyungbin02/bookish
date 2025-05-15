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
        stage('Clean Environment') {
            steps {
                // 이전에 실행 중인 서버 프로세스 정리 - 더 철저하게
                sh '''
                pkill -f "node.*react-scripts" || true
                pkill -f "node.*server" || true
                lsof -ti:3000 | xargs kill -9 || true
                lsof -ti:8080 | xargs kill -9 || true
                '''
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
                # 먼저 API 서버 시작 (다른 포트 사용)
                PORT=8181 npm run server & 
                echo "API Server started on port 8181"
                sleep 15
                
                # React 앱 시작
                PORT=3030 npm start &
                echo "React app started on port 3030"
                sleep 20
                
                # Cypress 환경변수 설정으로 API 서버 포트 지정
                CYPRESS_API_URL=http://localhost:8181 npx cypress run --headless
                '''
            }
            options {
                timeout(time: 10, unit: 'MINUTES')
            }
        }
    }
    post {
        always {
            // 백그라운드로 실행된 프로세스 정리
            sh '''
            pkill -f "node.*react-scripts" || true
            pkill -f "node.*server" || true
            lsof -ti:3030 | xargs kill -9 || true
            lsof -ti:8181 | xargs kill -9 || true
            '''
        }
    }
}
