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
                    // Jenkins will pull the repo into its own workspace by default
                    echo "Repository cloned into Jenkins workspace: ${env.WORKSPACE}"
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    // Create temp venv inside Jenkins workspace (optional)
                    sh "python3 -m venv .venv"
                    sh "bash -c 'source .venv/bin/activate && pip install --upgrade pip && pip install -r requirements.txt'"
                }
            }
        }


        stage('Deploy to Production') {
            steps {
                script {
                    // Sync code from Jenkins workspace to live app folder
                    
                    sh "sudo rsync -av --delete --exclude='.env' --exclude='tp_excel.sock' ${env.WORKSPACE}/ ${APP_DIR}/"
                    sh "sudo chown -R www-data:www-data ${APP_DIR}"
                }
            }
        }

        stage('Collect Static Files') {
            steps {
                script {
                    sh "sudo bash -c 'source ${VENV_DIR}/bin/activate && cd ${APP_DIR}/src && python manage.py collectstatic --noinput'"
                }
            }
        }

        stage('Restart Services') {
            steps {
                script {
                    sh "sudo systemctl restart tp_excel"
                    sh "sudo systemctl restart nginx"
                }
            }
        }
    }
}