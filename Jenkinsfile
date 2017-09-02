pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        sh 'node -v && npm install'
        sh 'gulp build'
      }
    }
  }
}