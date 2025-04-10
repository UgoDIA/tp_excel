pipeline {
    agent any

    environment {
        APP_DIR = "/var/www/tp_excel"
        VENV_DIR = "/var/www/tp_excel/.venv"
    }

    stages {
        stage('Clone du repo git') {
            steps {
                script {
                   
                    echo "Repo cloné dans le workspace jenkins: ${env.WORKSPACE}"
                }
            }
        }

        stage('Install des dépendances python') {
            steps {
                script {
                    // venv temporaire pour le workspace jenkins
                    sh "python3 -m venv .venv"
                    sh "bash -c 'source .venv/bin/activate && pip install --upgrade pip && pip install -r requirements.txt'"
                }
            }
        }

        stage('Tests') {
            environment {
                DJANGO_KEY = credentials('DJANGO_KEY')
                DBUSER = credentials('DBUSER')
                DBNAME = credentials('DBNAME')
                DBPWD = credentials('DBPWD')
                DBHOST = credentials('DBHOST')
                DBPORT = credentials('DBPORT')
            }
            steps {
                script {
                    sh "bash -c 'source .venv/bin/activate && cd src && python manage.py test'"
                }
            }
        }


        stage('Déploiement en production') {
            steps {
                script {
                    // Sync les fichiers du workspace jenkins vers le dossier de prod 
                    
                    sh "sudo rsync -av --delete --exclude='.env' --exclude='tp_excel.sock' ${env.WORKSPACE}/ ${APP_DIR}/"
                    sh "sudo chown -R www-data:www-data ${APP_DIR}"
                }
            }

        }

        stage('Collecte static files') {
            steps {
                script {
                    sh "sudo bash -c 'source ${VENV_DIR}/bin/activate && cd ${APP_DIR}/src && python manage.py collectstatic --noinput'"
                }
            }
        }

        stage('Restart services') {
            steps {
                script {
                    sh "sudo systemctl restart tp_excel"
                    sh "sudo systemctl restart nginx"
                }
            }
        }
    }
    post {
        success {
            mail (
                subject: "✅ Succès du job Jenkins ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """<p>Le job Jenkins <b>${env.JOB_NAME} #${env.BUILD_NUMBER}</b> s'est terminé avec succès.</p>
                         <p>Vous pouvez consulter les détails ici : <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>""",
                to: "ugofokyin@gmail.com",
                mimeType: 'text/html'
            )
        }
        failure {
            mail (
                subject: "❌ Échec du job Jenkins ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """<p>Le job Jenkins <b>${env.JOB_NAME} #${env.BUILD_NUMBER}</b> a échoué.</p>
                         <p>Consultez les logs ici : <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>""",
                to: "ugofokyin@gmail.com",
                mimeType: 'text/html'
            )
        }
    }
}