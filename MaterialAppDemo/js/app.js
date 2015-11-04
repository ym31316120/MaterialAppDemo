/**
 *
 */
var app = angular.module('myApp', ['ngMaterial', 'ngRoute']);
app.controller('ButtonCtrl', function($scope) {
    $scope.title1 = 'Button';
    $scope.title4 = 'Warn';
    $scope.isDisabled = true;
    $scope.googleUrl = 'http://google.com';
    $scope.gobackhy = function(event){
        console.log("goback");
        history.back();
    };
});
app.config(['$routeProvider',
function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl : 'pages/uilist.html',
        controller : 'ListCtrl'
    }).when('/list/autocomplete', {
        templateUrl : 'pages/autocomplete.html',
        controller : 'ButtonCtrl'
    }).otherwise({
        redirectTo : '/'
    });
}]);



app.controller('ListCtrl', function($scope,$location, $mdDialog) {

    $scope.uilist = [{
        name : 'AutoComplete',
        img : 'img/angular-logo.svg',
        newMessage : true,
        url : '/list/autocomplete'
    }, {
        name : 'Bottom Sheet',
        img : 'img/angular-logo.svg',
        newMessage : true,
        url : '#'
    }, {
        name : 'Button',
        img : 'img/angular-logo.svg',
        newMessage : true,
        url : '#'
    }, {
        name : 'Card',
        img : 'img/angular-logo.svg',
        newMessage : true,
        url : '#'
    }, {
        name : 'CheckBox',
        img : 'img/angular-logo.svg',
        newMessage : true,
        url : '#'
    }, {
        name : 'Chips',
        img : 'img/angular-logo.svg',
        newMessage : true,
        url : '#'
    }, {
        name : 'Content',
        img : 'img/angular-logo.svg',
        newMessage : true,
        url : '#'
    }, {
        name : 'Datepicker',
        img : 'img/angular-logo.svg',
        newMessage : true,
        url : '#'
    }, {
        name : 'Dialog',
        img : 'img/angular-logo.svg',
        newMessage : true,
        url : '#'
    }, {
        name : 'Divider',
        img : 'img/angular-logo.svg',
        newMessage : true,
        url : '#'
    }, {
        name : 'FAB Speed Dial',
        img : 'img/angular-logo.svg',
        newMessage : true,
        url : '#'
    }, {
        name : 'FAB Toolbar',
        img : 'img/angular-logo.svg',
        newMessage : true,
        url : '#'
    }, {
        name : 'Grid List',
        img : 'img/angular-logo.svg',
        newMessage : true,
        url : '#'
    }, {
        name : 'Icon',
        img : 'img/angular-logo.svg',
        newMessage : true,
        url : '#'
    }, {
        name : 'Input',
        img : 'img/angular-logo.svg',
        newMessage : true,
        url : '#'
    }, {
        name : 'List',
        img : 'img/angular-logo.svg',
        newMessage : true,
        url : '#'
    }, {
        name : 'Menu',
        img : 'img/angular-logo.svg',
        newMessage : true,
        url : '#'
    }, {
        name : 'Menu Bar',
        img : 'img/angular-logo.svg',
        newMessage : true,
        url : '#'
    }, {
        name : 'Progress Circular',
        img : 'img/angular-logo.svg',
        newMessage : true,
        url : '#'
    }, {
        name : 'Progress Linear',
        img : 'img/angular-logo.svg',
        newMessage : true,
        url : '#'
    }, {
        name : 'Radio Button',
        img : 'img/angular-logo.svg',
        newMessage : true,
        url : '#'
    }, {
        name : 'Select',
        img : 'img/angular-logo.svg',
        newMessage : true,
        url : '#'
    }, {
        name : 'Sidenav',
        img : 'img/angular-logo.svg',
        newMessage : true,
        url : '#'
    }, {
        name : 'Slider',
        img : 'img/angular-logo.svg',
        newMessage : true,
        url : '#'
    }, {
        name : 'Subheader',
        img : 'img/angular-logo.svg',
        newMessage : true,
        url : '#'
    }, {
        name : 'Swipe',
        img : 'img/angular-logo.svg',
        newMessage : true,
        url : '#'
    }, {
        name : 'Switch',
        img : 'img/angular-logo.svg',
        newMessage : true,
        url : '#'
    }, {
        name : 'Tabs',
        img : 'img/angular-logo.svg',
        newMessage : true,
        url : '#'
    }, {
        name : 'Toast',
        img : 'img/angular-logo.svg',
        newMessage : true,
        url : '#'
    }, {
        name : 'Toolbar',
        img : 'img/angular-logo.svg',
        newMessage : true,
        url : '#'
    }, {
        name : 'Tooltip',
        img : 'img/angular-logo.svg',
        newMessage : true,
        url : '#'
    }, {
        name : 'Virtual Repeat',
        img : 'img/angular-logo.svg',
        newMessage : true,
        url : '#'
    }, {
        name : 'Whiteframe',
        img : 'img/angular-logo.svg',
        newMessage : true,
        url : '#'
    }];
    // $scope.uilist = [
    // { name: 'AutoComplete', img: 'img/angular-logo.svg', newMessage: true, url:'#' },
    // { name: 'Bottom Sheet', img: 'img/angular-logo.svg', newMessage: true, url:'#' }
    //
    // ];
    $scope.goToUrl = function(url, event) {
        $location.path(url);
        // $mdDialog.show(
        // $mdDialog.alert()
        // .title('Navigating')
        // .content('Inspect ' + person)
        // .ariaLabel('Person inspect demo')
        // .ok('Neat!')
        // .targetEvent(event)
        // );
    };
    $scope.navigateTo = function(event) {
        console.log("helool");
        // $mdDialog.show($mdDialog.alert().title('Navigating').content('Imagine being taken to ' + to).ariaLabel('Navigation demo').ok('Neat!').targetEvent(event));
    };
    $scope.doSecondaryAction = function(event) {
        $mdDialog.show($mdDialog.alert().title('Secondary Action').content('Secondary actions can be used for one click actions').ariaLabel('Secondary click demo').ok('Neat!').targetEvent(event));
    };
});
