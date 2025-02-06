pipeline {
    agent any

    environment {
        APP_DIR = "/var/www/tp_excel"
        VENV_DIR = "/var/www/tp_excel/.venv"
    }

    stages {
        stage('Checkout Repository') {
            steps {
                checkout scm
            }
        }

        stage('Deploy to Server') {
            steps {
                script {
                    // Copy new files from Jenkins workspace to app directory
                    sh "rsync -av --delete ${WORKSPACE}/ ${APP_DIR}/"
                }
            } 
        }

        stage('Install Dependencies') {
            steps {
                script {
                    // Use bash shell for source command
                    sh "bash -c 'source ${VENV_DIR}/bin/activate && pip install -r ${APP_DIR}/requirements.txt'"
                }
            }
        }

        stage('Restart Services') {
            steps {
                script {
                    // Restart Gunicorn and Nginx to apply the changes
                    sh "sudo systemctl restart tp_excel"
                    sh "sudo systemctl restart nginx"
                }
            }
        }
    }
}