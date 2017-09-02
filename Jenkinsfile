pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        sh 'export PATH=/usr/local/bin && npm install'
        sh 'gulp build'
      }
    }
  }
}