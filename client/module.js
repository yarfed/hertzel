/**
 * Created by User on 27.05.2016.
 */
(function () {
    'use strict';
    angular.module('myApp', ['ui.router'])
        .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/app/servers");

        $stateProvider
            .state('login', {
                template: "<login></login>",
                url: "/login"
            })

            .state('app', {
                url: "/app",
                template: "<app></app>",
                abstract:true
            })
            .state('app.servers', {
                url: "/servers",
                template: "<server-list></server-list>"
            })
            .state('app.addServer', {
                url: "/addServer",
                template: "<server-form></server-form>"
            })
    });
})();
