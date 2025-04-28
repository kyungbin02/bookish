pipeline {
    agent any
    tools {
        nodejs 'NodeJS'          // Jenkins 관리 > Global Tool Configuration 에서 등록한 이름
    }

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/kyungbin02/bookish.git',
                    branch: '07-the-book-detail-view'
            }
        }

        stage('Install')  { steps { sh 'npm ci'        } }   // 속도↑
        stage('Test')     { steps { sh 'npm test'      } }
        stage('Build')    { steps { sh 'npm run build' } }

        /* ■■■—-—-—-—- 여기 ↓ 한 스테이지만 추가 —-—-—-—-■■■ */
        stage('E2E') {
            steps {
                /*
                 *  Electron(기본 브라우저)로 headless 실행.
                 *  따로 크롬 못 깔아도 Jenkins 에이전트 대부분 통과합니다.
                 */
                sh 'npx cypress run --record false'
            }
        }
        /* ■■■—-—-—-—-—-—-—-—-—-—-—-—-—-—-—-—-—-■■■ */

        stage('Start') {          // 로컬 구동 필요하면 유지
            steps { sh 'npm start' }
        }
    }
}
