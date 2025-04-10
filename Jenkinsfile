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
                    sh "sudo rsync -av --delete ${env.WORKSPACE}/ ${APP_DIR}/"
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