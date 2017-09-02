pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        sh 'npm -v && npm install'
        sh 'gulp build'
      }
    }
  }
}