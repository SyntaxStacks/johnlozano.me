var angular = require('angular');
require('bootstrap')

var app = angular.module('johnApp', [
  require('angular-route'),
  require('angular-bootstrap-npm'),
  require('angular-ui-router')
]);

app.constant('VERSION', require('../../package.json').version);

require('./service');
require('./controller');

app.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'app/views/home.html',
      controller: 'HomeCtrl'
    })
    .state('project', {
      url: '/project',
      templateUrl: 'app/views/project.html',
      controller: 'ProjectCtrl'
    })
    .state('contact', {
      url: '/contact', 
      templateUrl: 'app/views/contact.html',
      controller: 'ContactCtrl'
    });
});
