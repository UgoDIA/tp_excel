pipeline {
    agent any

    environment {
        VENV_DIR = "/var/www/tp_excel/.venv"
    }

    stages {
        stage('Checkout Repository') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    // Activate virtual environment and install dependencies
                    sh "source ${VENV_DIR}/bin/activate && pip install -r requirements.txt"
                }
            }
        }

        stage('Restart Services') {
            steps {
                script {
                    // Restart Gunicorn and Nginx to apply the changes
                    sh "sudo systemctl restart gunicorn"
                    sh "sudo systemctl restart nginx"
                }
            }
        }
    }
}
