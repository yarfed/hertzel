/**
 * Created by User on 30.05.2016.
 */
(function () {
    'use strict';
    angular.module('myApp').service('myModel', function ($http, $state, $rootScope) {
        this.$http = $http;
        this.$state = $state;
        this.data = {};
        this.data.filter = "my";
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
                self.$http.delete('api/users/' + self.data.user.name).then(function () {
                    self.logout();
                });
            }
        };

        this.deleteServer = function () {
            if (confirm('sure?')) {
                self.$http.delete('api/servers/' + self.data.selected.ip).then(function () {
                    self.data.selected = null;
                });
            }
        };



        this.ping = function (host) {
            return self.$http.get('api/ping/' + host + '?r=' + Math.random());
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
                        if (~data.indexOf('servers')) {
                            self.getServers();
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
            this.getServers();
        };

        this.getUsers = function () {
            $http.get('api/users?r=' + Math.random()).then(function (res) {
                var users = res.data;
                var index = {};
                for (var i = 0; i < users.length; i++) {
                    var ip = users[i].ip;
                    if (ip) {
                        index[ip] = users[i].name;
                    }
                }
                self.data.users = users;
                self.data.usersIndex = index;
            });
        };

        this.getServers = function () {
            $http.get('api/servers?r=' + Math.random()).then(function (res) {
                self.data.servers = res.data;
                if (self.data.selected) {
                    self.data.servers.forEach(function (server) {
                        if (self.data.selected.ip == server.ip) {
                            self.data.selected = server;
                        }
                    });
                }
            });
        };
        this.getSSH = function () {
            $http.get('api/ssh?r=' + Math.random()).then(function (res) {
                var sshRaw = res.data;
                var ssh = {};
                for (var p in sshRaw) {
                    var arr = p.split(' ');
                    var serverIP = arr[2], clientIP = arr[0];

                    if (!ssh[serverIP]) {
                        ssh[serverIP] = [];
                    }
                    ssh[serverIP].push(clientIP);
                }
                self.data.ssh = ssh;
            });
        };

        self.login();
    });
})();