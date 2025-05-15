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
                // server.js 파일을 직접 수정
                sh '''
                # server.js 파일의 내용 확인
                cat server.js | grep -n "app.listen" || true
                
                # 임시 파일 생성 및 포트 관련 라인 직접 수정 - 명시적으로 PORT 환경변수 사용
                cat server.js > server.js.tmp
                rm server.js
                cat server.js.tmp | sed 's/app.listen(8080/app.listen(process.env.PORT || 8181/g' > server.js
                rm server.js.tmp
                
                # 수정 확인
                cat server.js | grep -n "app.listen" || true
                '''
            }
        }
        stage('Setup Cypress Config') {
            steps {
                // 사이프레스 설정 파일 처리
                sh '''
                # 기존 파일 정리
                rm -f cypress.config.ts cypress.config.js || true
                
                # 프로젝트 구조 확인
                ls -la cypress/ || true
                
                # 필요한 디렉토리 생성
                mkdir -p cypress/e2e
                
                # 새 설정 파일 생성
                echo "const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3030',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});" > cypress.config.js
                
                # 설정 확인
                cat cypress.config.js
                
                # 사이프레스 테스트 파일 확인 및 수정 - baseUrl 참조 문제 해결
                echo "Checking Cypress spec files..."
                find cypress/e2e -name "*.cy.ts" -o -name "*.cy.js" | xargs cat || true
                
                # bookish.spec.cy.ts 파일 확인 및 수정
                if [ -f cypress/e2e/bookish.spec.cy.ts ]; then
                  echo "Updating cypress/e2e/bookish.spec.cy.ts..."
                  cat cypress/e2e/bookish.spec.cy.ts > cypress/e2e/bookish.spec.cy.ts.tmp
                  cat cypress/e2e/bookish.spec.cy.ts.tmp | sed 's|cy.visit("http://localhost:3000")|cy.visit("/")|g' > cypress/e2e/bookish.spec.cy.ts
                  rm cypress/e2e/bookish.spec.cy.ts.tmp
                  echo "Updated spec file:"
                  cat cypress/e2e/bookish.spec.cy.ts
                fi
                '''
            }
        }
        stage('Start and Run Cypress') {
            steps {
                // 백그라운드에서 서버 시작하고, 사이프레스 테스트 실행
                sh '''
                # 포트 사용 중지 확인 - 더 확실하게
                echo "Killing any processes on ports 3030 and 8181..."
                # fuser를 사용할 수 없는 환경에서는 다른 방법으로
                ps aux | grep -E ':(3030|8181)' | grep -v grep | awk '{print $2}' | xargs -r kill -9 || true
                
                # API 서버 시작 (PORT 환경변수 확실히 적용) - 명시적으로 PORT 설정
                echo "Starting API server..."
                PORT=8181 node server.js &
                echo "API Server started on port 8181"
                sleep 10
                
                # React 앱 시작
                echo "Starting React app..."
                PORT=3030 npm start &
                echo "React app started on port 3030"
                sleep 15
                
                # 서버 상태 확인
                echo "Checking server status..."
                curl -s http://localhost:3030 || echo "React server not responding"
                curl -s http://localhost:8181/books || echo "API server not responding"
                
                # Cypress 실행 - 환경변수 명확하게 설정
                echo "Running Cypress tests..."
                CYPRESS_baseUrl=http://localhost:3030 npx cypress run --config baseUrl=http://localhost:3030 --headless
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
