/**
 * Created by User on 30.05.2016.
 */
(function () {
    'use strict';
    function ServerList(myModel) {
        this.data = myModel.data;
    }

    angular.module('myApp').component('serverList', {
        controller: ServerList,
        templateUrl: 'components/serverList.html',

    });
})();