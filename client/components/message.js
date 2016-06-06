/**
 * Created by User on 05.06.2016.
 */
(function () {
    'use strict';
    function Message(myModel) {
        this.data = myModel.data;
        this.new=true;
        var self=this;
        $timeout(function(){self.new=false;},3000);
    }

    angular.module('myApp').component('message', {
        controller: Message,
        templateUrl: 'components/message.html',
        bindings: {
            message: '<'
        }
    });
})();