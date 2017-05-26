// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

angular.module('starter', ['ionic', 'starter.controller', 'starter.services', 'ngCordova', 'starter.globalcontroller', 'starter.keypad', 'ion-floating-menu', 'starter.reportscontroller', 'starter.settingscontroller', 'ionic-sidetabs', 'divBlur', 'draggable', 'tabSlideBox', 'starter.filter', 'angularMoment']).run(function($ionicPlatform, $cordovaSQLite, $rootScope, $q, $ionicLoading, settingService, salesService, dbService, $state) {

    $ionicPlatform.ready(function() {
        $rootScope.openDb("newPayUPos1.db", "newPOS1");
    });
})
.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('top');

    $stateProvider.state('Payments', {
        url: '/Settings',
        templateUrl: 'templates/Settings.html'

    }).state('PrinterSetting', {
        url: '/printerSettings',
        templateUrl: 'templates/PrinterSettings.html'

    }).state('PaymentSetting', {
        url: '/paymentSettings',
        templateUrl: 'templates/PaymentSettings.html'

    }).state('Reports', {
        url: '/Reports',
        templateUrl: 'templates/Reports.html'

    }).state('TaxSettings', {
        url: '/TaxSettings',
        controller: 'taxSetting',
        templateUrl: 'templates/TaxSettings.html'

    }).state('inventory', {
        url: '/inventory',

        templateUrl: 'templates/inventoryPage.html'

    }).state('category', {
        url: '/category',

        templateUrl: 'templates/categoryPage.html'

    }).state('product', {
        url: '/product',

        templateUrl: 'templates/productPage.html'

    }).state('home', {
        url: '/home',

        templateUrl: 'templates/homePage.html'

    }).state('billWiseReport', {
        url: '/billWiseReport',

        templateUrl: 'templates/billWiseReport.html'

    })
    .state('salesReport', {
        url: '/salesReport',

        templateUrl: 'templates/salesReport.html'

    })
    .state('itemReport', {
        url: '/itemReport',

        templateUrl: 'templates/itemReport.html'

    })
    .state('editProducts', {
        url: '/editProducts',

        templateUrl: 'templates/editProducts.html'

    })
    .state('passwordChange', {
        url: '/passwordChange',

        templateUrl: 'templates/passwordChange.html'

    })
    .state('billdetails', {
        url: '/billdetails',

        templateUrl: 'templates/BillDetails.html'

    })
    .state('bluetoothsettings', {
        url: '/bluetoothsettings',

        templateUrl: 'templates/bluetoothSettings.html'

    })
    .state('Test1', {
        url: '/Test',
        templateUrl: 'templates/Keypad.html',
    }).state('Splash', {
        url: '/Splash',
        templateUrl: 'templates/Splash.html',
    }).state('tableInfo', {
        url: '/tableInfo',
        templateUrl: 'templates/tableInfo.html',
    }).state('addEditTableInfo', {
        url: '/addEditTableInfo',
        templateUrl: 'templates/addEditTableInfo.html',
    })
    .state('addEditTableSection', {
        url: '/addEditTableSection',
        templateUrl: 'templates/addEditTableSection.html',
    })
    //$urlRouterProvider.otherwise('/Splash');

}).directive('limitChar', function() {
    'use strict';
    return {
        restrict: 'A',
        scope: {
            limit: '=limit',
            ngModel: '=ngModel'
        },
        link: function(scope) {
            scope.$watch('ngModel', function(newValue, oldValue) {
                if (newValue) {
                    var length = newValue.toString().length;
                    if (length > scope.limit) {
                        scope.ngModel = oldValue;
                    }
                }
            });
        }
    };
})

.directive('textarea', function() {
    return {
        restrict: 'E',
        link: function(scope, element, attr) {
            var update = function() {
                element.css("height", "auto");
                var height = element[0].scrollHeight;
                element.css("height", element[0].scrollHeight + "px");
            };
            scope.$watch(attr.ngModel, function() {
                update();
            });
        }
    };
});

 moment.locale('en', {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "%d sec",
    m: "a minute",
    mm: "%d minutes",
    h: "an hour",
    hh: "%d hours",
    d: "a day",
    dd: "%d days",
    M: "a month",
    MM: "%d months",
    y: "a year",
    yy: "%d years"
  }
})