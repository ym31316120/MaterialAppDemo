/**
 * 
 */
var app = angular.module('myApp',['ngMaterial']);
app.controller('TitleController',function($scope){
    $scope.title = "Material AngularJs"
});

app.controller('ListCtrl', function($scope, $mdDialog) {
  
  $scope.uilist = [
    { name: 'AutoComplete', img: 'img/angular-logo.svg', newMessage: true, url:'#' },
    { name: 'Bottom Sheet', img: 'img/angular-logo.svg', newMessage: true, url:'#' },
    { name: 'Button', img: 'img/angular-logo.svg', newMessage: true, url:'#' },
    { name: 'Card', img: 'img/angular-logo.svg', newMessage: true, url:'#' },
    { name: 'CheckBox', img: 'img/angular-logo.svg', newMessage: true, url:'#' },
    { name: 'Chips', img: 'img/angular-logo.svg', newMessage: true, url:'#' },
    { name: 'Content', img: 'img/angular-logo.svg', newMessage: true, url:'#' },
    { name: 'Datepicker', img: 'img/angular-logo.svg', newMessage: true, url:'#' },
    { name: 'Dialog', img: 'img/angular-logo.svg', newMessage: true, url:'#' },
    { name: 'Divider', img: 'img/angular-logo.svg', newMessage: true, url:'#' },
    { name: 'FAB Speed Dial', img: 'img/angular-logo.svg', newMessage: true, url:'#' },
    { name: 'FAB Toolbar', img: 'img/angular-logo.svg', newMessage: true, url:'#' },
    { name: 'Grid List', img: 'img/angular-logo.svg', newMessage: true, url:'#' },
    { name: 'Icon', img: 'img/angular-logo.svg', newMessage: true, url:'#' },
    { name: 'Input', img: 'img/angular-logo.svg', newMessage: true, url:'#' },
    { name: 'List', img: 'img/angular-logo.svg', newMessage: true, url:'#' },
    { name: 'Menu', img: 'img/angular-logo.svg', newMessage: true, url:'#' },
    { name: 'Menu Bar', img: 'img/angular-logo.svg', newMessage: true, url:'#' },
    { name: 'Progress Circular', img: 'img/angular-logo.svg', newMessage: true, url:'#' },
    { name: 'Progress Linear', img: 'img/angular-logo.svg', newMessage: true, url:'#' },
    { name: 'Radio Button', img: 'img/angular-logo.svg', newMessage: true, url:'#' },
    { name: 'Select', img: 'img/angular-logo.svg', newMessage: true, url:'#' },
    { name: 'Sidenav', img: 'img/angular-logo.svg', newMessage: true, url:'#' },
    { name: 'Slider', img: 'img/angular-logo.svg', newMessage: true, url:'#' },
    { name: 'Subheader', img: 'img/angular-logo.svg', newMessage: true, url:'#' },
    { name: 'Swipe', img: 'img/angular-logo.svg', newMessage: true, url:'#' },
    { name: 'Switch', img: 'img/angular-logo.svg', newMessage: true, url:'#' },
    { name: 'Tabs', img: 'img/angular-logo.svg', newMessage: true, url:'#' },
    { name: 'Toast', img: 'img/angular-logo.svg', newMessage: true, url:'#' },
    { name: 'Toolbar', img: 'img/angular-logo.svg', newMessage: true, url:'#' },
    { name: 'Tooltip', img: 'img/angular-logo.svg', newMessage: true, url:'#' },
    { name: 'Virtual Repeat', img: 'img/angular-logo.svg', newMessage: true, url:'#' },
    { name: 'Whiteframe', img: 'img/angular-logo.svg', newMessage: true, url:'#' }
  ];
  $scope.goToPerson = function(person, event) {
    // $mdDialog.show(
      // $mdDialog.alert()
        // .title('Navigating')
        // .content('Inspect ' + person)
        // .ariaLabel('Person inspect demo')
        // .ok('Neat!')
        // .targetEvent(event)
    // );
  };
  $scope.navigateTo = function(to, event) {
    $mdDialog.show(
      $mdDialog.alert()
        .title('Navigating')
        .content('Imagine being taken to ' + to)
        .ariaLabel('Navigation demo')
        .ok('Neat!')
        .targetEvent(event)
    );
  };
  $scope.doSecondaryAction = function(event) {
    $mdDialog.show(
      $mdDialog.alert()
        .title('Secondary Action')
        .content('Secondary actions can be used for one click actions')
        .ariaLabel('Secondary click demo')
        .ok('Neat!')
        .targetEvent(event)
    );
  };
});
