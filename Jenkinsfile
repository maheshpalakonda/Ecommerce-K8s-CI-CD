pipeline {
    agent any
    environment {
        DOCKER_HUB_USER = "mahesh1925"
        DOCKER_HUB_PASS = credentials('dockerhub-credentials')
        APP_NAME = "ecommerce-app"
        APP_VERSION = "v1.0.${BUILD_NUMBER}"
    }
    stages {
        stage('Checkout') {
            steps { git 'https://github.com/maheshpalakonda/Ecommerce-K8s-CI-CD.git' }
        }
        stage('Build Docker Image') {
            steps {
                sh """
                  docker build -t $DOCKER_HUB_USER/$APP_NAME:$APP_VERSION .
                  docker build -t $DOCKER_HUB_USER/$APP_NAME:latest .
                """
            }
        }
        stage('Push Docker Image') {
            steps {
                sh """
                  echo $DOCKER_HUB_PASS | docker login -u $DOCKER_HUB_USER --password-stdin
                  docker push $DOCKER_HUB_USER/$APP_NAME:$APP_VERSION
                  docker push $DOCKER_HUB_USER/$APP_NAME:latest
                """
            }
        }
        stage('Deploy to EKS') {
            steps {
                withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG_FILE')]) {
                    sh """
                      export KUBECONFIG=$KUBECONFIG_FILE
                      kubectl create namespace ecommerce || true
                      kubectl apply -f k8s/mysql.yaml -n ecommerce
                      kubectl apply -f k8s/deployment.yaml -n ecommerce
                      kubectl apply -f k8s/cluster-issuer.yaml
                      kubectl apply -f k8s/ingress.yaml -n ecommerce
                    """
                }
            }
        }
    }
}

