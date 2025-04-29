pipeline {
  agent any

  tools {
    nodejs 'NodeJS'
  }

  stages {
    stage('Checkout') {
      steps {
        git url: 'https://github.com/kyungbin02/bookish.git', branch: '07-the-book-detail-view'
      }
    }

    stage('Install') {
      steps {
        sh 'npm install'
      }
    }

    stage('Cypress Smoke Test') {
      steps {
        sh '''#!/usr/bin/env bash
          set -e

          # 0) 혹시 남은 프로세스가 있으면 모두 정리
          echo "🧹 Killing stale processes..."
          pkill -f "react-scripts start" || true
          pkill -f "json-server"         || true
          pkill -f "node server.js"      || true

          # 1) Dev 서버(UI + API + stub) 기동
          echo "🚀 Starting dev servers..."
          npm run dev &

          # 2) 3개 포트(3000,4000,8080)가 준비될 때까지 대기
          npx wait-on http://localhost:3000 \
                       http://localhost:4000 \
                       http://localhost:8080 \
                       --timeout 600000

          # 3) Cypress 실행
          echo "🧪 Running Cypress..."
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
