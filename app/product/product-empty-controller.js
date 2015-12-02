'use strict';

(function(angular) {

    var Ctrl = function() {
    };

    // INIT MODULE
    var module = angular.module('app.ProductEmpty', []);

    // INIT CONTROLLER
    module.controller('ProductEmptyCtrl', Ctrl);

    // INIT ROUTE
    module.config(function($stateProvider) {
        $stateProvider.state('product-empty', {
            url: '/empty-tab',
            templateUrl: 'product/product-empty.html',
            controller: Ctrl,
            controllerAs: 'ctrl'
        });
    });

})(angular);
