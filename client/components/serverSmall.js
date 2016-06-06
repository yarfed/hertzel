/**
 * Created by User on 03.06.2016.
 */
(function () {
    'use strict';
    function ServerSmall(myModel) {
        this.data = myModel.data;

    }

    angular.module('myApp').component('serverSmall', {
        controller: ServerSmall,
        templateUrl: 'components/serverSmall.html',
        bindings: {
            server: '<'
        }
    });
})();