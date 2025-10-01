pipeline {
    agent any

    environment {
        // Kubeconfig Secret Text ID
        KUBECONFIG = credentials('kubeconfig')
        // DockerHub credentials ID
        DOCKERHUB_CRED = credentials('dockerhub-credentials')
        IMAGE_NAME = "mahesh1925/ecommerce-app:latest"
        NAMESPACE = "ecommerce"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/<your-username>/Ecommerce-K8s-CI-CD.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME} ."
            }
        }

        stage('Push Docker Image') {
            steps {
                sh "echo ${DOCKERHUB_CRED_PSW} | docker login -u ${DOCKERHUB_CRED_USR} --password-stdin"
                sh "docker push ${IMAGE_NAME}"
            }
        }

        stage('Deploy to EKS') {
            steps {
                sh "kubectl create namespace ${NAMESPACE} || true"
                sh "kubectl apply -f k8s/mysql.yaml -n ${NAMESPACE}"
                sh "kubectl apply -f k8s/deployment.yaml -n ${NAMESPACE}"
                sh "kubectl apply -f k8s/cluster-issuer.yaml"
                sh "kubectl apply -f k8s/ingress.yaml -n ${NAMESPACE}"
            }
        }
    }

    post {
        success {
            echo "✅ E-commerce app deployed successfully to EKS!"
        }
        failure {
            echo "❌ Deployment failed. Check the Jenkins logs for errors."
        }
    }
}

