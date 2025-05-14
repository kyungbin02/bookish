pipeline {
    agent any
    tools {
        nodejs 'NodeJS'  // 관리화면에서 지정한 이름
    }
    stages {
        stage("Checkout") {
            steps {
                git url: 'https://github.com/kyungbin02/bookish.git', branch: '07-the-book-detail-view'
            }
        }
        stage('Install') {
            steps {
                sh 'npm install'
            }
        }
        stage('Test') {
            steps {
                sh 'CI=true npm test -- --watchAll=false --runInBand --passWithNoTests'
            }
            options {
                timeout(time: 5, unit: 'MINUTES')
            }
        }
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        stage('Cypress Test') {
            when {
                expression { return false }
            }
            steps {
                sh '''
                npm start &
                sleep 10
                npx cypress run --headless
                '''
            }
            options {
                timeout(time: 3, unit: 'MINUTES')
            }
        }
    }
    post {
        always {
            script {
                sh 'pkill -f "node.*react-scripts" || true'
            }
        }
    }
}
