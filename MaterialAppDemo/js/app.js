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
        controller : 'ButtonCtrl',
        resolve:{
            'ButtonServices':['$route',function($route){
                
            }]
        }
    }).when('/list/bottomsheet', {
        templateUrl : 'pages/bottomsheet.html',
        controller : 'BottomSheetExample',
        resolve:{
            'ButtonServices':['$route',function($route){
                
            }]
        }
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
        url : '/list/bottomsheet'
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

app.config(function($mdIconProvider) {
    $mdIconProvider
      .icon('share-arrow', 'img/icons/share-arrow.svg', 24)
      .icon('upload', 'img/icons/upload.svg', 24)
      .icon('copy', 'img/icons/copy.svg', 24)
      .icon('print', 'img/icons/print.svg', 24)
      .icon('hangout', 'img/icons/hangout.svg', 24)
      .icon('mail', 'img/icons/mail.svg', 24)
      .icon('message', 'img/icons/message.svg', 24)
      .icon('copy2', 'img/icons/copy2.svg', 24)
      .icon('facebook', 'img/icons/facebook.svg', 24)
      .icon('twitter', 'img/icons/twitter.svg', 24);
  })
.controller('BottomSheetExample', function($scope, $timeout, $mdBottomSheet, $mdToast) {
  $scope.alert = '';
  $scope.title = "BottomSheet";
  $scope.gobackhy = function(event){
        console.log("goback");
        history.back();
    };
  $scope.showListBottomSheet = function($event) {
    $scope.alert = '';
    $mdBottomSheet.show({
      templateUrl: 'pages/bottom-sheet-list-template.html',
      controller: 'ListBottomSheetCtrl',
      targetEvent: $event
    }).then(function(clickedItem) {
      $scope.alert = clickedItem['name'] + ' clicked232!';
    });
  };
  $scope.showGridBottomSheet = function($event) {
    $scope.alert = '';
    $mdBottomSheet.show({
      templateUrl: 'pages/bottom-sheet-grid-template.html',
      controller: 'GridBottomSheetCtrl',
      clickOutsideToClose: false,
      targetEvent: $event
    }).then(function(clickedItem) {
      $mdToast.show(
            $mdToast.simple()
              .content(clickedItem['name'] + ' clicked23!')
              .position('top right')
              .hideDelay(1500)
          );
    });
  };
})
.controller('ListBottomSheetCtrl', function($scope, $mdBottomSheet) {
  $scope.items = [
    { name: 'Share', icon: 'share-arrow' },
    { name: 'Upload', icon: 'upload' },
    { name: 'Copy', icon: 'copy' },
    { name: 'Print this page', icon: 'print' },
  ];
  $scope.listItemClick = function($index) {
    var clickedItem = $scope.items[$index];
    $mdBottomSheet.hide(clickedItem);
  };
})
.controller('GridBottomSheetCtrl', function($scope, $mdBottomSheet) {
  $scope.items = [
    { name: 'Hangout', icon: 'hangout' },
    { name: 'Mail', icon: 'mail' },
    { name: 'Message', icon: 'message' },
    { name: 'Copy', icon: 'copy2' },
    { name: 'Facebook', icon: 'facebook' },
    { name: 'Twitter', icon: 'twitter' },
  ];
  $scope.listItemClick = function($index) {
    var clickedItem = $scope.items[$index];
    $mdBottomSheet.hide(clickedItem);
  };
})
.run(function($http, $templateCache) {
    var urls = [
      'img/icons/share-arrow.svg',
      'img/icons/upload.svg',
      'img/icons/copy.svg',
      'img/icons/print.svg',
      'img/icons/hangout.svg',
      'img/icons/mail.svg',
      'img/icons/message.svg',
      'img/icons/copy2.svg',
      'img/icons/facebook.svg',
      'img/icons/twitter.svg'
    ];
    angular.forEach(urls, function(url) {
      $http.get(url, {cache: $templateCache});
    });
  });
