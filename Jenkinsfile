// Jenkinsfile  (수정판)
pipeline {
    agent any

    /* Jenkins > Manage Jenkins > NodeJS 에서 만든 툴 이름 */
    tools {
        nodejs 'NodeJS'
    }

    /* React-scripts·Cypress 가 CI 환경임을 인지하도록 */
    environment {
        CI = 'true'
    }

    stages {
        /* 1) Git 체크아웃 -------------------------------------------------- */
        stage('Checkout') {
            steps {
                git url: 'https://github.com/kyungbin02/bookish.git',
                    branch: '07-the-book-detail-view'
            }
        }

        /* 2) 패키지 설치 ---------------------------------------------------- */
        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }

        /* 3) 단위 테스트 ---------------------------------------------------- */
        stage('Unit Test') {
            steps {
                sh 'npm test --watchAll=false'
            }
        }

        /* 4) 리액트 빌드 ---------------------------------------------------- */
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        /* 5) Cypress E2E ---------------------------------------------------- */
        stage('E2E') {
            steps {
                sh '''
                    # build 폴더를 정적 서버로 백그라운드 실행
                    nohup npx serve -s build -l 3000 >/dev/null 2>&1 &
                    SERVER_PID=$!

                    # 3000 포트 열릴 때까지 대기
                    npx wait-on http://localhost:3000

                    # Cypress (Electron headless)
                    npx cypress run --record false
                    RESULT=$?

                    # 백그라운드 서버 종료
                    kill $SERVER_PID || true

                    exit $RESULT
                '''
            }
        }
    }

    /* 6) 결과 수집 --------------------------------------------------------- */
    post {
        always {
            /* 실패 스크린샷·영상 보존 */
            archiveArtifacts artifacts: 'cypress/screenshots/**/*, cypress/videos/**/*',
                             allowEmptyArchive: true
        }
    }
}
