var randomMovieController = angular.module('randomMovieController', ['randomMovieService']);

randomMovieController.controller('Test', function($scope, $http, service){	

	$scope.initialize = function(){
				var api = service.getAPI();

				$http({method: 'GET', url: 'http://api.themoviedb.org/3/genre/list?api_key=' + api})
				.success(function(data){
					service.setGenres(data);
				})
				.error(function(){
					console.log('ERROR: unable to GET (initialize)');
				});
	}


	$scope.genres = service.getGenres(); //list of all genres
	$scope.selectedGenres = []; //user selected genres
	$scope.random = 0; //random genre selected from selectedGenres[]
	$scope.movieResult = null;

	// $scope.possibleResults = function(){
	// 	var result = 0;
	// 	for(var i = 0; i <= $scope.getSearchGenres.length - 1; i++){
	// 		result += $scope.getSearchGenres[i].results;
	// 	}
	// 	return result;
	// }

	$scope.searchMovie = function(id, genre){
		var api = service.getAPI();
		$http({method: 'GET', url: 'http://api.themoviedb.org/3/genre/' + id + '/movies?api_key=' + api})
		.success(function(data){
			var movieNumber = Math.floor((Math.random() * data.total_results) + 1);
			var page = Math.floor(movieNumber / 20);
			if (page === 0){ page = 1;}
			var item = movieNumber % 20;
			$scope.getMovie(id, page, item);
		})
		.error(function(){
			console.log('ERROR: unable to GET (searchMovie)')
		})
	}

	$scope.getMovie = function(id, page, item){
		var api = service.getAPI();
		$http({method: 'GET', url: 'http://api.themoviedb.org/3/genre/' + id + '/movies?api_key=' + api + '&page=' + page})
		.success(function(data){
			$http({method:'GET', url:'http://api.themoviedb.org/3/movie/' + data.results[item].id + '?api_key=' + api})
			.success(function(data){
				$scope.movieResult = data;				
			})
			.error(function(){
				console.log('ERROR: inline movie info');
			});
		})
		.error(function(){
			console.log('ERROR: unable to GET (getMovie');
		});
	}

	$scope.deleteItem = function(array, id){
		for(var i = 0; i <= array.length - 1; i++){
			if(array[i].id === id){
				array.splice(i, 1);
			}
		}
	}

	$scope.hasItem = function (array, id){
		for(var i = 0; i <= array.length - 1; i++){
			if(array[i].id === id)
					return 1;
			}
		return 0;
  	}

	$scope.moveGenre = function(id, genre){
		if($scope.hasItem($scope.selectedGenres, id)){
			$scope.deleteItem($scope.selectedGenres, id);
			$scope.deleteItem($scope.getSearchGenres, id);
			$scope.genres.push({id: id, genre: genre});			
		}
		else{
			$scope.selectedGenres.push({id: id, genre: genre});
			$scope.deleteItem($scope.genres, id);
		}
	}

	$scope.randomGenre = function(){
		var random = Math.floor((Math.random() * $scope.selectedGenres.length) + 0)
		$scope.random = $scope.selectedGenres[random];
		$scope.searchMovie($scope.random.id, $scope.random.genre);
	}

});