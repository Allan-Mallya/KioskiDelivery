//angular.module('starter', ['ionic'])
var app = angular.module('client', []);


function processorder() {

app.config(function ($httpProvider) {
  //uncommenting the following line makes GET requests fail as well
  //$httpProvider.defaults.headers.common['Access-Control-Allow-Headers'] = '*';
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

app.controller('MainCtrl', function($scope, $http) {
  var baseUrl = 'http://localhost:8080/server.php'

  $scope.response = 'Response goes here';

  $scope.sendRequest = function() {
    $http({
      method: 'GET',
      url: baseUrl + '/get'
    }).then(function successCallback(response) {
      $scope.response = response.data.response;
    }, function errorCallback(response) { });
  };

  $scope.sendPost = function() {
    $http.post(baseUrl + '/post', {post: 'data from client', withCredentials: true })
    .success(function(data, status, headers, config) {
      console.log(status);
    })
    .error(function(data, status, headers, config) {
      console.log('FAILED');
    });
  }
});



}