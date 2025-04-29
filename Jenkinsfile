/*
 * Jenkinsfile – bookish 리액트 프로젝트 CI/CD
 *   ▸ NodeJS 빌드 + 단위 테스트(Jest) + 정적 번들
 *   ▸ json-server 스텁 + 정적 서버 + Cypress E2E
 */

pipeline {
    agent any

    tools {
        nodejs 'NodeJS'            // Jenkins 관리 ▸ Global Tool 로 등록한 이름
    }

    environment {
        CI = 'true'                // CRA --watch 비활성화
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
                sh 'npm ci'
            }
        }

        stage('Unit Test') {
            steps {
                sh 'npm test --watchAll=false'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('E2E') {
            steps {
                sh '''
                    # ───── 포트가 이미 점유돼 있으면 강제 종료 ─────
                    fuser -k 8080/tcp || true
                    fuser -k 3000/tcp || true

                    # ───── 스텁 API(json-server) & 정적 서버 ─────
                    npx json-server --watch db.json --port 8080 &
                    npx serve -s build -l 3000 &

                    # ───── 두 서비스가 뜰 때까지 대기 ─────
                    npx wait-on http://localhost:3000 http://localhost:8080/books

                    # ───── Cypress ─────
                    npx cypress run --record false
                '''
            }

            post {
                always {
                    // 실패 스크린샷 아카이브(있는 경우만)
                    archiveArtifacts artifacts: 'cypress/screenshots/**/*.png',
                                      allowEmptyArchive: true
                }
            }
        }
    }

    post {
        always {
            echo '파이프라인 종료'
        }
    }
}
