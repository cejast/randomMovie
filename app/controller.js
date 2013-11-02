var randomMovieController = angular.module('randomMovieController', ['randomMovieService']);

randomMovieController.controller('RandomMovie', function($scope, $http, service){	

	$scope.initialize = function(){
				var api = service.getAPI();

				$http({method: 'GET', url: 'http://api.themoviedb.org/3/genre/list?api_key=' + api})
				.success(function(data){
					service.setGenres(data);
				})
				.error(function(){
					console.log('ERROR: unable to GET (initialize)');
				});

				$http({method: 'GET', url: 'http://api.themoviedb.org/3/configuration?api_key=' + api})
				.success(function(data){
					$scope.configuration = data;
					$scope.background = $scope.configuration.images.base_url + 'original' + $scope.movieResult.backdrop_path;
				})
				.error(function(){
					console.log('ERROR: unable to GET (configuration)')
				});
	}

	$scope.genres = service.getGenres(); //list of all genres
	$scope.selectedGenres = []; //user selected genres
	$scope.random = 0; //random genre selected from selectedGenres[]
	$scope.movieResult = {"adult":false,"backdrop_path":"/jjAq3tCezdlQduusgtMhpY2XzW0.jpg","belongs_to_collection":{"id":121938,"name":"The Hobbit Collection","poster_path":"/4MyjzLpdX6H0Voj7H2kIgNgowli.jpg","backdrop_path":"/7wO7MSnP5UcwR2cTHdJFF1vP4Ie.jpg"},"budget":250000000,"genres":[{"id":28,"name":"Action"},{"id":12,"name":"Adventure"},{"id":14,"name":"Fantasy"}],"homepage":"http://www.thehobbit.com/","id":49051,"imdb_id":"tt0903624","original_title":"The Hobbit: An Unexpected Journey","overview":"Bilbo Baggins, a hobbit enjoying his quiet life, is swept into an epic quest by Gandalf the Grey and thirteen dwarves who seek to reclaim their mountain home from Smaug, the dragon.","popularity":35.0927029899782,"poster_path":"/nGLrjWHsFcz62Xw6Epz84j5faWZ.jpg","production_companies":[{"name":"Warner Bros. Pictures","id":174},{"name":"Metro-Goldwyn-Mayer Pictures","id":6127}],"production_countries":[{"iso_3166_1":"US","name":"United States of America"},{"iso_3166_1":"NZ","name":"New Zealand"}],"release_date":"2012-12-12","revenue":1017003568,"runtime":169,"spoken_languages":[{"iso_639_1":"en","name":"English"}],"status":"Released","tagline":"From the smallest beginnings come the greatest legends.","title":"The Hobbit: An Unexpected Journey","vote_average":6.5,"vote_count":3867};
	$scope.date = $scope.movieResult.release_date.split("-", 1);

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
			$scope.item = item;
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
				$scope.background = $scope.configuration.images.base_url + 'original' + data.backdrop_path;				
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

	$scope.getBackground = function(){
    	return { 'background-image' : 'url(' + $scope.background + ')',
    			 'background-size' : 'cover',
  				 'background-repeat' : 'no-repeat',
  			   };
		}

});