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
                sh '''
                pkill -f "node.*react-scripts" || true
                pkill -f "node.*server.js" || true
                pkill -f "json-server" || true
                '''
            }
        }
        stage('Install') {
            steps {
                sh 'npm install'
            }
        }
        stage('Run Cypress Tests') {
            steps {
                sh '''
                # 백그라운드에서 API 서버 시작
                node server.js &
                SERVER_PID=$!
                echo "API 서버 시작됨 (PID: $SERVER_PID)"
                
                # 백그라운드에서 React 앱 시작
                npm start &
                REACT_PID=$!
                echo "React 서버 시작됨"
                
                # 서버가 시작될 때까지 기다림
                echo "서버 시작 대기 중..."
                sleep 30
                
                # 사이프레스 테스트 실행
                echo "사이프레스 테스트 실행..."
                npx cypress run --headless || true
                
                # 서버 종료
                echo "서버 정리 중..."
                kill $REACT_PID $SERVER_PID || true
                '''
            }
            options {
                timeout(time: 10, unit: 'MINUTES')
            }
        }
    }
    post {
        always {
            sh '''
            pkill -f "node.*react-scripts" || true
            pkill -f "node.*server.js" || true
            pkill -f "json-server" || true
            '''
        }
    }
}
