var angular = require('angular');
require('bootstrap')

var app = angular.module('johnApp', [
  require('angular-route'),
  require('angular-bootstrap-npm')
]);

app.constant('VERSION', require('../../package.json').version);

require('./service');
require('./controller');

app.config(function($routeProvider) {

  $routeProvider.when('/', {
    templateUrl: 'app/views/home.html',
    controller: 'HomeCtrl',
  })
  .when('/project', {
    templateUrl: 'app/views/project.html',
    controller: 'ProjectCtrl',
  })
  .when('/contact', {
    templateUrl: 'app/views/contact.html',
    controller: 'ContactCtrl',
  })
  .otherwise({
    redirectTo: '/',
  });
});
