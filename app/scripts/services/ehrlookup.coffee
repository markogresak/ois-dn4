'use strict'

escapeAql = (multilineAql) ->
  multilineAql.replace /(\r\n|\n|\r)/gm, " "

calculateAge = (dateOfBirth) ->
  Math.abs new Date(Date.now() - dateOfBirth.getTime()).getUTCFullYear() - 1970

getInitials = (name) ->
  namesArray = name.trim().split ' '
  [first, ..., last] = namesArray
  "#{first[0]}#{if namesArray.length > 1 then last[0] else ""}".toUpperCase()

App.factory 'EhrLookup', () ->
  baseUrl = "https://rest.ehrscape.com/rest/v1"
  queryUrl = baseUrl + "/query"
  username = encodeURIComponent "ois.seminar"
  password = encodeURIComponent "ois4fri"

  factoryObj = {}

  factoryObj.getSessionId = ->
    $.ajax
      type: "POST"
      url: "#{baseUrl}/session?username=#{username}&password=#{password}"
      async: false
    .responseJSON.sessionId

  factoryObj.aqlQuery = (aql, sessionId, callback) ->
    $.ajax
      url: "#{baseUrl}/query?#{$.param 'aql': aql}"
      type: 'GET',
      headers:
        "Ehr-Session": sessionId,
      success: callback

  factoryObj.lastValue = (select, contains, ehrId, sessionId, callback) ->
    aql = escapeAql """
      select
      #{select}
      from EHR e[e/ehr_id/value='#{ehrId}']
      contains OBSERVATION #{contains}
      order by t/data[at0002]/events[at0003]/time/value desc
      limit 1
    """
    factoryObj.aqlQuery aql, sessionId, callback

  factoryObj.getLastWeight = (ehrId, sessionId, callback) ->
    select = "t/data[at0002]/events[at0003]/data[at0001]/items[at0004, 'Body weight']/value/magnitude as value," +
    "t/data[at0002]/events[at0003]/data[at0001]/items[at0004, 'Body weight']/value/units as unit"
    contains = "t[openEHR-EHR-OBSERVATION.body_weight.v1]"
    factoryObj.lastValue select, contains, ehrId, sessionId, callback

  factoryObj.getLastHeight = (ehrId, sessionId, callback) ->
    select = "t/data[at0001]/events[at0002]/data[at0003]/items[at0004, 'Body Height/Length']/value/magnitude as value"
    contains = "t[openEHR-EHR-OBSERVATION.height.v1]"
    factoryObj.lastValue select, contains, ehrId, sessionId, callback

  factoryObj.getLastTemperature = (ehrId, sessionId, callback) ->
    select = "t/data[at0002]/events[at0003]/data[at0001]/items[at0004]/value/magnitude as value,"+
    "t/data[at0002]/events[at0003]/data[at0001]/items[at0004]/value/units as unit"
    contains = "t[openEHR-EHR-OBSERVATION.body_temperature.v1]"
    factoryObj.lastValue select, contains, ehrId, sessionId, callback

  factoryObj.getLastPulse = (ehrId, sessionId, callback) ->
    select = "t/data[at0002]/events[at0003]/data[at0001]/items[at0004]/value/magnitude as value"
    contains = "t[openEHR-EHR-OBSERVATION.heart_rate-pulse.v1]"
    factoryObj.lastValue select, contains, ehrId, sessionId, callback

  factoryObj.getPersonalData = (ehrId, sessionId, callback) ->
    url = "#{baseUrl}/demographics/ehr/#{ehrId}/party"
    $.ajax
      url: "#{baseUrl}/demographics/ehr/#{ehrId}/party"
      type: "GET"
      headers:
        "Ehr-Session": sessionId
      success: (data) ->
        partyData = data.party
        dateOfBirth = new Date partyData.dateOfBirth
        fullName = "#{partyData.firstNames} #{partyData.lastNames}"
        callback
          name: fullName
          initials: getInitials fullName
          dateOfBirth: dateOfBirth
          age: calculateAge dateOfBirth
          gender: partyData.gender
          ehrId: ehrId

  factoryObj.getAllData = (ehrId, sessionId, callback) ->

    isDone = (data) ->
      return false if data is null
      for k, v of data
        return false if v is null
      true

    isDataDone = (data) ->
      isDone(data.person) and
      isDone(data.measurements.weight) and
      isDone(data.measurements.height) and
      isDone(data.measurements.bmi) and
      isDone(data.measurements.pulse)

    doCallback = (data, cb) ->
      return if not isDataDone data
      cb data

    data =
      person:
        name: null
        initials: null
        dateOfBirth: null
        age: null
        gender: null
        ehrId: null
      measurements:
        weight: { value: null, unit: null }
        height: { value: null, unit: null }
        temperature: { value: null, unit: null }
        pulse: { value: null, unit: null }

    factoryObj.getPersonalData ehrId, sessionId, (res) ->
      data.person = res
      doCallback data, callback

    factoryObj.getLastWeight ehrId, sessionId, (res) ->
      return if not res
      d = res.resultSet[0]
      data.measurements.weight.value = d.value
      data.measurements.weight.unit = d.unit or 'kg'
      doCallback data, callback

    factoryObj.getLastHeight ehrId, sessionId, (res) ->
      return if not res
      d = res.resultSet[0]
      data.measurements.height.value = d.value
      data.measurements.height.unit = d.unit or 'cm'
      doCallback data, callback

    factoryObj.getLastTemperature ehrId, sessionId, (res) ->
      return if not res
      d = res.resultSet[0]
      data.measurements.temperature.value = d.value
      data.measurements.temperature.unit = d.unit or '°C'
      doCallback data, callback

    factoryObj.getLastPulse ehrId, sessionId, (res) ->
      return if not res
      d = res.resultSet[0]
      data.measurements.pulse.value = d.value
      data.measurements.pulse.unit = d.unit or 'bpm'
      doCallback data, callback

  factoryObj


