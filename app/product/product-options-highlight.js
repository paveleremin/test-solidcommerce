'use strict';

angular.module('app.ProductOptions')
    .filter('highlight', function($sce) {
        return function(text, phrase) {
            text = text.replace(
                new RegExp('(' + phrase + ')', 'gi'),
                '<span class="highlight">$1</span>'
            );

            return $sce.trustAsHtml(text);
        };
    })
;
