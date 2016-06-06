/**
 * Created by User on 05.06.2016.
 */
(function () {
    'use strict';
    function ServerBig(myModel,$state,$http) {
        this.data = myModel.data;
        this.$state=$state;
        this.model=myModel;
        this.$http=$http;
        if (!this.data.selected){
            $state.go('app.servers');
        }
    }
    ServerBig.prototype.take = function () {
        var self=this;
        if (confirm('sure? '+this.data.selected.owner+' will know who you are!!!' )) {
            self.$http.post('api/servers/owner' ,{'ip':self.data.selected.ip, 'newOwner':self.data.user.name});
        }
    };

    angular.module('myApp').component('serverBig', {
        controller: ServerBig,
        templateUrl: 'components/serverBig.html',
    });
})();