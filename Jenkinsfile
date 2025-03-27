pipeline {
    agent any
    stages {
        stage("Checkout") {
            steps {
                git url: 'https://github.com/leszko/calculator.git', branch: 'main'
            }
        }
        stage("Compile") {
            steps {
                sh "./gradlew compileJava"
            }
        }
        stage("Unit test") {
            steps {
                sh "./gradlew test"
            }
        }

        stage("Deploy to staging") {
  steps {
    sh 'docker run -d --rm -p 8765:8080 --name calculator leszko/calculator'
    sh 'sleep 10'
    // 컨테이너 로그 확인
    sh 'docker logs calculator'
  }
}

    }
}
