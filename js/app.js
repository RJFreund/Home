var myApp = angular.module('myApp', ['ui.router', 'ng', 'ui.router.title', 'ngSanitize', 'ngResource']);
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
);

myApp.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
    function($stateProvider, $urlRouterProvider, $locationProvider) {        
        //$urlRouterProvider.otherwise("/pageNotFound");
        $urlRouterProvider.otherwise("/");
        $stateProvider
            .state('home', {
                url: "/",
                templateUrl: "./views/content/index.html",
                resolve: { $title: function(){ return 'Yo' } }
            })
            .state('about', {
                url: "/about",
                templateUrl: "./views/content/about.html"
            })
            .state('services', {
                url: "/services",
                templateUrl: "./views/content/services.html"
            })
            .state('blog', {
                url: "/blog",
                templateUrl: "./views/content/blog/index.html",
                controller: 'AppController'
            })
            .state('blogEntries', {
                url: "/blog/entries",
                templateUrl: "./views/content/blog/entries.html",
                controller: "BlogEntryController"
            })
            .state('blogEntry', {
                url: "/blog/entries/:entryId",
                templateUrl: './views/content/blog/entry.html',
                controller: "BlogEntryController"
            })
            .state('pageNotFound', {
                url: "/pageNotFound",
                templateUrl: "./views/content/pageNotFound.html"

            })
            .state('underConstruction', {
                url: "/underConstruction",
                templateUrl: "./views/content/underConstruction.html",
            })
            .state('repair', {
                url: "/services#repair",
                templateUrl: "./views/content/services.html"
            })
            .state('websites', {
                url: "/services#websites",
                templateUrl: "./views/content/services.html"
            })
            .state('software', {
                url: "/services#software",
                templateUrl: "./views/content/services.html"
            });
}]).config(['$resourceProvider', function($resourceProvider) {
    // Don't strip trailing slashes from calculated URLs
    $resourceProvider.defaults.stripTrailingSlashes = false;
}]);

myApp.service('constructionService', function(){
    this.isUnderConstruction = function(){
        return false;
    };
});

myApp.factory('BlogEntry', ['$resource', function($resource) {
    return $resource('/api/v/1.0/BlogEntries/:entryId',
        null,
        { 'get': {
                method: 'GET',
                isArray: false //since your list property is an array
        }
    });
}]);

myApp.run(['$rootScope', '$location', '$state', 'constructionService', '$anchorScroll',
    function($rootScope, $location, $state, constructionService, $anchorScroll){
        $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams){
                if (constructionService.isUnderConstruction()
                    && toState.name !== 'underConstruction'){
                    event.preventDefault();
                    $state.go('underConstruction');
                    return;
                }
                if (toState.name === 'underConstruction'){
                    event.preventDefault();
                    $state.go('underConstruction');
                    return;
                }
                if(toState.name === 'pageNotFound'
                   && fromState.name !== 'pageNotFound'){
                    $location.path('/pageNotFound'); //get this page from the server so that we can generate the 404 state
                    return;
                }
            });
        $rootScope.$on('$stateChangeSuccess',
            function(event, toState, toParams, fromState, fromParams){
                $anchorScroll();
            });
}]);

myApp.filter('capitalize', function() {
    return function(input) {
        return input.charAt(0).toUpperCase() + input.substr(1).toLowerCase();
    }
}).filter('camelCaseToSpaces', function(){
    return function(input){
        return input.replace(/([A-Z])/g, ' $1')
            // insert a space before all caps
            .replace(/^./, function(str){ return str.toUpperCase(); });
            // uppercase the first character
    }
});

myApp.controller('AppController',
    ['$scope', '$filter', '$state', '$sce',
    function($scope, $filter, $state, $sce){
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
        pageTitle = $filter('camelCaseToSpaces')(pageTitlePrefix) + " - " + siteTitle;
        return pageTitle;
    };
    $scope.getCurrentYear = function() {
        return new Date().getFullYear();
    };

    $scope.getYearsSince = function(birthdate){
        var myBirthdate = new Date(birthdate);
        var todaysDate = new Date();
        var dateDiff = new Date(todaysDate - myBirthdate);
        var myAge = Math.abs(dateDiff.getUTCFullYear() - 1970);
        return myAge;
    };
}]).controller('BlogEntryController',
    ['$stateParams', '$scope', 'BlogEntry',
    function($stateParams, $scope, BlogEntry){
        BlogEntry.query(function(blogEntries){ $scope.getBlogEntries = function(){ return blogEntries; }; });
        BlogEntry.get({entryId: $stateParams.entryId}, function(blogEntry){ $scope.getBlogEntry = function(){ return blogEntry; }; }
        );
}]);