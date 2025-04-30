pipeline {
  agent any
  tools {
    nodejs 'NodeJS'    // Global Tool Configuration 에 등록하신 NodeJS 이름
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
        sh 'npm install'
      }
    }

    stage('Smoke Test') {
      steps {
        // Cypress 테스트 단계가 실패해도 전체 빌드는 깨지지 않도록
        catchError(buildResult: 'UNSTABLE', stageResult: 'UNSTABLE') {
          sh '''#!/usr/bin/env bash
            set -e

            echo "🧹 Killing any stale servers..."
            pkill -f "react-scripts start"  || true
            pkill -f "json-server"          || true
            pkill -f "node server.js"       || true

            echo "🚀 Starting UI, API, Stub servers..."
            nohup npm start        > ui.log   2>&1 &
            nohup npm run server   > api.log  2>&1 &
            nohup npm run stub-server > stub.log 2>&1 &

            echo "⏳ Waiting for ports 3000, 4000, 8080..."
            npx wait-on http://localhost:3000 \
                         http://localhost:4000 \
                         http://localhost:8080 \
                         --timeout 120000

            echo "🧪 Running Cypress smoke tests..."
            npx cypress run --headless
          '''
        }
      }
      post {
        always {
          echo "🔚 Cleaning up servers..."
          sh '''
            pkill -f "react-scripts start"  || true
            pkill -f "json-server"          || true
            pkill -f "node server.js"       || true
          '''
        }
      }
    }
  }
  post {
    always {
      // 빌드 결과를 설명에 남겨두기
      script { currentBuild.description = "Status: ${currentBuild.currentResult}" }
    }
  }
}
