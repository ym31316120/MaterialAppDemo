var animateApp = angular.module('animateApp', ['ngRoute', 'ngAnimate']);

animateApp.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'pages/animation_home.html',
            controller: 'mainController'
        })
        .when('/about', {
            templateUrl: 'pages/animation_about.html',
            controller: 'aboutController'
        })
        .when('/contact', {
            templateUrl: 'pages/animation_contact.html',
            controller: 'contactController'
        });

});

animateApp.controller('mainController', function($scope) {
    $scope.pageClass = 'page-home';
});

animateApp.controller('aboutController', function($scope) {
    $scope.pageClass = 'page-about';
});

animateApp.controller('contactController', function($scope) {
    $scope.pageClass = 'page-contact';
});