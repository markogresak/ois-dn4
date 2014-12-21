String::isNullOrEmpty = ->
  @trim().length is 0

baseUrl = "https://rest.ehrscape.com/rest/v1"
queryUrl = baseUrl + "/query"
username = encodeURIComponent "ois.seminar"
password = encodeURIComponent "ois4fri"

Label = {
  "success": "label-success"
  "warning": "label-warning"
  "danger": "label-danger"
}


getSessionId = ->
  $.ajax
    type: "POST"
    url: "#{baseUrl}/session?username=#{username}&password=#{password}"
    async: false
  .responseJSON.sessionId

showMessage = (msg, element, classes = "") ->
  return if not element
  allClasses = "obvestilo label fade-in #{classes}"
  $(element).html("<span>#{msg}</span>").addClass(allClasses)

handleError = (err, msgEl) ->
  msg = JSON.parse(err.responseText).userMessage
  showMessage msg, msgEl, Label.danger
  console.log msg

createEHR = ->
  sessionId = getSessionId()
  ime = $("#kreirajIme").val() or ""
  priimek = $("#kreirajPriimek").val() or ""
  datum = $("#kreirajDatumRojstva").val() or ""
  msgEl = $("#kreirajSporocilo")

  if ime.isNullOrEmpty?() or priimek.isNullOrEmpty?() or datum.isNullOrEmpty?()
    return showMessage "Prosim vnesite zahtevane podatke!", msgEl, Label.warning

  $.ajaxSetup
    headers:
      "Ehr-Session": sessionId
  $.ajax
    url: "#{baseUrl}/ehr"
    type: "POST"
    success: (data) ->
      ehrId = data.ehrId
      partyData =
        firstNames: ime
        lastNames: priimek
        dateOfBirth: datum
        partyAdditionalInfo: [
          key: "ehrId"
          value: ehrId
        ]
      $.ajax
        url: "#{baseUrl}/demographics/party"
        type: "POST"
        contentType: "application/json"
        data: JSON.stringify partyData
        success: (party) ->
          if party.action is "CREATE"
            msg = "Uspešno kreiran EHR '#{ehrId}'."
            showMessage msg, msgEl, Label.success
            console.log msg
            $("#preberiEHRid").val ehrId
        error: (err) -> handleError err, msgEl

readEHR = ->
  sessionId = getSessionId()
  ehrId = $("#preberiEHRid").val() or ""
  msgEl = $("#preberiSporocilo")
  if ehrId.isNullOrEmpty?()
    return showMessage "Prosim vnesite zahtevan podatek!", msgEl, Label.warning

  $.ajax
    url: "#{baseUrl}/demographics/ehr/#{ehrId}/party"
    type: "GET"
    headers:
      "Ehr-Session": sessionId
    success: (data) ->
      p = data.party
      msg = "Bolnik #{p.firstNames} #{p.lastNames}, rojen #{p.dateOfBirth}."
      showMessage msg, msgEl, Label.success
      console.log msg
    error: (err) -> handleError err, msgEl

addMeasurements = ->
  sessionId = getSessionId()
  ehrId = $("#preberiEHRid").val() or ""
  msgEl = $("#dodajMeritveVitalnihZnakovSporocilo")
  if ehrId.isNullOrEmpty?()
    return showMessage "Prosim vnesite zahtevan podatek!", msgEl, Label.warning

  datumInUra = $("#dodajVitalnoDatumInUra").val()
  visina = $("#dodajVitalnoTelesnaVisina").val()
  teza = $("#dodajVitalnoTelesnaTeza").val()
  temperatura = $("#dodajVitalnoTelesnaTemperatura").val()
  sistolicniKrvniTlak = $("#dodajVitalnoKrvniTlakSistolicni").val()
  diastolicniKrvniTlak = $("#dodajVitalnoKrvniTlakDiastolicni").val()
  nasicenostKrviSKisikom = $("#dodajVitalnoNasicenostKrviSKisikom").val()
  merilec = $("#dodajVitalnoMerilec").val()

  podatki =
    "ctx/language": "en"
    "ctx/territory": "SI"
    "ctx/time": datumInUra
    "vital_signs/height_length/any_event/body_height_length": visina
    "vital_signs/body_weight/any_event/body_weight": teza
    "vital_signs/body_temperature/any_event/temperature|magnitude": temperatura
    "vital_signs/body_temperature/any_event/temperature|unit": "°C"
    "vital_signs/blood_pressure/any_event/systolic": sistolicniKrvniTlak
    "vital_signs/blood_pressure/any_event/diastolic": diastolicniKrvniTlak
    "vital_signs/indirect_oximetry:0/spo2|numerator": nasicenostKrviSKisikom

  parametriZahteve =
    "ehrId": ehrId
    "templateId": "Vital Signs"
    "format": "FLAT"
    "committer": merilec

  $.ajaxSetup
    headers:
      "Ehr-Session": sessionId

  $.ajax
    url: "#{baseUrl}/composition?#{$.param parametriZahteve}"
    type: "POST"
    contentType: "application/json"
    data: JSON.stringify podatki
    suceess: (res) ->
      msg = res.meta.href
      showMessage msg, msgEl, Label.success
      console.log msg
    error: (err) -> handleError err, msgEl

readResultsAsync = (sId, url, title, msgEl, successCallback, addResult) ->
  $.ajax
    url: url
    type: "GET"
    headers:
      "Ehr-Session": sId
    success: (res) -> successCallback res, title, msgEl, addResult
    error: (err) -> handleError err, msgEl

readAsyncSuccess = (res, title, msgEl, addResult) ->
  if res.length > 0
    results = """
      <table class="table table-striped table-hover">
        <tr>
          <th>Datum in ura</th>
          <th class="text-right">#{title}</th>
        </tr>
      """
    results += addResult val for key, val of res
    $("#rezultatMeritveVitalnihZnakov").append results + "</table>"
  else
    showMessage "Ni podatkov!", msgEl, Label.warning

readMeasurements = ->
  sessionId = getSessionId()
  ehrId = $("#meritveVitalnihZnakovEHRid").val() or ""
  type = $("#preberiTipZaVitalneZnake").val() or ""
  msgEl = $("#preberiMeritveVitalnihZnakovSporocilo")

  if ehrId.isNullOrEmpty?() or type.isNullOrEmpty?()
    return showMessage "Prosim vnesite zahtevan podatek!", msgEl, Label.warning

  $.ajax
    url: "#{baseUrl}/demographics/ehr/#{ehrId}/party"
    type: "GET"
    headers:
      "Ehr-Session": sessionId
    success: (data) ->
      party = data.party
      el = $("#rezultatMeritveVitalnihZnakov")
      name = "#{party.firstNames} #{party.lastNames}"
      msg = "Pridobivanje podatkov za <b>#{type}</b> bolnika #{name}<b></b>."
      el.html "<br/><span>#{msg}</span><br/><br/>"

      if type is "telesna temperatura"
        url = "#{baseUrl}/view/#{ehrId}/body_temperature"
        title = "Telesna temperatura"
        successHandler = readAsyncSuccess
        addResult = (result) ->
          """<tr>
            <td>#{result.time}</td>
            <td class="text-right">
              #{result.temperature} #{result.unit}
            </td>
          </tr>"""
      else if type is "telesna teža"
        url = "#{baseUrl}/view/#{ehrId}/weight"
        title = "Telesna teža"
        successHandler = readAsyncSuccess
        addResult = (result) ->
          """<tr>
            <td>#{result.time}</td>
            <td class="text-right">
              #{result.weight} #{result.unit}
            </td>
          </tr>"""
      else if type is "telesna temperatura AQL"
        AQL = """
          select
            t/data[at0002]/events[at0003]/time/value as cas,
            t/data[at0002]/events[at0003]/data[at0001]/items[at0004]/value/magnitude as temperatura_vrednost,
            t/data[at0002]/events[at0003]/data[at0001]/items[at0004]/value/units as temperatura_enota
          from EHR e[e/ehr_id/value='#{ehrId}']
          contains OBSERVATION t[openEHR-EHR-OBSERVATION.body_temperature.v1]
          where t/data[at0002]/events[at0003]/data[at0001]/items[at0004]/value/magnitude<35
          order by t/data[at0002]/events[at0003]/time/value desc
          limit 10
        """.replace /(\r\n|\n|\r)/gm, " "
        url = "#{baseUrl}/query?#{$.param "aql": AQL}"
        title = "Telesna temperatura"
        successHandler = (res, title, msgEl, addResult) ->
          if res
            rows= res.resultSet
            results = """
              <table class="table table-striped table-hover">
                <tr>
                  <th>Datum in ura</th>
                  <th class="text-right">#{title}</th>
                </tr>
              """
            results += addResult val for key, val of rows
            $("#rezultatMeritveVitalnihZnakov").append results + "</table>"
          else
            showMessage "Ni podatkov!", msgEl, Label.warning
        addResult = (result) ->
          """<tr>
            <td>#{result.cas}</td>
            <td class="text-right">
              #{result.temperatura_vrednost} #{result.temperatura_enota}
            </td>
          </tr>"""
       readResultsAsync sessionId, url, title, msgEl, successHandler, addResult

# $ ->
#   $("#preberiObstojeciEHR").change ->
#     $("#preberiSporocilo").html ""
#     $("#preberiEHRid").val $(@).val()
#   $("#preberiPredlogoBolnika").change ->
#     $("#kreirajSporocilo").html ""
#     podatki = $(@).val().split ","
#     $("#kreirajIme").val podatki[0]
#     $("#kreirajPriimek").val podatki[1]
#     $("#kreirajDatumRojstva").val podatki[2]
#   $("#preberiObstojeciVitalniZnak").change ->
#     $("#dodajMeritveVitalnihZnakovSporocilo").html ""
#     podatki = $(@).val().split "|"
#     $("#dodajVitalnoEHR").val podatki[0]
#     $("#dodajVitalnoDatumInUra").val podatki[1]
#     $("#dodajVitalnoTelesnaVisina").val podatki[2]
#     $("#dodajVitalnoTelesnaTeza").val podatki[3]
#     $("#dodajVitalnoTelesnaTemperatura").val podatki[4]
#     $("#dodajVitalnoKrvniTlakSistolicni").val podatki[5]
#     $("#dodajVitalnoKrvniTlakDiastolicni").val podatki[6]
#     $("#dodajVitalnoNasicenostKrviSKisikom").val podatki[7]
#     $("#dodajVitalnoMerilec").val podatki[8]
#   $("#preberiEhrIdZaVitalneZnake").change ->
#     $("#preberiMeritveVitalnihZnakovSporocilo").html ""
#     $("#rezultatMeritveVitalnihZnakov").html ""
#     $("#meritveVitalnihZnakovEHRid").val $(@).val()
