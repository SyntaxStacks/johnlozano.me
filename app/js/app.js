var angular = require('angular');
require('angular-route');

var app = angular.module('johnApp', [ 'ngRoute' ]);

app.constant('VERSION', require('../../package.json').version);

require('./service');
require('./controller');

app.config(function($routeProvider) {

  $routeProvider.when('/', {
    templateUrl: 'app/views/home.html',
    controller: 'HomeCtrl',
  })
  // .when('/mao', {
  //   templateUrl: 'views/imprint.html',
  //   controller: 'ImprintCtrl',
  // })
  .otherwise({
    redirectTo: '/',
  });
});
