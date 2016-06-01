/**
 * Created by User on 27.05.2016.
 */
(function () {
    'use strict';
    function Login($http, $state, myModel) {
        this.$http = $http;
        this.$state = $state;
        this.message = '';
        this.data = myModel.data;
        this.model = myModel;

    }

    Login.prototype.submit = function (e) {
        if (e) e.preventDefault();

        var self = this;
        self.$http.post('api/authenticate/', self.user).then(
            function () {
                self.model.login();
                self.$state.go('app.servers');
            },
            function (res) {
                self.message = res.data.message;
            });
    };

    Login.prototype.register = function () {
        var self = this;
        self.$http.post('api/users', self.user).then(function (res) {
                self.message = res.data.message;
                self.submit();
            },
            function (res) {
                self.message = res.data.message;
            });

    };
    angular.module('myApp').component('login', {
        controller: Login,
        templateUrl: 'components/login.html'
    });
})();