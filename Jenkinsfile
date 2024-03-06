pipeline {
    agent any

    stages {
        stage('SonarQube Analysis') {
            steps {
                sh 'sonar-scanner -Dsonar.projectKey=share-your-experience-frontend -Dsonar.sources=. -Dsonar.host.url=http://localhost:9000 -Dsonar.token=sqp_0748f118971f758c8eafa28f683154be8d1204d3'
            }
        }
        stage('Docker image creation') {
            steps {
                sh 'docker build -t hamou99/share-your-experience-frontend .'
            }
        }
        stage('Docker image deployment') {
            steps {
                withCredentials([string(credentialsId: 'dockerhubpassword', variable: 'dockerhubpassword')]) {
                    sh 'docker login -u hamou99 -p ${dockerhubpassword}'   
                }
                sh 'docker push hamou99/share-your-experience-frontend:latest'
            }
        }
    }
}
