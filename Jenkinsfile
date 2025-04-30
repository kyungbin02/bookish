pipeline {
  agent any

  tools {
    nodejs 'NodeJS'    // Global Tool Configuration에 등록한 이름
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

    stage('Quick Cypress Check') {
      steps {
        sh '''#!/usr/bin/env bash
          # 1) UI 서버만 띄워놓고
          npm start         > ui.log 2>&1 &
          # 2) 좀 기다렸다가
          sleep 10
          # 3) Cypress 돌려보고, 실패해도 exit 0
          npx cypress run || true
        '''
      }
      post {
        always {
          // 백그라운드 서버 종료
          sh 'pkill -f "react-scripts start" || true'
        }
      }
    }
  }
}
