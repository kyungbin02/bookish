pipeline {
  agent any

  tools {
    // Global Tool Configuration 에서 등록한 NodeJS 이름
    nodejs 'NodeJS'
  }

  stages {
    stage('Checkout') {
      steps {
        // 본인의 브랜치명으로 변경 가능
        git url: 'https://github.com/kyungbin02/bookish.git',
            branch: '07-the-book-detail-view'
      }
    }

    stage('Install') {
      steps {
        // package-lock.json 동기화 문제가 있을 땐 'npm install' 로 변경해도 무방합니다.
        sh 'npm install'
      }
    }

    stage('Smoke Test') {
      steps {
        sh '''#!/usr/bin/env bash
          set -e

          echo "🧹 Killing any stale servers..."
          pkill -f "react-scripts start" || true

          echo "🚀 Starting application..."
          # UI 서버만 띄우도록 변경 (API나 stub가 필요 없다면 제거하세요)
          nohup npm start > ui.log 2>&1 &

          echo "⏳ Waiting for http://localhost:3000 ..."
          npx wait-on http://localhost:3000 --timeout 120000

          echo "🧪 Running Cypress smoke tests..."
          npx cypress run --headless

          echo "✅ Smoke tests passed!"
        '''
      }

      post {
        always {
          echo "🔚 Cleaning up servers..."
          sh '''
            pkill -f "react-scripts start" || true
          '''
        }
      }
    }
  }
}
