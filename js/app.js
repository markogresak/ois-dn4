'use strict';
var App;

App = angular.module('app', ['ngRoute']);

App.config([
  '$routeProvider', function($routeProvider) {
    return $routeProvider.when('/patients', {
      templateUrl: 'views/patientsList.html',
      controller: 'PatientsListController'
    }).when('/patients/:ehrid', {
      templateUrl: 'views/patientDetail.html',
      controller: 'PatientDetailController'
    }).otherwise({
      redirectTo: '/patients'
    });
  }
]);
;/* global d3 */

var hArr = [61,68,79,68,67,82,52,89,74,68,73,50,58,81,82,50,60,57,76,79,70,79,
            84,89,70,51,52,90,90,59,58,82,74,57,60,50,89,63,88,67,59,88,79,51,
            58,85,73,74,54,69,53,68,63,78,68,50,61,82,59,79,67,78,77,61,64,71,
            53,51,84,71,64,52,89,51,57,86,50,74,75,64,71,86,59,83,51,63,77,83,
            79,77,65,66,55,88,67,80,80,70,79,53];

var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50
    },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var colors = d3.scale.linear()
            .range([height, 0])
            .range(['#ff0000', '#00ff00']);

var parseDate = d3.time.format('%m/%d/%Y').parse;


var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom');

var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left');

var line = d3.svg.line()
    .x(function(d) {
        'use strict';
        return x(d.date);
    })
    .y(function(d) {
        'use strict';
        return y(d.close);
    });

var svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var curDate = new Date();

function nextDate () {
    'use strict';
    curDate.setDate(curDate.getDate() + 1);
    return curDate.toLocaleDateString();
}

var data = hArr.map(function(d) {
    'use strict';
    return {
        date: parseDate(nextDate()),
        close: d
    };

});

// console.log(data);


x.domain(d3.extent(data, function(d) {
    'use strict';
    return d.date;
}));
// y.domain(d3.extent(data, function(d) {
//     'use strict';
//     return d.close;
// }));
y.domain([
    d3.min(data, function(d) {
        'use strict';
        return d.close;
    }) * 0.95,
    d3.max(data, function(d) {
        'use strict';
        return d.close;
    }) * 1.05
]);

var area = d3.svg.area()
    .x(function(d) {
        'use strict';
        return x(d.date);
    })
    .y0(height)
    .y1(function(d) {
        'use strict';
        return y(d.close);
    });

svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis);

svg.append('g')
    .attr('class', 'y axis')
    .call(yAxis)
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '.71em')
    .style('text-anchor', 'end')
    .text('Heart rate [bpm]');

svg.append("linearGradient")
        .attr("id", "area-gradient")                // change from line to area
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0).attr("y1", y(0))
        .attr("x2", 0).attr("y2", y(200))
    .selectAll("stop")
        .data([
            {offset: "0%", color: "red"},
            {offset: "10%", color: "blue"},
            {offset: "20%", color: "yellow"},
            {offset: "30%", color: "red"},
            {offset: "45%", color: "black"},
            {offset: "55%", color: "black"},
            {offset: "60%", color: "lawngreen"},
            {offset: "100%", color: "lawngreen"}
        ])
    .enter().append("stop")
        .attr("offset", function(d) {
            'use strict';
            return d.offset;
        })
        .attr("stop-color", function(d) {
            'use strict';
            return d.color;
        });

// svg.append('path')
//         .datum(data)
//         .attr('class', 'area')
//         .attr('d', area);

svg.append('path')
    .datum(data)
    .attr('class', 'line')
    .attr('d', line)

;'use strict';
App.controller('PatientDetailController', function($scope, $rootScope, $location, EhrLookup) {
  $rootScope.title = 'Details for name';
  return EhrLookup.getAllData(ehrId, sessionId, function(data) {
    return $scope.patient = data;
  });
});
;'use strict';
App.controller('PatientsListController', function($scope, $rootScope, $location, EhrLookup) {
  var ehrId, ehrIds, sessionId, _i, _len;
  $rootScope.title = 'Patient list';
  ehrIds = ['b931580f-2b05-488b-985b-8d9ffb08ad02', 'd564c6a3-5a43-4fcc-bfa7-9ac76e9673bd', '7b661e12-3a98-21ad-c29e-2dc9f5a3d885'];
  sessionId = EhrLookup.getSessionId();
  $scope.patients = [];
  for (_i = 0, _len = ehrIds.length; _i < _len; _i++) {
    ehrId = ehrIds[_i];
    EhrLookup.getAllData(ehrId, sessionId, function(data) {
      if (!data) {
        return;
      }
      return $scope.patients.push(data);
    });
  }
  $scope.viewPatient = function(key) {
    return $location.path("/patients/" + key);
  };
  return $scope.graphOptionChange = function(val) {
    return console.log("change, " + val);
  };
});
;var Label, addMeasurements, baseUrl, createEHR, getSessionId, handleError, password, queryUrl, readAsyncSuccess, readEHR, readMeasurements, readResultsAsync, showMessage, username;

String.prototype.isNullOrEmpty = function() {
  return this.trim().length === 0;
};

baseUrl = "https://rest.ehrscape.com/rest/v1";

queryUrl = baseUrl + "/query";

username = encodeURIComponent("ois.seminar");

password = encodeURIComponent("ois4fri");

Label = {
  "success": "label-success",
  "warning": "label-warning",
  "danger": "label-danger"
};

getSessionId = function() {
  return $.ajax({
    type: "POST",
    url: "" + baseUrl + "/session?username=" + username + "&password=" + password,
    async: false
  }).responseJSON.sessionId;
};

showMessage = function(msg, element, classes) {
  var allClasses;
  if (classes == null) {
    classes = "";
  }
  if (!element) {
    return;
  }
  allClasses = "obvestilo label fade-in " + classes;
  return $(element).html("<span>" + msg + "</span>").addClass(allClasses);
};

handleError = function(err, msgEl) {
  var msg;
  msg = JSON.parse(err.responseText).userMessage;
  showMessage(msg, msgEl, Label.danger);
  return console.log(msg);
};

createEHR = function() {
  var datum, ime, msgEl, priimek, sessionId;
  sessionId = getSessionId();
  ime = $("#kreirajIme").val() || "";
  priimek = $("#kreirajPriimek").val() || "";
  datum = $("#kreirajDatumRojstva").val() || "";
  msgEl = $("#kreirajSporocilo");
  if ((typeof ime.isNullOrEmpty === "function" ? ime.isNullOrEmpty() : void 0) || (typeof priimek.isNullOrEmpty === "function" ? priimek.isNullOrEmpty() : void 0) || (typeof datum.isNullOrEmpty === "function" ? datum.isNullOrEmpty() : void 0)) {
    return showMessage("Prosim vnesite zahtevane podatke!", msgEl, Label.warning);
  }
  $.ajaxSetup({
    headers: {
      "Ehr-Session": sessionId
    }
  });
  return $.ajax({
    url: "" + baseUrl + "/ehr",
    type: "POST",
    success: function(data) {
      var ehrId, partyData;
      ehrId = data.ehrId;
      partyData = {
        firstNames: ime,
        lastNames: priimek,
        dateOfBirth: datum,
        partyAdditionalInfo: [
          {
            key: "ehrId",
            value: ehrId
          }
        ]
      };
      return $.ajax({
        url: "" + baseUrl + "/demographics/party",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(partyData),
        success: function(party) {
          var msg;
          if (party.action === "CREATE") {
            msg = "Uspešno kreiran EHR '" + ehrId + "'.";
            showMessage(msg, msgEl, Label.success);
            console.log(msg);
            return $("#preberiEHRid").val(ehrId);
          }
        },
        error: function(err) {
          return handleError(err, msgEl);
        }
      });
    }
  });
};

readEHR = function() {
  var ehrId, msgEl, sessionId;
  sessionId = getSessionId();
  ehrId = $("#preberiEHRid").val() || "";
  msgEl = $("#preberiSporocilo");
  if (typeof ehrId.isNullOrEmpty === "function" ? ehrId.isNullOrEmpty() : void 0) {
    return showMessage("Prosim vnesite zahtevan podatek!", msgEl, Label.warning);
  }
  return $.ajax({
    url: "" + baseUrl + "/demographics/ehr/" + ehrId + "/party",
    type: "GET",
    headers: {
      "Ehr-Session": sessionId
    },
    success: function(data) {
      var msg, p;
      p = data.party;
      msg = "Bolnik " + p.firstNames + " " + p.lastNames + ", rojen " + p.dateOfBirth + ".";
      showMessage(msg, msgEl, Label.success);
      return console.log(msg);
    },
    error: function(err) {
      return handleError(err, msgEl);
    }
  });
};

addMeasurements = function() {
  var datumInUra, diastolicniKrvniTlak, ehrId, merilec, msgEl, nasicenostKrviSKisikom, parametriZahteve, podatki, sessionId, sistolicniKrvniTlak, temperatura, teza, visina;
  sessionId = getSessionId();
  ehrId = $("#preberiEHRid").val() || "";
  msgEl = $("#dodajMeritveVitalnihZnakovSporocilo");
  if (typeof ehrId.isNullOrEmpty === "function" ? ehrId.isNullOrEmpty() : void 0) {
    return showMessage("Prosim vnesite zahtevan podatek!", msgEl, Label.warning);
  }
  datumInUra = $("#dodajVitalnoDatumInUra").val();
  visina = $("#dodajVitalnoTelesnaVisina").val();
  teza = $("#dodajVitalnoTelesnaTeza").val();
  temperatura = $("#dodajVitalnoTelesnaTemperatura").val();
  sistolicniKrvniTlak = $("#dodajVitalnoKrvniTlakSistolicni").val();
  diastolicniKrvniTlak = $("#dodajVitalnoKrvniTlakDiastolicni").val();
  nasicenostKrviSKisikom = $("#dodajVitalnoNasicenostKrviSKisikom").val();
  merilec = $("#dodajVitalnoMerilec").val();
  podatki = {
    "ctx/language": "en",
    "ctx/territory": "SI",
    "ctx/time": datumInUra,
    "vital_signs/height_length/any_event/body_height_length": visina,
    "vital_signs/body_weight/any_event/body_weight": teza,
    "vital_signs/body_temperature/any_event/temperature|magnitude": temperatura,
    "vital_signs/body_temperature/any_event/temperature|unit": "°C",
    "vital_signs/blood_pressure/any_event/systolic": sistolicniKrvniTlak,
    "vital_signs/blood_pressure/any_event/diastolic": diastolicniKrvniTlak,
    "vital_signs/indirect_oximetry:0/spo2|numerator": nasicenostKrviSKisikom
  };
  parametriZahteve = {
    "ehrId": ehrId,
    "templateId": "Vital Signs",
    "format": "FLAT",
    "committer": merilec
  };
  $.ajaxSetup({
    headers: {
      "Ehr-Session": sessionId
    }
  });
  return $.ajax({
    url: "" + baseUrl + "/composition?" + ($.param(parametriZahteve)),
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(podatki),
    suceess: function(res) {
      var msg;
      msg = res.meta.href;
      showMessage(msg, msgEl, Label.success);
      return console.log(msg);
    },
    error: function(err) {
      return handleError(err, msgEl);
    }
  });
};

readResultsAsync = function(sId, url, title, msgEl, successCallback, addResult) {
  return $.ajax({
    url: url,
    type: "GET",
    headers: {
      "Ehr-Session": sId
    },
    success: function(res) {
      return successCallback(res, title, msgEl, addResult);
    },
    error: function(err) {
      return handleError(err, msgEl);
    }
  });
};

readAsyncSuccess = function(res, title, msgEl, addResult) {
  var key, results, val;
  if (res.length > 0) {
    results = "<table class=\"table table-striped table-hover\">\n  <tr>\n    <th>Datum in ura</th>\n    <th class=\"text-right\">" + title + "</th>\n  </tr>";
    for (key in res) {
      val = res[key];
      results += addResult(val);
    }
    return $("#rezultatMeritveVitalnihZnakov").append(results + "</table>");
  } else {
    return showMessage("Ni podatkov!", msgEl, Label.warning);
  }
};

readMeasurements = function() {
  var ehrId, msgEl, sessionId, type;
  sessionId = getSessionId();
  ehrId = $("#meritveVitalnihZnakovEHRid").val() || "";
  type = $("#preberiTipZaVitalneZnake").val() || "";
  msgEl = $("#preberiMeritveVitalnihZnakovSporocilo");
  if ((typeof ehrId.isNullOrEmpty === "function" ? ehrId.isNullOrEmpty() : void 0) || (typeof type.isNullOrEmpty === "function" ? type.isNullOrEmpty() : void 0)) {
    return showMessage("Prosim vnesite zahtevan podatek!", msgEl, Label.warning);
  }
  return $.ajax({
    url: "" + baseUrl + "/demographics/ehr/" + ehrId + "/party",
    type: "GET",
    headers: {
      "Ehr-Session": sessionId
    },
    success: function(data) {
      var AQL, addResult, el, msg, name, party, successHandler, title, url;
      party = data.party;
      el = $("#rezultatMeritveVitalnihZnakov");
      name = "" + party.firstNames + " " + party.lastNames;
      msg = "Pridobivanje podatkov za <b>" + type + "</b> bolnika " + name + "<b></b>.";
      el.html("<br/><span>" + msg + "</span><br/><br/>");
      if (type === "telesna temperatura") {
        url = "" + baseUrl + "/view/" + ehrId + "/body_temperature";
        title = "Telesna temperatura";
        successHandler = readAsyncSuccess;
        addResult = function(result) {
          return "<tr>\n  <td>" + result.time + "</td>\n  <td class=\"text-right\">\n    " + result.temperature + " " + result.unit + "\n  </td>\n</tr>";
        };
      } else if (type === "telesna teža") {
        url = "" + baseUrl + "/view/" + ehrId + "/weight";
        title = "Telesna teža";
        successHandler = readAsyncSuccess;
        addResult = function(result) {
          return "<tr>\n  <td>" + result.time + "</td>\n  <td class=\"text-right\">\n    " + result.weight + " " + result.unit + "\n  </td>\n</tr>";
        };
      } else if (type === "telesna temperatura AQL") {
        AQL = ("select\n  t/data[at0002]/events[at0003]/time/value as cas,\n  t/data[at0002]/events[at0003]/data[at0001]/items[at0004]/value/magnitude as temperatura_vrednost,\n  t/data[at0002]/events[at0003]/data[at0001]/items[at0004]/value/units as temperatura_enota\nfrom EHR e[e/ehr_id/value='" + ehrId + "']\ncontains OBSERVATION t[openEHR-EHR-OBSERVATION.body_temperature.v1]\nwhere t/data[at0002]/events[at0003]/data[at0001]/items[at0004]/value/magnitude<35\norder by t/data[at0002]/events[at0003]/time/value desc\nlimit 10").replace(/(\r\n|\n|\r)/gm, " ");
        url = "" + baseUrl + "/query?" + ($.param({
          "aql": AQL
        }));
        title = "Telesna temperatura";
        successHandler = function(res, title, msgEl, addResult) {
          var key, results, rows, val;
          if (res) {
            rows = res.resultSet;
            results = "<table class=\"table table-striped table-hover\">\n  <tr>\n    <th>Datum in ura</th>\n    <th class=\"text-right\">" + title + "</th>\n  </tr>";
            for (key in rows) {
              val = rows[key];
              results += addResult(val);
            }
            return $("#rezultatMeritveVitalnihZnakov").append(results + "</table>");
          } else {
            return showMessage("Ni podatkov!", msgEl, Label.warning);
          }
        };
        addResult = function(result) {
          return "<tr>\n  <td>" + result.cas + "</td>\n  <td class=\"text-right\">\n    " + result.temperatura_vrednost + " " + result.temperatura_enota + "\n  </td>\n</tr>";
        };
      }
      return readResultsAsync(sessionId, url, title, msgEl, successHandler, addResult);
    }
  });
};
;'use strict';
var calculateAge, escapeAql, getInitials;

escapeAql = function(multilineAql) {
  return multilineAql.replace(/(\r\n|\n|\r)/gm, " ");
};

calculateAge = function(dateOfBirth) {
  return Math.abs(new Date(Date.now() - dateOfBirth.getTime()).getUTCFullYear() - 1970);
};

getInitials = function(name) {
  var first, last, namesArray;
  namesArray = name.trim().split(' ');
  first = namesArray[0], last = namesArray[namesArray.length - 1];
  return ("" + first[0] + (namesArray.length > 1 ? last[0] : "")).toUpperCase();
};

App.factory('EhrLookup', function() {
  var baseUrl, factoryObj, password, queryUrl, username;
  baseUrl = "https://rest.ehrscape.com/rest/v1";
  queryUrl = baseUrl + "/query";
  username = encodeURIComponent("ois.seminar");
  password = encodeURIComponent("ois4fri");
  factoryObj = {};
  factoryObj.getSessionId = function() {
    return $.ajax({
      type: "POST",
      url: "" + baseUrl + "/session?username=" + username + "&password=" + password,
      async: false
    }).responseJSON.sessionId;
  };
  factoryObj.aqlQuery = function(aql, sessionId, callback) {
    return $.ajax({
      url: "" + baseUrl + "/query?" + ($.param({
        'aql': aql
      })),
      type: 'GET',
      headers: {
        "Ehr-Session": sessionId
      },
      success: callback
    });
  };
  factoryObj.lastValue = function(select, contains, ehrId, sessionId, callback) {
    var aql;
    aql = escapeAql("select\n" + select + "\nfrom EHR e[e/ehr_id/value='" + ehrId + "']\ncontains OBSERVATION " + contains + "\norder by t/data[at0002]/events[at0003]/time/value desc\nlimit 1");
    return factoryObj.aqlQuery(aql, sessionId, callback);
  };
  factoryObj.getLastWeight = function(ehrId, sessionId, callback) {
    var contains, select;
    select = "t/data[at0002]/events[at0003]/data[at0001]/items[at0004, 'Body weight']/value/magnitude as value," + "t/data[at0002]/events[at0003]/data[at0001]/items[at0004, 'Body weight']/value/units as unit";
    contains = "t[openEHR-EHR-OBSERVATION.body_weight.v1]";
    return factoryObj.lastValue(select, contains, ehrId, sessionId, callback);
  };
  factoryObj.getLastHeight = function(ehrId, sessionId, callback) {
    var contains, select;
    select = "t/data[at0001]/events[at0002]/data[at0003]/items[at0004, 'Body Height/Length']/value/magnitude as value";
    contains = "t[openEHR-EHR-OBSERVATION.height.v1]";
    return factoryObj.lastValue(select, contains, ehrId, sessionId, callback);
  };
  factoryObj.getLastTemperature = function(ehrId, sessionId, callback) {
    var contains, select;
    select = "t/data[at0002]/events[at0003]/data[at0001]/items[at0004]/value/magnitude as value," + "t/data[at0002]/events[at0003]/data[at0001]/items[at0004]/value/units as unit";
    contains = "t[openEHR-EHR-OBSERVATION.body_temperature.v1]";
    return factoryObj.lastValue(select, contains, ehrId, sessionId, callback);
  };
  factoryObj.getLastPulse = function(ehrId, sessionId, callback) {
    var contains, select;
    select = "t/data[at0002]/events[at0003]/data[at0001]/items[at0004]/value/magnitude as value";
    contains = "t[openEHR-EHR-OBSERVATION.heart_rate-pulse.v1]";
    return factoryObj.lastValue(select, contains, ehrId, sessionId, callback);
  };
  factoryObj.getPersonalData = function(ehrId, sessionId, callback) {
    var url;
    url = "" + baseUrl + "/demographics/ehr/" + ehrId + "/party";
    return $.ajax({
      url: "" + baseUrl + "/demographics/ehr/" + ehrId + "/party",
      type: "GET",
      headers: {
        "Ehr-Session": sessionId
      },
      success: function(data) {
        var dateOfBirth, fullName, partyData;
        partyData = data.party;
        dateOfBirth = new Date(partyData.dateOfBirth);
        fullName = "" + partyData.firstNames + " " + partyData.lastNames;
        return callback({
          name: fullName,
          initials: getInitials(fullName),
          dateOfBirth: dateOfBirth,
          age: calculateAge(dateOfBirth),
          gender: partyData.gender,
          ehrId: ehrId
        });
      }
    });
  };
  factoryObj.getAllData = function(ehrId, sessionId, callback) {
    var data, doCallback, isDataDone, isDone;
    isDone = function(data) {
      var k, v;
      if (data === null) {
        return false;
      }
      for (k in data) {
        v = data[k];
        if (v === null) {
          return false;
        }
      }
      return true;
    };
    isDataDone = function(data) {
      return isDone(data.person) && isDone(data.measurements.weight) && isDone(data.measurements.height) && isDone(data.measurements.bmi) && isDone(data.measurements.pulse);
    };
    doCallback = function(data, cb) {
      if (!isDataDone(data)) {
        return;
      }
      return cb(data);
    };
    data = {
      person: {
        name: null,
        initials: null,
        dateOfBirth: null,
        age: null,
        gender: null,
        ehrId: null
      },
      measurements: {
        weight: {
          value: null,
          unit: null
        },
        height: {
          value: null,
          unit: null
        },
        temperature: {
          value: null,
          unit: null
        },
        pulse: {
          value: null,
          unit: null
        }
      }
    };
    factoryObj.getPersonalData(ehrId, sessionId, function(res) {
      data.person = res;
      return doCallback(data, callback);
    });
    factoryObj.getLastWeight(ehrId, sessionId, function(res) {
      var d;
      if (!res) {
        return;
      }
      d = res.resultSet[0];
      data.measurements.weight.value = d.value;
      data.measurements.weight.unit = d.unit || 'kg';
      return doCallback(data, callback);
    });
    factoryObj.getLastHeight(ehrId, sessionId, function(res) {
      var d;
      if (!res) {
        return;
      }
      d = res.resultSet[0];
      data.measurements.height.value = d.value;
      data.measurements.height.unit = d.unit || 'cm';
      return doCallback(data, callback);
    });
    factoryObj.getLastTemperature(ehrId, sessionId, function(res) {
      var d;
      if (!res) {
        return;
      }
      d = res.resultSet[0];
      data.measurements.temperature.value = d.value;
      data.measurements.temperature.unit = d.unit || '°C';
      return doCallback(data, callback);
    });
    return factoryObj.getLastPulse(ehrId, sessionId, function(res) {
      var d;
      if (!res) {
        return;
      }
      d = res.resultSet[0];
      data.measurements.pulse.value = d.value;
      data.measurements.pulse.unit = d.unit || 'bpm';
      return doCallback(data, callback);
    });
  };
  return factoryObj;
});
;
//# sourceMappingURL=app.js.map