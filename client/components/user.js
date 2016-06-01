/**
 * Created by User on 27.05.2016.
 */
(function () {
    'use strict';
    function User(myModel) {
        this.data = myModel.data;
        this.model=myModel;
    }

    angular.module('myApp').component('user', {
        controller: User,
        templateUrl: 'components/user.html',
    });
})();