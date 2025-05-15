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
        stage('Clean Environment') {
            steps {
                // 이전에 실행 중인 서버 프로세스 정리
                sh '''
                # 이전에 실행 중인 프로세스 정리
                pkill -f "node.*react-scripts" || true
                pkill -f "node.*server" || true
                '''
            }
        }
        stage('Install') {
            steps {
                sh 'npm install'
            }
        }
        stage('Test') {
            steps {
                sh 'CI=true npm test -- --watchAll=false'
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
        stage('Run Cypress Tests') {
            steps {
                // 백그라운드에서 서버 실행하고 사이프레스 테스트 실행
                sh '''
                # 백그라운드에서 서버 시작
                npm start &
                echo "React 서버 시작됨 (포트 3000)"
                sleep 20  # 서버가 완전히 시작될 때까지 기다림
                
                # 서버 상태 확인
                curl -s http://localhost:3000 || echo "React 서버 응답 없음"
                
                # 사이프레스 테스트 실행
                echo "사이프레스 테스트 실행..."
                npx cypress run --headless
                
                # 테스트 결과 확인
                CYPRESS_EXIT_CODE=$?
                
                # 서버 종료
                echo "서버 정리 중..."
                pkill -f "node.*react-scripts" || true
                
                # 테스트 결과에 따라 종료 코드 반환
                exit $CYPRESS_EXIT_CODE
                '''
            }
            options {
                timeout(time: 10, unit: 'MINUTES')
            }
        }
    }
    post {
        always {
            // 백그라운드로 실행된 프로세스 정리
            sh '''
            pkill -f "node.*react-scripts" || true
            pkill -f "node.*server" || true
            '''
        }
    }
}
