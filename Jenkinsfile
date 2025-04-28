pipeline {
    agent any
    tools { nodejs 'NodeJS' }          // Jenkins > Global Tool Configuration 에서 등록한 이름

    stages {
        /* 1. 소스 내려받기 */
        stage('Checkout') {
            steps { git url: 'https://github.com/kyungbin02/bookish.git', branch: '07-the-book-detail-view' }
        }

        /* 2. 의존 설치 – 진행바 보이게 */
        stage('Install') {
            steps {
                // --progress=true 로 콘솔에 게이지 출력, --loglevel=info 로 패키지명도 표시
                sh 'npm ci --progress=true --loglevel=info'
            }
        }

        /* 3. 단위 테스트 */
        stage('Unit Test') {
            steps { sh 'npm test --watchAll=false' }   // watch 끄고 한 번만 실행
        }

        /* 4. 번들 빌드 */
        stage('Build') {
            steps { sh 'npm run build' }
        }

        /* 5. Stub-Server(json-server) 기동 : 4000 포트 */
        stage('Start Stub') {
            steps {
                sh '''
                    npm run stub-server -- --port 4000 &
                    echo $! > stub.pid
                    npx wait-on http://localhost:4000/books
                '''
            }
        }

        /* 6. 프런트 dev-server 기동 : 3000 포트 */
        stage('Start Front') {
            steps {
                sh '''
                    REACT_APP_API_URL=http://localhost:4000 \        # 프런트가 호출할 API 주소
                    npm start -- --port 3000 &                       # 백그라운드 실행
                    echo $! > front.pid
                    npx wait-on http://localhost:3000
                '''
            }
        }

        /* 7. Cypress E2E (headless) */
        stage('Cypress Test') {
            steps { sh 'npx cypress run --config baseUrl=http://localhost:3000' }
        }
    }

    /* 8. 항상 두 서버 종료 */
    post {
        always {
            sh '''
                [ -f front.pid ] && kill $(cat front.pid) || true
                [ -f stub.pid  ] && kill $(cat stub.pid)  || true
            '''
        }
    }
}
