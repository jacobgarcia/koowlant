pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        sh 'node -v && yarn'
        sh 'gulp build'
      }
    }
  }
}