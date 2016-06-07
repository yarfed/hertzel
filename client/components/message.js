/**
 * Created by User on 05.06.2016.
 */
(function () {
    'use strict';
    function Message(myModel, $http) {
        this.data = myModel.data;
        this.$http = $http;
        this.model = myModel;
    }

    angular.module('myApp').component('message', {
        controller: Message,
        templateUrl: 'components/message.html',
        bindings: {
            message: '<'
        }
    });
})();