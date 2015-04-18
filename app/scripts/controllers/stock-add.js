'use strict';

angular.module('mpApp.stock-add', [])
.controller('StockAddController', ['$scope','$modalInstance','portfolioService','marketDataService',function($scope,$modalInstance,portfolioService,marketDataService) {
	var scope = $scope;

	//Helper Function to change status of alerts
	var changeStatus = function(level,message){
		if(scope.status != undefined){
			
			if(message!=undefined && level!=undefined){
				scope.status.message = message;
				scope.status.level = level;
			}


		}else{
			scope.status = {};
			if(message!=undefined && level!=undefined){
				scope.status.level = level;
				scope.status.message = message;
			}

		}
	}



	scope.status = {};
	scope.status.level = changeStatus('INFO','Fine');
	marketDataService.getSearchStocks().then(function(response){
		scope.searchStocks = response.data;
	});
	//console.log(scope.searchStocks);

	scope.addStockToPortfolio = function(stock){
		if(stock !=undefined && stock.ticker!=undefined && stock.name !=undefined){
			var tranSuccesful = portfolioService.addStocksToPortfolio(stock.ticker,stock.name);
			if(tranSuccesful == undefined || tranSuccesful == false){
				changeStatus('ERROR','An error occured trying to save stock to portfolio.');
			}else{
				scope.currentPortfolio.push(stock);
				changeStatus('SUCCESS','Stock added to portfolio!');
				$modalInstance.close();
				
			}
			
		}
	};


	

}]);