pipeline {
  agent any

  tools {
    nodejs 'NodeJS'  // Global Tool Configuration 에 등록한 이름
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
        // lock‐file 싱크 문제 피하려면 그냥 install
        sh 'npm install'
      }
    }

    stage('Cypress Smoke Test') {
      steps {
        sh '''#!/bin/bash
          set -e

          # 1) dev 서버(UI + API + stub) 모두 띄우기
          npm run dev &

          # 2) 3개 포트(3000,4000,8080)가 살아날 때까지 최대 10분 대기
          npx wait-on http://localhost:3000 \
                       http://localhost:4000 \
                       http://localhost:8080 \
                       --timeout 600000

          # 3) 준비되면 Cypress 실행
          npx cypress run
        '''
      }
      post {
        always {
          echo '🔚  Cleaning up background servers…'
          sh '''
            pkill -f "react-scripts start" || true
            pkill -f "json-server"         || true
            pkill -f "node server.js"      || true
          '''
        }
      }
    }
  }
}
