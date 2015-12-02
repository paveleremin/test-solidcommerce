'use strict';

(function(angular) {

    var Ctrl = function($scope, options) {
        var ctrl = this;

        ctrl.options = angular.copy(options);
        ctrl.search = '';

        ctrl.toggleAll = function(block, state) {
           angular.forEach(block.options, function(options) {
               options.selected = state;
           });
        };

        // I chouse $watch instead of "options | filter"
        // in the view, because of perfomance
        $scope.$watch(function() {
            return ctrl.search;
        }, function(n, o) {
            if (n === o) return;

            var filteredOptions = angular.copy(options);
            if (n) {
                n = n.toLowerCase();
                filteredOptions = filteredOptions.filter(function(block) {
                    var options = block.options.filter(function(option) {
                        return option.title.toLowerCase().indexOf(n) != -1;
                    });
                    block.options = options;
                    return options.length;
                });
            }
            ctrl.options = filteredOptions;
        });
    };

    Ctrl.resolve = {
        /*@ngInject*/
        options: function($http) {
            return $http
                .get('product/options.json')
                .then(function(response) {
                    return response.data;
                });
        }
    };

    // INIT MODULE
    var module = angular.module('app.ProductOptions', []);

    // INIT CONTROLLER
    module.controller('ProductOptionsCtrl', Ctrl);

    // INIT ROUTE
    module.config(function($stateProvider) {
        $stateProvider.state('product-options', {
            url: '/',
            templateUrl: 'product/product-options.html',
            controller: Ctrl,
            resolve: Ctrl.resolve,
            controllerAs: 'ctrl'
        });
    });

})(angular);
