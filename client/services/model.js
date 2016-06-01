/**
 * Created by User on 30.05.2016.
 */
(function () {
    'use strict';
    angular.module('myApp').service('myModel', function ($http, $state, $rootScope) {
        this.$http = $http;
        this.$state = $state;
        this.data = {};
        var self = this;
        var socket;

        this.logout = function () {
            self.$http.get('api/logout?r=' + Math.random());
            socket.off();
            socket.disconnect();
            self.$state.go('login');
        };
        this.deleteUser = function () {
            if (confirm('sure?')) {
                self.$http.delete('api/users/' +self.data.user.name).then(function () {
                    self.logout();
                });
            }


        };

        this.login = function () {
            $http.get('api/login?r=' + Math.random()).then(function (res) {
                    self.data.user = res.data;
                    socket = io.connect();
                    socket.on('connect', function () {
                        self.data.user.connected = true;
                        self.getAll();
                        $rootScope.$digest();
                    });

                    socket.on("disconnect", function () {
                        self.data.user.connected = false;
                        $rootScope.$digest();
                    });

                    socket.on('update', function (data) {
                        if (~data.indexOf('users')) {
                            self.getUsers();
                        }
                        if (~data.indexOf('ssh')) {
                            self.getSSH();
                        }
                    });
                },
                function () {
                    self.$state.go('login');
                });
        };

        this.getAll = function () {
            this.getUsers();
            this.getSSH();
        };
        this.getUsers = function () {
            $http.get('api/users?r=' + Math.random()).then(function (res) {
                self.data.users = res.data;
            });
        };
        this.getSSH = function () {
            $http.get('api/ssh?r=' + Math.random()).then(function (res) {
                self.data.ssh = res.data;
            });
        };

        self.login();
    });
})();