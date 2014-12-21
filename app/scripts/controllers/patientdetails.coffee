'use strict'

App.controller 'PatientDetailController',
  ($scope, $rootScope, $location, EhrLookup) ->
    $rootScope.title = 'Details for name'

    EhrLookup.getAllData ehrId, sessionId, (data) -> $scope.patient = data
