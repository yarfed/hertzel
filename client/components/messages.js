/**
 * Created by User on 05.06.2016.
 */
(function () {
    'use strict';
    function Messages(myModel,$timeout) {
        this.data = myModel.data;
        this.model=myModel;

    }

    angular.module('myApp').component('messages', {
        controller: Messages,
        templateUrl: 'components/messages.html',
    });
})();