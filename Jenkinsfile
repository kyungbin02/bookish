pipeline {
    /* ─────────────────────────────────────────────────────
       bookish-react CI/CD 파이프라인
       ───────────────────────────────────────────────────── */
    agent any            // 아무 에이전트나 사용

    tools {
        nodejs 'NodeJS'  // [Jenkins > Manage > Tools] 에 등록한 NodeJS 이름
    }

    stages {

        /* 1) 소스 체크아웃 -------------------------------------------- */
        stage('Checkout') {
            steps {
                git url: 'https://github.com/kyungbin02/bookish.git',
                    branch: '07-the-book-detail-view'
            }
        }

        /* 2) 의존성 설치 ---------------------------------------------- */
        stage('Install') {
            steps {
                sh 'npm ci'       // CI 환경에선 npm ci 가 가장 안전/빠름
            }
        }

        /* 3) 단위 테스트 ---------------------------------------------- */
        stage('Unit Test') {
            steps {
                sh 'npm test'
            }
        }

        /* 4) Dev 서버 + Cypress --------------------------------------- */
        stage('Dev Servers & Cypress') {
            steps {
                // 멀티-라인 셸 스크립트 (여기서 줄바꿈이 **매우** 중요!)
                sh '''
                    # 0) Jenkins 가 백그라운드 프로세스를 죽이지 않게
                    export JENKINS_NODE_COOKIE=dontKillMe

                    # 1) 개발 서버 3개를 백그라운드로 기동
                    nohup npm start                          > ui.log   2>&1 &
                    nohup npm run stub-server -- --port 4000 > stub.log 2>&1 &
                    nohup node server.js                     > api.log  2>&1 &

                    # 2) 3개 포트(3000 / 4000 / 8080)가 모두 열릴 때까지 대기
                    echo "⏳  Waiting for dev servers..."
                    npx wait-on \
                        http://localhost:3000 \
                        http://localhost:4000 \
                        http://localhost:8080 \
                        --timeout 600000     # 10 분

                    # 3) Cypress e2e 테스트 실행
                    echo "🚀  Running Cypress..."
                    npx cypress run
                '''
            }
        }

        /* 5) 프로덕션 빌드 -------------------------------------------- */
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
    }
}
