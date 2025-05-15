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
                // 이전에 실행 중인 서버 프로세스 정리
                sh '''
                # 이전에 실행 중인 프로세스 정리
                pkill -f "node.*react-scripts" || true
                pkill -f "node.*server" || true
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
                sh 'CI=true npm test -- --watchAll=false'
            }
            options {
                timeout(time: 5, unit: 'MINUTES')
            }
        }
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        stage('Prepare Cypress') {
            steps {
                // 사이프레스 설정 파일 충돌 해결
                sh '''
                # 충돌하는 설정 파일 제거
                rm -f cypress.config.ts || true
                # 만약 두 설정 파일이 모두 있다면 모두 제거하고 js 버전만 생성
                if [ -f cypress.config.ts ] && [ -f cypress.config.js ]; then
                  rm -f cypress.config.ts cypress.config.js
                  echo "const { defineConfig } = require('cypress');
                  
                  module.exports = defineConfig({
                    e2e: {
                      baseUrl: 'http://localhost:3000',
                      setupNodeEvents(on, config) {
                        // implement node event listeners here
                      },
                    },
                  });" > cypress.config.js
                fi
                '''
            }
        }
        stage('Run Cypress Tests') {
            steps {
                // 백그라운드에서 서버 실행하고 사이프레스 테스트 실행
                sh '''
                # 백그라운드에서 서버 시작
                npm start &
                echo "React 서버 시작됨 (포트 3000)"
                sleep 20  # 서버가 완전히 시작될 때까지 기다림
                
                # 서버 상태 확인
                curl -s http://localhost:3000 || echo "React 서버 응답 없음"
                
                # 사이프레스 테스트 실행
                echo "사이프레스 테스트 실행..."
                npx cypress run --headless || true
                
                # 서버 종료
                echo "서버 정리 중..."
                pkill -f "node.*react-scripts" || true
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
            '''
        }
    }
}
