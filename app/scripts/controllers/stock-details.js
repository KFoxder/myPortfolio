'use strict';

angular.module('mpApp.stock-details', [])
.controller('StockDetailsController', [ '$scope', '$stateParams', 'marketDataService','$q','STOCK_DATA_FORMAT',

	function($scope,$stateParams,marketDataService,$q,STOCK_DATA_FORMAT) {

			var scope = $scope;
			scope.stock = {};
			var stock = scope.stock;
			stock.ticker = $stateParams.ticker;

			var pageId = '#stock-details-container'
			//Set Loading
			$(pageId).addClass('loading');
			//Default Data Period
			var dataPeriod = 'Month';

			var transformData = function(keyInput, valueInput){

				var returnKey;
				var returnValue;

				if(STOCK_DATA_FORMAT[keyInput]!==undefined){
					var returnKey = STOCK_DATA_FORMAT[keyInput].displayKey;
					//var valueFormat = STOCK_DATA_FORMAT[keyInput].valueFormat;
					var returnValue = valueInput;
					var returnObject = {key:returnKey, value:returnValue}
					return returnObject;
				}
				
				return undefined;
				

			};
			//Make a call for market data and populate stock with Qoute data
			if(stock !== undefined && stock.ticker !== undefined){
				$q.all([
					marketDataService.getStockQuote(stock.ticker),
					marketDataService.getInteractiveChartDetails(stock.ticker,dataPeriod)
					])
				.then(function(response){

					//Check response to Chart Data Service
					if(response[1].status===200 && response[1].data !==undefined){
						scope.data = [];
						scope.maxPrice = response[1].data.Elements[0].DataSeries.close.max;
						scope.minPrice = response[1].data.Elements[0].DataSeries.close.min;
						//Populate Dates and prices
						angular.forEach(response[1].data.Dates, function(value, key){
							scope.data.push({date:value,price:response[1].data.Elements[0].DataSeries.close.values[key]});
						});
					}
					//Check response to Quote Service
					if(response[0].status===200 && response[0].data !==undefined && response[0].data.Status==='SUCCESS'){

						//Populate stock object with data
						angular.forEach(response[0].data, function(value, key){
							if(key!=='Status' && key!=='ticker'){
								var returnObj = transformData(key,value);
								if(returnObj != undefined){
									var keyFormatted = returnObj.key;
									var valueFormatted = returnObj.value;
									stock[keyFormatted] = valueFormatted;
								}
								
							}	
						});

					}
				}).then(function(){
					new Morris.Line({
						  // ID of the element in which to draw the chart.
						  element: 'historical-price-graph',
						  // Chart data records -- each entry in this array corresponds to a point on
						  // the chart.
						  data: scope.data,
						  // The name of the data record attribute that contains x-values.
						  xkey: 'date',
						  // A list of names of data record attributes that contain y-values.
						  ykeys: ['price'],
						  // Labels for the ykeys -- will be displayed when you hover over the
						  // chart.
						  labels: ['Price'],
						  //Allow chart to resize with window
						  resize: true,

						  ymax: scope.maxPrice * (1.2),
						  ymin: scope.minPrice,
						  yLabelFormat: function (y) { return '$'+parseFloat(y).toFixed(2); }
					});
				});
			}
			
			
			
			



}]);