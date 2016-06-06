/**
 * Created by User on 30.05.2016.
 */
(function () {
    'use strict';
    function ServerList(myModel,$state) {
        this.data = myModel.data;
        this.$state=$state;
        this.model=myModel;
    }

    angular.module('myApp').component('serverList', {
        controller: ServerList,
        templateUrl: 'components/serverList.html',

    });
})();