// Jenkinsfile
pipeline {
    agent any

    tools {
        nodejs 'NodeJS'      // Jenkins → Manage Jenkins → NodeJS 설정 이름
    }

    environment {
        CI = 'true'          // React-scripts, Cypress가 “CI 모드”로 돌아가도록
    }

    stages {
        /* 1. 소스 내려받기 -------------------------------------------------- */
        stage('Checkout') {
            steps {
                git url: 'https://github.com/kyungbin02/bookish.git',
                    branch: '07-the-book-detail-view'
            }
        }

        /* 2. 의존성 설치 ---------------------------------------------------- */
        stage('Install') {
            steps {
                sh 'npm ci'   // lockfile-기반 설치
            }
        }

        /* 3. 단위 테스트 ---------------------------------------------------- */
        stage('Unit Test') {
            steps {
                sh 'npm test --watchAll=false'
            }
        }

        /* 4. 리액트 빌드 ---------------------------------------------------- */
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        /* 5. Cypress E2E ---------------------------------------------------- */
        stage('E2E') {
            steps {
                /* 쉘 스크립트는 삼중따옴표/작은따옴표로 감싸
                   줄바꿈을 그대로 살려야 각 명령이 분리됩니다. */
                sh '''
                    # build 폴더를 정적 서버로 띄움
                    nohup npx serve -s build -l 3000 >/dev/null 2>&1 &
                    SERVER_PID=$!

                    # 포트 3000 열릴 때까지 대기
                    npx wait-on http://localhost:3000

                    # Cypress 헤드리스 실행
                    npx cypress run --record false
                    RESULT=$?

                    # 백그라운드 서버 종료
                    kill $SERVER_PID || true

                    exit $RESULT
                '''
            }
        }
    }

    /* 6. 결과 수집 --------------------------------------------------------- */
    post {
        always {
            /* JUnit reporter를 쓰고 있다면 아래 라인 활성화
            junit '**/cypress/results/**/*.xml'
            */
            // 스크린샷·영상 보존 (실패 케이스 확인용)
            archiveArtifacts artifacts: 'cypress/screenshots/**/*, cypress/videos/**/*',
                             allowEmptyArchive: true
        }
    }
}
