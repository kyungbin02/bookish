pipeline {
    agent any

    /* ❏ 툴 & 공통 환경변수  ------------------------------ */
    tools {
        nodejs 'NodeJS'          // Jenkins → Manage Jenkins → Tools 에 등록한 이름
    }
    environment {
        // CRA 빌드 시 test 모드 강제 종료·경고 제거
        CI             = 'false'
        // 프런트에서 fetch 할 때 process.env.REACT_APP_API_URL 로 접근
        REACT_APP_API_URL = 'http://localhost:8080'
    }

    /* ❏ 단계별 ------------------------------------------------ */
    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/kyungbin02/bookish.git',
                    branch: '07-the-book-detail-view'
            }
        }

        stage('Install') {
            steps {
                sh '''
                    echo "📦  Installing dependencies..."
                    npm ci --progress=true
                '''
            }
        }

        stage('Unit Test') {
            steps {
                sh '''
                    echo "🧪  Running tests..."
                    npm test --watchAll=false
                '''
            }
        }

        stage('Build') {
            steps {
                sh '''
                    echo "🔨  Building production bundle..."
                    npm run build
                '''
            }
            post {
                success {
                    /* 산출물 보존 – 필요 없으면 삭제 */
                    archiveArtifacts artifacts: 'build/**', followSymlinks: false
                }
            }
        }

        stage('Start Stub') {
            steps {
                sh '''
                    echo "🚀  Starting JSON stub server on :8080..."
                    npm run stub-server &             # <-- package.json 에 정의된 8080 사용
                    STUB_PID=$!
                    echo $STUB_PID > .stub_pid

                    # ▒▒▒ wait-on ‘게이지’ ▒▒▒
                    npx wait-on http://localhost:8080/books
                '''
            }
        }

        stage('Start App') {
            steps {
                sh '''
                    echo "🌐  Starting React dev-server..."
                    npm start &                       # 기본 3000
                    APP_PID=$!
                    echo $APP_PID > .app_pid

                    # dev-server 뜰 때까지 잠깐 대기
                    sleep 10
                '''
            }
        }
    }

    /* ❏ 파이프라인 종료 시 항상 프로세스 정리 ------------------ */
    post {
        always {
            echo '🧹  Cleaning up background processes...'
            sh '''
                if [ -f .app_pid  ]; then kill $(cat .app_pid)  || true ; fi
                if [ -f .stub_pid ]; then kill $(cat .stub_pid) || true ; fi
            '''
        }
    }
}
