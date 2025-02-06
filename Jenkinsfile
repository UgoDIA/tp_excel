pipeline {
    agent any

    environment {
        APP_DIR = "/var/www/tp_excel"
        VENV_DIR = "/var/www/tp_excel/.venv"
    }

    stages {
        stage('Clone Repository') {
            steps {
                script {
                    // Pull latest changes from GitHub
                    sh "cd ${APP_DIR} && git pull origin main"
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    // Activate virtual environment and install dependencies
                    sh "source ${VENV_DIR}/bin/activate && pip install -r ${APP_DIR}/requirements.txt"
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
