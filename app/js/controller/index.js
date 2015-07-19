'use strict';

var app = require('angular').module('johnApp');

app.controller('MainCtrl', require('./main'));
app.controller('HomeCtrl', require('./home'));
app.controller('ProjectCtrl', require('./project'));
app.controller('ContactCtrl', require('./contact'));
