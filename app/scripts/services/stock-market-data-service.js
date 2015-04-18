'use strict';

angular.module('mpApp.services', [])
.factory('marketDataService', ['$http','APP_CONSTANTS', function($http,APP_CONSTANTS){

	var marketDataAPI = {};

	marketDataAPI.getStockDetails = function(ticker){
		return $http({
			method: 'JSONP',
			url: APP_CONSTANTS.MarketAPIBaseUrl+'Lookup/jsonp?input='+ticker+'&callback=JSON_CALLBACK',
 			cache: true
		});
	};

	marketDataAPI.getStockQuote = function(ticker){
		return $http({
			method: 'JSONP',
			url: APP_CONSTANTS.MarketAPIBaseUrl+'Quote/jsonp?symbol='+ticker+'&callback=JSON_CALLBACK',
 			cache: true

		});
	};

	marketDataAPI.getInteractiveChartDetails = function(ticker,dataPeriodRequested){
		var data = encodeURIComponent(JSON.stringify(
			{	Normalized:false,
				NumberOfDays:365,
				DataPeriod:dataPeriodRequested,
				Elements:[{
					Symbol:ticker,
					Type:'price',
					Params: ['c']
				}]
			}));
		console.log(data);
		return $http({
			method: 'JSONP',
			url: APP_CONSTANTS.MarketAPIBaseUrl+'InteractiveChart/jsonp?parameters='+data+'&callback=JSON_CALLBACK',
 			cache: true

		});
	};

	marketDataAPI.getSearchStocks = function(){
		return $http.get( 'data/NYSE_conv.json', {
			params: {
				responseType: 'json'
			}
		});
	};

	return marketDataAPI;
}])

.factory('portfolioService',['$cookies','APP_CONSTANTS',function($cookies,APP_CONSTANTS){

	var cookieAPI = {};

		cookieAPI.getStocksInPortfolio = function(){

			var stockList = $cookies[APP_CONSTANTS.cookieKey];
			if(stockList===undefined){
				stockList=[];
			}else{
				stockList = JSON.parse(stockList);
			}
			return stockList;

		};
		cookieAPI.addStocksToPortfolio = function(tickerInput,nameInput){

			if(tickerInput!==undefined && nameInput !== undefined){
				try{
					var stockList = $cookies[APP_CONSTANTS.cookieKey];

					if(stockList===undefined){
						stockList=[];
					}else{
						stockList = JSON.parse(stockList);

					}
					// Check if stock is already in portfolio
					if(!itemInList(tickerInput,stockList)){
						stockList.push({ticker:tickerInput,name:nameInput});
					}else{
						console.log('Stock already in portfolio');
						return false;
					}
					
					
					$cookies[APP_CONSTANTS.cookieKey] = JSON.stringify(stockList);
				}catch(e){
					console.log(e);
					return false;
				}

			}else{
				return false;
			}
			
			return true;

		};

		cookieAPI.removeStockFromPortfolio = function(tickerInput){
			var result = false;
			if(tickerInput!==undefined){
				var stockList = $cookies[APP_CONSTANTS.cookieKey];
				if(stockList!==undefined){
						stockList = JSON.parse(stockList);
						var index = itemInList(tickerInput,stockList);
						if(index !==undefined && jQuery.type(index)==='number'){
							stockList.splice(index,1);
							$cookies[APP_CONSTANTS.cookieKey] = JSON.stringify(stockList);
							result = true;
						}
					}
			}

			return result;
		};

		/* Helper Functions */
		var itemInList = function(tickerInput,stockList){
			var result = false;
			if(tickerInput!==undefined && stockList !==undefined){
				angular.forEach(stockList, function(value, key){
					if(tickerInput===value.ticker){
						result = key;
					}
				});
			}

			return result;
		};


	return cookieAPI;

}]);



