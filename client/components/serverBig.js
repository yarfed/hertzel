/**
 * Created by User on 05.06.2016.
 */
(function () {
    'use strict';
    function ServerBig(myModel, $state, $http) {
        this.data = myModel.data;
        this.$state = $state;
        this.model = myModel;
        this.$http = $http;
        if (!this.data.selected) {
            $state.go('app.servers');
        }
    }

    ServerBig.prototype.take = function (newOwner) {
        var self = this;

        if (!self.data.selected.owner||//if server free
            self.data.selected.owner==self.data.user.name||//if it own server
            confirm('sure? ' + self.data.selected.owner + ' will know who you are!!!')) {
            self.$http.post('api/servers/owner',
                {
                    'ip': self.data.selected.ip,
                    'newOwner': newOwner,
                    'oldOwner': self.data.selected.owner,
                    'changer': self.data.user.name
                }).then(function(){
                self.$state.go('app.servers');
            })
        }
    };

    angular.module('myApp').component('serverBig', {
        controller: ServerBig,
        templateUrl: 'components/serverBig.html',
    });
})();