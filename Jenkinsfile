pipeline {
    agent any
    tools { nodejs 'NodeJS' }   // 관리화면에서 지정한 이름

    stages {
        stage('Checkout')  { steps { git url: 'https://github.com/kyungbin02/bookish.git',
                                      branch: '07-the-book-detail-view' } }

        stage('Install')   { steps { sh 'npm ci' } }          // 조금 더 빠른 ci 사용

        stage('Test')      { steps { sh 'npm test --watchAll=false' } }

        stage('Build')     { steps { sh 'npm run build' } }

        /* ---------- 여기부터 추가 ---------- */
        stage('E2E') {
            steps {
                sh '''
                    # 1) 앱을 백그라운드(dev 서버)로 띄움
                    nohup npm start -- --port 3000 >/dev/null 2>&1 &

                    # 2) 포트 열릴 때까지 최대 30초 대기
                    npx --yes wait-on http://localhost:3000

                    # 3) 사이프레스 실행 (헤드리스 모드)
                    npx --yes cypress run --record false
                '''
            }
            /* 테스트 끝나면 dev 서버 정리 */
            post { always { sh 'pkill -f "react-scripts start" || true' } }
        }
        /* ---------- 추가 끝 ---------- */

        stage('Start')     { steps { sh 'npm start' } }       // 필요 없으면 삭제
    }
}
