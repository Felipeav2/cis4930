pipeline {
    agent any

    environment {
        // Define standard environment variables
        IMAGE_NAME = 'live-markdown-previewer'
        CONTAINER_NAME = 'markdown-app'
        PORT = '80'
        INTERNAL_PORT = '3000'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo 'Building Docker image...'
                sh "docker build -t ${IMAGE_NAME} ."
            }
        }

        stage('Verify') {
            steps {
                echo 'Running unit tests inside container...'
                // Run tests inside a temporary container. 
                // We override the entrypoint to run npm test instead of npm start
                sh "docker run --rm ${IMAGE_NAME} npm test"
            }
        }

        stage('Run/Deploy') {
            steps {
                echo 'Deploying application...'
                // Stop and remove existing container if it exists
                sh "docker rm -f ${CONTAINER_NAME} || true"
                
                // Run new container on port 80 (standard HTTP port for EC2 deployment)
                sh "docker run -d -p ${PORT}:${INTERNAL_PORT} --name ${CONTAINER_NAME} --restart unless-stopped ${IMAGE_NAME}"
                
                echo "Deployment successful. Application is running on port ${PORT}."
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution finished.'
        }
        success {
            echo 'All stages completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Please check the logs.'
        }
    }
}
