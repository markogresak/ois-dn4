'use strict'

getInitials = (name) ->
  namesArray = name.trim().split ' '
  [first, ..., last] = namesArray
  "#{first[0]}#{if namesArray.length > 1 then last[0] else ""}".toUpperCase()

randomName = ->
  len = Math.round Math.random() * 15 + 5
  chars = " abcdefghijklmnopqrstuvwxyz"
  (chars[Math.round Math.random() * chars.length - 1] for i in [1..len]).join ''

getObj = ->
  obj =
    name: randomName()
    measurements:
      weight:
        value: Math.round Math.random() * 50 + 50
        unit: 'kg'
      height:
        value: Math.round Math.random() * 50 + 150
        unit: 'cm'
      bmi:
        value: Math.round Math.random() * 15 + 20
        unit: 'kg/m2'
      heartRate:
        value: Math.round Math.random() * 50 + 50
        unit: 'bpm'
  obj.initials = getInitials obj.name
  obj

angular.module('app.controllers', [])
  .controller 'PatientsListController', ($scope) ->
    $scope.patients = []
    $scope.patients.push getObj() for i in [1..10]
