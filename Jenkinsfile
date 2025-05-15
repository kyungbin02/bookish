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
                // 이전에 실행 중인 서버 프로세스 정리 - lsof 없이
                sh '''
                pkill -f "node.*react-scripts" || true
                pkill -f "node.*server" || true
                # 대체 방법으로 ps와 grep 사용
                ps aux | grep 'node' | grep -v grep | awk '{print $2}' | xargs -r kill -9 || true
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
        stage('Modify Server Config') {
            steps {
                // server.js 파일을 수정하여 환경변수에서 포트를 읽도록 수정
                sh '''
                # server.js에서 포트 설정 부분 수정
                sed -i 's/app.listen(8080/app.listen(process.env.PORT || 8080/g' server.js || true
                cat server.js | grep -n "app.listen" || true
                '''
            }
        }
        stage('Setup Cypress Config') {
            steps {
                // cypress.config.js 또는 비슷한 파일 확인
                sh '''
                mkdir -p cypress
                # Cypress 설정 파일이 있는지 확인
                if [ ! -f cypress.config.js ]; then
                  echo "Creating cypress.config.js with baseUrl..."
                  echo "export default { e2e: { baseUrl: 'http://localhost:3030' } }" > cypress.config.js
                else
                  # 기존 설정 파일 수정
                  sed -i 's|baseUrl:.*|baseUrl: \"http://localhost:3030\"|g' cypress.config.js || true
                fi
                cat cypress.config.js || true
                '''
            }
        }
        stage('Start and Run Cypress') {
            steps {
                // 백그라운드에서 서버 시작하고, 서버가 실행되기 전에 cypress가 실행되지 않도록 보장
                sh '''
                # 먼저 API 서버 시작 (8181 포트 사용)
                PORT=8181 npm run server &
                echo "API Server started on port 8181"
                sleep 15
                
                # React 앱 시작 (3030 포트 사용)
                PORT=3030 npm start &
                echo "React app started on port 3030"
                sleep 20
                
                # 서버 상태 확인
                echo "Checking server status..."
                curl -s http://localhost:3030 || echo "React server not responding"
                curl -s http://localhost:8181/books || echo "API server not responding"
                
                # Cypress 환경변수 설정
                export CYPRESS_baseUrl=http://localhost:3030
                export CYPRESS_API_URL=http://localhost:8181
                
                # Cypress 실행
                npx cypress run --headless --config baseUrl=http://localhost:3030
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
            # ps와 grep을 사용한 프로세스 정리
            ps aux | grep 'node' | grep -v grep | awk '{print $2}' | xargs -r kill -9 || true
            '''
        }
    }
}
