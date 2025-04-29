pipeline {
    agent any
    tools { nodejs 'NodeJS' }

    stages {
        stage('Checkout')  { steps { git url: 'https://github.com/kyungbin02/bookish.git', branch: '07-the-book-detail-view' } }
        stage('Install')   { steps { sh 'npm ci' } }
        stage('Unit Test') { steps { sh 'npm test --watchAll=false' } }
        stage('Build')     { steps { sh 'npm run build' } }

        stage('E2E') {
            steps {
                sh '''
                    npx serve -s build -l 3000 &      # ⭐️ 추가
                    npx wait-on http://localhost:3000
                    npx cypress run --record false
                '''
            }
        }
    }
    post {
        always { echo '파이프라인 종료' }
    }
}
