/**
 * Created by User on 01.06.2016.
 */
(function () {
    'use strict';
    function Menu($state) {
        this.$state = $state;
    }

    angular.module('myApp').component('menu', {
        controller: Menu,
        templateUrl: 'components/menu.html',
    });
})();