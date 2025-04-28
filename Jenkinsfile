pipeline {
    agent any
    tools { nodejs 'NodeJS' }

    environment {
        BASE_PORT = '3000'
        API_PORT  = '4000'
        CYPRESS_baseUrl = "http://localhost:$BASE_PORT"
    }

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/kyungbin02/bookish.git',
                    branch: '07-the-book-detail-view'
            }
        }

        stage('Install')  { steps { sh 'npm ci --loglevel warn' } }
        stage('Unit Test'){ steps { sh 'npm test -- --watchAll=false' } }
        stage('Build')    { steps { sh 'npm run build' } }

        stage('Start static server (+ mock-api)') {
            steps {
                sh '''#!/bin/bash
                  # 프런트 정적 서버
                  npx serve -s build -l $BASE_PORT >/dev/null 2>&1 &
                  FRONT_PID=$!

                  # mock-api 스크립트가 있으면 실행
                  if npm run | grep -q "mock-api" ; then
                    npm run mock-api -- --port $API_PORT >/dev/null 2>&1 &
                    API_PID=$!
                  fi

                  # 두 포트 모두 접근 가능할 때까지 대기
                  npx wait-on http://localhost:$BASE_PORT
                  [ -n "$API_PID" ] && npx wait-on http://localhost:$API_PORT

                  echo $FRONT_PID > .front.pid || true
                  echo $API_PID   > .api.pid   || true
                '''
            }
        }

        stage('Cypress Test') {
            steps {
                sh 'xvfb-run -a npx cypress run'
            }
        }
    }

    post {
        always {
            sh '''
              [ -f .front.pid ] && kill -9 $(cat .front.pid)  || true
              [ -f .api.pid   ] && kill -9 $(cat .api.pid)    || true
            '''
        }
    }
}
