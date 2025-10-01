pipeline {
    agent any

    environment {
        DOCKERHUB_CRED = credentials('dockerhub-username')        // Your DockerHub username credential ID
        DOCKERHUB_CRED_PSW = credentials('dockerhub-password')    // Your DockerHub password credential ID
        KUBECONFIG = credentials('kubeconfig')                // Replace with your actual secret text ID
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
                    // Write secret text to a temp kubeconfig file
                    writeFile file: 'kubeconfig_temp', text: KUBECONFIG
                    sh 'export KUBECONFIG=kubeconfig_temp'

                    // Create namespace if it doesn't exist
                    sh 'kubectl create namespace ecommerce || true'

                    // Apply Kubernetes manifests
                    sh 'kubectl apply -f k8s/mysql.yaml -n ecommerce'
                    sh 'kubectl apply -f k8s/deployment.yaml -n ecommerce'
                    sh 'kubectl apply -f k8s/service.yaml -n ecommerce'

                    // Optional: remove temp kubeconfig
                    sh 'rm -f kubeconfig_temp'
                }
            }
        }
    }

    post {
        failure {
            echo '❌ Deployment failed. Check Jenkins logs for errors.'
        }
        success {
            echo '✅ Deployment succeeded!'
        }
    }
}

