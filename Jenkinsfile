pipeline {
    agent any

    environment {
        IMAGE_NAME = 'live-markdown-previewer'
        CONTAINER_NAME = 'markdown-app'
        PORT = '80'
        INTERNAL_PORT = '3000'
        PROD_SERVER_IP = '18.222.137.206'
        // Ensure this ID matches what you saved in Jenkins Credentials
        SSH_CRED_ID = '20031004' 
    }
 
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                git branch: 'main', url: 'https://github.com/luccab03/cis4930.git'
            }
        }
        
// Configured automated container build process using project Dockerfile
        stage('Build') {
            steps {
                echo 'Building Docker image...'
                sh "docker build -t ${IMAGE_NAME} ."
            }
        }

        stage('Verify') { // Configured verification: unit tests execution
            steps {
                echo 'Running unit tests inside container...'
                sh "docker run --rm ${IMAGE_NAME} npm test"
            }
        }
        
        stage('Run/Deploy') {
            steps {
                echo "Deploying to AWS EC2 at ${PROD_SERVER_IP}..."
                sshagent([SSH_CRED_ID]) {
                    sh """
                        # Save the image from Jenkins Master and pipe it directly to Server B's Docker
                        docker save ${IMAGE_NAME} | ssh -o StrictHostKeyChecking=no ubuntu@${PROD_SERVER_IP} "docker load"

                        ssh -o StrictHostKeyChecking=no ubuntu@${PROD_SERVER_IP} "
                            # Remove old container if it exists
                            sudo docker rm -f ${CONTAINER_NAME} || true
                            
                            # Run the fresh container on Port 80
                            sudo docker run -d \\
                                --name ${CONTAINER_NAME} \\
                                -p ${PORT}:${INTERNAL_PORT} \\
                                --restart unless-stopped \\
                                ${IMAGE_NAME}
                        "
                    """
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution finished.'
        }
        success {
            echo 'All stages completed successfully! App is live.'
        }
        failure {
            echo 'Pipeline failed. Check the Console Output for errors.'
        }
    }
}
