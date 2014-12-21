'use strict'



App.controller 'PatientsListController',
  ($scope, $rootScope, $location, EhrLookup) ->

    $rootScope.title = 'Patient list'

    ehrIds = [
      'b931580f-2b05-488b-985b-8d9ffb08ad02'
      'd564c6a3-5a43-4fcc-bfa7-9ac76e9673bd'
      '7b661e12-3a98-21ad-c29e-2dc9f5a3d885'
    ]

    sessionId = EhrLookup.getSessionId()

    $scope.patients = []
    for ehrId in ehrIds
      EhrLookup.getAllData ehrId, sessionId, (data) ->
        return if not data
        $scope.patients.push data


    $scope.viewPatient = (key) ->
      $location.path "/patients/#{key}"

    $scope.graphOptionChange = (val) ->
      console.log "change, #{val}"
