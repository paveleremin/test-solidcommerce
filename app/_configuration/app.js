'use strict';

angular.module('app', [
    // vendors first
    'ui.router',
    'ui.router',
    'mgcrea.ngStrap.datepicker',

    // application modules
    'app.ProductOptions',
    'app.ProductSettings',
    'app.ProductEmpty',

    // configs and providers
    'app.configs'
])
;
