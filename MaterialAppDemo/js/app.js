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
        controller : 'autoCompleteCtrl',
        resolve:{
            'ButtonServices':['$route',function($route){
                
            }]
        }
    }).when('/list/button', {
        templateUrl : 'pages/button.html',
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
    }).when('/list/card', {
        templateUrl : 'pages/card.html',
        controller : 'cardCtrl',
        resolve:{
            'ButtonServices':['$route',function($route){
                
            }]
        }
    }).when('/list/datePicker', {
        templateUrl : 'pages/datepicker.html',
        controller : 'datePickerCtrl',
        resolve:{
            'ButtonServices':['$route',function($route){
                
            }]
        }
    }).otherwise({
        redirectTo : '/'
    });
}]);

app.controller('cardCtrl',function($scope){
    $scope.imagePath = 'img/washedout.png';
    $scope.title = 'card';
    $scope.gobackhy = function(event){
        console.log("goback");
        history.back();
    };
});

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
        url : '/list/button'
    }, {
        name : 'Card',
        img : 'img/angular-logo.svg',
        newMessage : true,
        url : '/list/card'
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
        url : '/list/datePicker'
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
  
  

app.controller('autoCompleteCtrl', DemoCtrl);
  function DemoCtrl ($timeout, $q, $log,$scope) {
    $scope.title="autoComplete";
    $scope.gobackhy = function(event){
        history.back();
    };
    var self = this;
    self.simulateQuery = false;
    self.isDisabled    = false;
    // list of `state` value/display objects
    self.states        = loadAll();
    self.querySearch   = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange   = searchTextChange;
    self.newState = newState;
    function newState(state) {
      alert("Sorry! You'll need to create a Constituion for " + state + " first!");
    };
    // ******************************
    // Internal methods
    // ******************************
    /**
     * Search for states... use $timeout to simulate
     * remote dataservice call.
     */
    function querySearch (query) {
      var results = query ? self.states.filter( createFilterFor(query) ) : self.states,
          deferred;
      if (self.simulateQuery) {
        deferred = $q.defer();
        $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
        return deferred.promise;
      } else {
        return results;
      }
    };
    function searchTextChange(text) {
      $log.info('Text changed to ' + text);
    };
    function selectedItemChange(item) {
      $log.info('Item changed to ' + JSON.stringify(item));
    };
    /**
     * Build `states` list of key/value pairs
     */
    function loadAll() {
      var allStates = 'Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware,\
              Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana,\
              Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana,\
              Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York, North Carolina,\
              North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina,\
              South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia,\
              Wisconsin, Wyoming';
      return allStates.split(/, +/g).map( function (state) {
        return {
          value: state.toLowerCase(),
          display: state
        };
      });
    };
    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(state) {
        return (state.value.indexOf(lowercaseQuery) === 0);
      };
    };
  };
app.controller('datePickerCtrl', function($scope) {
  $scope.myDate = new Date();
   $scope.title = 'datePicker';
    $scope.gobackhy = function(event){
        console.log("goback");
        history.back();
    };
  $scope.minDate = new Date(
      $scope.myDate.getFullYear(),
      $scope.myDate.getMonth() - 2,
      $scope.myDate.getDate());
  $scope.maxDate = new Date(
      $scope.myDate.getFullYear(),
      $scope.myDate.getMonth() + 2,
      $scope.myDate.getDate());
      
});