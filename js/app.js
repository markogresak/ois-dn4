'use strict';
var App;

App = angular.module('app', ['ngRoute', 'app.controllers']);

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

/* Controllers */
angular.module('app.controllers', []).controller('AppCtrl', [
  '$scope', '$location', '$resource', '$rootScope', function($scope, $location, $resource, $rootScope) {
    $scope.$location = $location;
    $scope.$watch('$location.path()', function(path) {
      return $scope.activeNavId = path || '/';
    });
    return $scope.getClass = function(id) {
      if ($scope.activeNavId.substring(0, id.length) === id) {
        return 'active';
      } else {
        return '';
      }
    };
  }
]).controller('MyCtrl1', [
  '$scope', function($scope) {
    return $scope.onePlusOne = 2;
  }
]).controller('MyCtrl2', [
  '$scope', function($scope) {
    return $scope;
  }
]).controller('TodoCtrl', [
  '$scope', function($scope) {
    $scope.todos = [
      {
        text: "learn angular",
        done: true
      }, {
        text: "build an angular app",
        done: false
      }
    ];
    $scope.addTodo = function() {
      $scope.todos.push({
        text: $scope.todoText,
        done: false
      });
      return $scope.todoText = "";
    };
    $scope.remaining = function() {
      var count;
      count = 0;
      angular.forEach($scope.todos, function(todo) {
        return count += (todo.done ? 0 : 1);
      });
      return count;
    };
    return $scope.archive = function() {
      var oldTodos;
      oldTodos = $scope.todos;
      $scope.todos = [];
      return angular.forEach(oldTodos, function(todo) {
        if (!todo.done) {
          return $scope.todos.push(todo);
        }
      });
    };
  }
]);
;'use strict';
var getInitials, getObj, randomName;

getInitials = function(name) {
  var first, last, namesArray;
  namesArray = name.trim().split(' ');
  first = namesArray[0], last = namesArray[namesArray.length - 1];
  return ("" + first[0] + (namesArray.length > 1 ? last[0] : "")).toUpperCase();
};

randomName = function() {
  var chars, i, len;
  len = Math.round(Math.random() * 15 + 5);
  chars = " abcdefghijklmnopqrstuvwxyz";
  return ((function() {
    var _i, _results;
    _results = [];
    for (i = _i = 1; 1 <= len ? _i <= len : _i >= len; i = 1 <= len ? ++_i : --_i) {
      _results.push(chars[Math.round(Math.random() * chars.length - 1)]);
    }
    return _results;
  })()).join('');
};

getObj = function() {
  var obj;
  obj = {
    name: randomName(),
    measurements: {
      weight: {
        value: Math.round(Math.random() * 50 + 50),
        unit: 'kg'
      },
      height: {
        value: Math.round(Math.random() * 50 + 150),
        unit: 'cm'
      },
      bmi: {
        value: Math.round(Math.random() * 15 + 20),
        unit: 'kg/m2'
      },
      heartRate: {
        value: Math.round(Math.random() * 50 + 50),
        unit: 'bpm'
      }
    }
  };
  obj.initials = getInitials(obj.name);
  return obj;
};

angular.module('app.controllers', []).controller('PatientsListController', function($scope) {
  var i, _i, _results;
  $scope.patients = [];
  _results = [];
  for (i = _i = 1; _i <= 10; i = ++_i) {
    _results.push($scope.patients.push(getObj()));
  }
  return _results;
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
;
//# sourceMappingURL=app.js.map