/**
 * Jenkinsfile – NodeJS + Cypress 간단 파이프라인
 *  - Jenkins ‘Global Tool Configuration’ 에 NodeJS 이름을 꼭 `NodeJS` 로 맞춰 두세요.
 *  - 프런트는 build 후 npx serve -s build -l 3000 로 띄움
 *  - (선택) mock-api 스크립트가 있으면 4000번에 병렬 실행
 *  - 서버가 뜰 때까지 wait-on 으로 대기
 *  - xvfb-run 으로 Cypress 실행
 */
pipeline {
    agent any                                  // 어떤 노드든 가능
    tools {
        nodejs 'NodeJS'                       // Jenkins 관리 화면에 등록된 이름
    }

    environment {
        BASE_PORT = '3000'                    // 프런트엔드 포트
        API_PORT  = '4000'                    // (선택) mock API 포트
        CYPRESS_baseUrl = "http://localhost:${BASE_PORT}"
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
                sh 'npm ci --loglevel warn'  // 깔끔하게 설치
            }
        }

        stage('Unit Test') {
            steps {
                sh 'npm test -- --watchAll=false'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Start static server (+ mock-api)') {
            steps {
                // 백그라운드로 서버 실행, 준비될 때까지 대기
                sh """
                  # 프런트 정적 서버
                  npx serve -s build -l ${BASE_PORT} > /dev/null 2>&1 &
                  FRONT_PID=$!

                  # mock-api 스크립트가 있으면 실행
                  if npm run | grep -q \"mock-api\" ; then
                    npm run mock-api -- --port ${API_PORT} > /dev/null 2>&1 &
                    API_PID=$!
                  fi

                  # 두 포트 모두 접근 가능할 때까지 대기
                  npx wait-on http://localhost:${BASE_PORT}

                  # 필요하면 API도 확인
                  if [ -n \"${API_PID}\" ] ; then
                    npx wait-on http://localhost:${API_PORT}
                  fi

                  # PID 파일로 남겨두기 (post 섹션에서 종료용)
                  echo \$FRONT_PID > .front.pid || true
                  echo \$API_PID   > .api.pid   || true
                """
            }
        }

        stage('Cypress Test') {
            steps {
                // Electron 은 X 서버를 요구 → xvfb-run 으로 가상 디스플레이 생성
                sh 'xvfb-run -a npx cypress run'
            }
        }
    }

    post {
        always {
            // 백그라운드 프로세스 정리
            sh '''
              [ -f .front.pid ] && kill -9 $(cat .front.pid)  || true
              [ -f .api.pid   ] && kill -9 $(cat .api.pid)    || true
            '''
        }
    }
}
