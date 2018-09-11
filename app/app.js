var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $http, $interval) {
    $scope.currencyRate=0;
    $scope.fromcurrency='INR';
    $scope.tocurrency='USD';
    $scope.listOfCurrencies=[];
    $scope.listOfFilteredToCurrencies=[];
    $scope.listOfFilteredFromCurrencies=[];
    $scope.fromcurrval=1;
    $scope.tocurrval=1;

	var time=1000*60*30;

	$scope.calculateExchange=function(val, type){
		if(type==="from"){
			$scope.tocurrval=val*$scope.currencyRate;
		}
		else if(type=="to"){
			$scope.fromcurrval=val/$scope.currencyRate;;
		}
	}

	$scope.filterFromCurrency=function(val){
		$scope.listOfFilteredFromCurrencies=[];
		if(val!=null && val.length>0){
			$scope.listOfFilteredFromCurrencies = $scope.listOfCurrencies.filter(function (el) {
			  return el['id'].toLowerCase()==val.toLowerCase();
			});
			if($scope.listOfFilteredFromCurrencies.length==1 && $scope.listOfFilteredFromCurrencies[0].id.toLowerCase()==val.toLowerCase()){
				$scope.fromcurrency=$scope.listOfFilteredFromCurrencies[0].id;
				if($scope.tocurrency!=null && $scope.tocurrency.length>0 && $scope.fromcurrency!=null && $scope.fromcurrency.length>0){
					getInitialCurrencyRate($scope.tocurrency,$scope.fromcurrency);
				}
				$scope.listOfFilteredFromCurrencies=[];
				return;
			}
			$scope.listOfFilteredFromCurrencies = $scope.listOfCurrencies.filter(function (el) {
			  return el['id'].toLowerCase().includes(val.toLowerCase());
			});
		}
	}

	$scope.filterToCurrency=function(val){
		$scope.listOfFilteredToCurrencies=[];
		if(val!=null && val.length>0){
		$scope.listOfFilteredToCurrencies = $scope.listOfCurrencies.filter(function (el) {
			  return el['id'].toLowerCase()==val.toLowerCase();
			});
			if($scope.listOfFilteredToCurrencies.length==1 && $scope.listOfFilteredToCurrencies[0].id.toLowerCase()==val.toLowerCase()){
				$scope.tocurrency=$scope.listOfFilteredToCurrencies[0].id;
				if($scope.tocurrency!=null && $scope.tocurrency.length>0 && $scope.fromcurrency!=null && $scope.fromcurrency.length>0){
					getInitialCurrencyRate($scope.tocurrency,$scope.fromcurrency);
				}
				$scope.listOfFilteredToCurrencies=[];
				return;
			}
			$scope.listOfFilteredToCurrencies = $scope.listOfCurrencies.filter(function (el) {
			  return el['id'].toLowerCase().includes(val.toLowerCase());
			});
		}
	}

	function getListOfCurrencies(){
		$http.get("https://free.currencyconverterapi.com/api/v6/currencies")
		.then(function(response) {
			$scope.listOfCurrencies=Array.from(Object.keys(response.data.results), k=>response.data.results[k]);
		});
	}

	function getInitialCurrencyRate(tocurr,fromcurr){
		var key=fromcurr+'_'+tocurr+'';
		    $http.get("http://free.currencyconverterapi.com/api/v5/convert?q="+key+"&compact=y")
		    .then(function(response) {
		    	$scope.currencyRate=response.data[key].val;
		    	$scope.calculateExchange(1,"from");
		    });
	}

    function initialize(){
    	getInitialCurrencyRate($scope.tocurrency,$scope.fromcurrency);
    	getListOfCurrencies();
    }

    initialize();
});