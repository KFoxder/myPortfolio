'use strict';

// Declare app level module which depends on views, and components
angular.module('mpApp', [
  'ui.router',
  'ui.bootstrap',
  'ngCookies',
  'ngSanitize',
  'mpApp.home',
  'mpApp.info',
  'mpApp.stock-add',
  'mpApp.stock-details',
  'mpApp.services'
])
.constant('APP_CONSTANTS', {
        'cookieKey': 'STOCK_LIST',
        'MarketAPIBaseUrl': 'http://dev.markitondemand.com/Api/v2/'
    })
.constant('STOCK_DATA_FORMAT', {
  'Change' : {displayKey : 'Change Today', valueFormat : ''},
  'Name' : {displayKey : 'Name', valueFormat : ''},
  'ChangePercent' : {displayKey : 'Percent Change (%)', valueFormat : ''},
  'ChangePercentYTD' : {displayKey : 'Percent Change YTD (%)', valueFormat : ''},
  'ChangeYTD' : {displayKey : 'Change YTD', valueFormat : ''},
  'High' : {displayKey : 'Today\'s High', valueFormat : ''},
  'LastPrice' : {displayKey : 'Last Price', valueFormat : ''},
  'Low' : {displayKey : 'Low', valueFormat : ''},
  'MarketCap' : {displayKey : 'Market Cap', valueFormat : ''},
  'Open' : {displayKey : 'Open', valueFormat : ''},
  'Volume' : {displayKey : 'Volume Today', valueFormat : ''},
  'Symbol' : {displayKey : 'Symbol', valueFormat : ''}
})
.config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /home
  $urlRouterProvider.otherwise('/');
  //
  // Now set up the states
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'views/home/home.html',
      controller: 'HomeController'
    })
    .state('info', {
      url: '/info',
      templateUrl: 'views/info/info.html',
      controller: 'InfoController'
    })
    .state('stock-add', {
      url: '/stock/add',
      templateUrl: 'views/stock-add/stock-add.html',
      controller: 'StockAddController'
    })
    .state('stock-details', {
      url: '/stock/details/:ticker',
      templateUrl: 'views/stock-details/stock-details.html',
      controller: 'StockDetailsController'
    });
})
.controller('MainController',function($scope,$modal,portfolioService){

  var scope = $scope;

  scope.currentPortfolio = portfolioService.getStocksInPortfolio();

  scope.toggleDropdown = function(){
    $('#dropdown-menu').dropdown('toggle');
  };

  scope.addStockDialog = function(){

    $modal.open({
      templateUrl: 'views/stock-add/stock-add.html',
      controller: 'StockAddController',
      scope: $scope,
      size: 'lg'
    });
  
  };
  scope.removeStockFromPortfolio = function(stock){
    var result = portfolioService.removeStockFromPortfolio(stock.ticker);
    if(result){
      scope.currentPortfolio = portfolioService.getStocksInPortfolio();
    }



  };


});
