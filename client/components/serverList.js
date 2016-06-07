/**
 * Created by User on 30.05.2016.
 */
(function () {
    'use strict';
    function ServerList(myModel, $state) {
        this.data = myModel.data;
        this.$state = $state;
        this.model = myModel;
    }
    ServerList.prototype.myFilter = function( criteria ,owner) {
        return function( item ) {
            if (criteria=='free'){return item.owner == null||item.owner == undefined;}
            if (criteria=='owner'||criteria=='my'){return item.owner == owner;}
            return true;
        };
    };
    angular.module('myApp').component('serverList', {
        controller: ServerList,
        templateUrl: 'components/serverList.html',

    });
})();