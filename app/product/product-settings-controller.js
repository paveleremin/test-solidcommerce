'use strict';

(function(angular) {

    var Ctrl = function() {
        var ctrl = this;

        ctrl.settings = {
            text: '',
            checkbox: false,
            radio: 'radio1',
            date: new Date(),
            select: ''
        };

        ctrl.selectOptions = [{
            id: 123,
            title: 'Title for id #123'
        }, {
            id: 456,
            title: 'Title for id #456'
        }];
    };

    // INIT MODULE
    var module = angular.module('app.ProductSettings', []);

    // INIT CONTROLLER
    module.controller('ProductOptionsCtrl', Ctrl);

    // INIT ROUTE
    module.config(function($stateProvider) {
        $stateProvider.state('product-settings', {
            url: '/settings',
            templateUrl: 'product/product-settings.html',
            controller: Ctrl,
            controllerAs: 'ctrl'
        });
    });

})(angular);
