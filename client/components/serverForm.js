(function () {
    'use strict';
    function ServerForm(myModel, $http,$state) {
        this.data = myModel.data;
        this.model = myModel;
        this.server = {};
        this.$http = $http;
        this.$state=$state;
    }

    ServerForm.prototype.resetOwner = function () {
        this.server.owner = null;
    };

    ServerForm.prototype.submit = function (e) {
        e.preventDefault();

        var self = this;
        self.$http.post('api/servers', self.server).then(function (res) {
                self.$state.go('app.servers');
            },
            function (res) {
                self.message = res.data.message;
            });
    };
    ServerForm.prototype.ping = function (host) {
        var self = this;
        this.pingOk = "ping...";
        this.model.ping(host).then(function () {
                self.pingOk = "ok :)";
            }, function (err) {
                self.pingOk = "no response :(";
            }
        )
    };
    angular.module('myApp').component('serverForm', {
        controller: ServerForm,
        templateUrl: 'components/serverForm.html',
        bindings: {
            mode: '<'
        }
    });
})();
