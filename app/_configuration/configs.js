'use strict';

angular.module('app.configs', [])
    .config(function($urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
    })
    .config(function($datepickerProvider) {
        $datepickerProvider.defaults.iconLeft = 'fa fa-chevron-left';
        $datepickerProvider.defaults.iconRight = 'fa fa-chevron-right';
    })
;
