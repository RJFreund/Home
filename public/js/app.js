var myApp = angular.module('myApp', ['ui.router', 'ng', 'ui.router.title']);
myApp.run(
    ['$rootScope', '$state', '$stateParams',
        function ($rootScope,   $state,   $stateParams) {
            // It's very handy to add references to $state and $stateParams to the $rootScope
            // so that you can access them from any scope within your applications.For example,
            // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
            // to active whenever 'contacts.list' or one of its decendents is active.
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }
    ]
)
myApp.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider
        .state('home', {
            url: "/",
            templateUrl: "/index",
            resolve: { $title: function(){ return 'Yo' } }
        })
        .state('about', {
            url: "/about",
            templateUrl: "/about"
        })
        .state('projects', {
            url: "/projects",
            templateUrl: "/projects"
        })
        .state('services', {
            url: "/services",
            templateUrl: "/services"
        })
        .state('calendar', {
            url: "/calendar",
            templateUrl: "/calendar"
        })
        .state('contact', {
            url: "/contact",
            templateUrl: "/contact"
        })
        .state('pageNotFound', {
            url: "/pageNotFound",
            templateUrl: "/pageNotFound"
        })
        .state('underConstruction', {
            url: "/underConstruction",
            templateUrl: "/underConstruction",
            resolve: { $title: function(){ return 'Under Construction' } }
        })
        .state('repair', {
            url: "/services#repair",
            templateUrl: "/services"
        })
        .state('websites', {
            url: "/services#websites",
            templateUrl: "/services"
        })
        .state('software', {
            url: "/services#software",
            templateUrl: "/services"
        });
});

myApp.service('constructionService', function(){
    this.isUnderConstruction = function(){
        return false;
    };
});

myApp.run(['$rootScope', '$location', '$state', 'constructionService',
    function($rootScope, $location, $state, constructionService){
        $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams){
                if (constructionService.isUnderConstruction()
                    && toState.name === 'underConstruction'){
                    return;
                }
                if (constructionService.isUnderConstruction()){
                    event.preventDefault();
                    $state.go('underConstruction');
                    return;
                }
                if (toState.name == 'underConstruction'){
                    event.preventDefault();
                    $state.go('pageNotFound');
                    return;
                }
            });
}]);

myApp.filter('capitalize', function() {
    return function(input) {
        return input.charAt(0).toUpperCase() + input.substr(1).toLowerCase();
    }
});

myApp.controller('AppController', ['$scope', '$filter', '$state', function($scope, $filter, $state){
    $scope.getPageTitle = function(){
        var pageTitle = '';
        var pageTitlePrefix = '';
        var siteTitle = "R.J. Freund's Website";
        if ($state.current.name == 'home') {
            return siteTitle;
        }
        if (typeof $state.$current.resolve.$title !== 'undefined') {
            pageTitlePrefix = $state.$current.resolve.$title();
        } else {
            pageTitlePrefix = $state.current.name;
        }
        pageTitle = $filter('capitalize')(pageTitlePrefix) + " - " + siteTitle;
        return pageTitle;
    };
}]);