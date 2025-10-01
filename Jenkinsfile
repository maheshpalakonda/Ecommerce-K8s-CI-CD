pipeline {
    agent any

    environment {
        DOCKERHUB_CRED = credentials('dockerhub-username')
        DOCKERHUB_CRED_PSW = credentials('dockerhub-password')
        KUBECONFIG = credentials('kubeconfig-secret-text') // your secret text ID
    }

    stages {
        stage('Checkout SCM') {
            steps {
                git branch: 'master', url: 'https://github.com/maheshpalakonda/Ecommerce-K8s-CI-CD.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t mahesh1925/ecommerce-app:latest .'
            }
        }

        stage('Push Docker Image') {
            steps {
                sh '''
                    echo $DOCKERHUB_CRED_PSW | docker login -u $DOCKERHUB_CRED --password-stdin
                    docker push mahesh1925/ecommerce-app:latest
                '''
            }
        }

        stage('Deploy to EKS') {
            steps {
                script {
                    // Write secret text to temp file
                    writeFile file: 'kubeconfig_temp', text: KUBECONFIG
                    sh 'export KUBECONFIG=kubeconfig_temp'
                    sh 'kubectl create namespace ecommerce || true'
                    sh 'kubectl apply -f k8s/mysql.yaml -n ecommerce'
                    sh 'kubectl apply -f k8s/deployment.yaml -n ecommerce'
                    sh 'kubectl apply -f k8s/service.yaml -n ecommerce'
                }
            }
        }
    }

    post {
        failure {
            echo '❌ Deployment failed. Check Jenkins logs for errors.'
        }
    }
}

