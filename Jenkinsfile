pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        sh 'ln -s /usr/bin/nodejs /usr/bin/node && gulp build'
      }
    }
  }
}