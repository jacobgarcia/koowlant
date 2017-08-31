pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        sh 'sudo ln -s /usr/bin/nodejs /usr/bin/node && gulp build'
      }
    }
  }
}