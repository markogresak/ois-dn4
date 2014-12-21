'use strict'

# Declare app level module which depends on filters, and services
App = angular.module 'app', [
  'ngRoute'
  # 'app.controllers'
  # 'app.directives'
  # 'app.filters'
  # 'app.services'
  # 'partials'
]

App.config([
  '$routeProvider'

  ($routeProvider) ->
    $routeProvider

      .when '/patients',
        templateUrl: 'views/patientsList.html'
        controller: 'PatientsListController'

      .when '/patients/:ehrid',
        templateUrl: 'views/patientDetail.html'
        controller: 'PatientDetailController'

      .otherwise
        redirectTo: '/patients'
])
