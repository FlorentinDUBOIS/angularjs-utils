(function () {
    'use strict';

    angular
        .module('<your-module>')
        .filter('unsafe', unsafe);

    /* @ngInject */
    function unsafe($sce) {
        return $sce.trustAsHtml;
    }
} ());
