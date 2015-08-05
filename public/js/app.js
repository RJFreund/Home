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
    //
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/");
    //
    // Now set up the states
    $stateProvider
        .state('home', {
            url: "/",
            templateUrl: "/index",
            resolve: { $title: function(){ return 'Yo' } }
        });
});

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