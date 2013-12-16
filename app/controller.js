var randomMovieController = angular.module('randomMovieController', ['randomMovieService', 'youtubeService']);

randomMovieController.controller('RandomMovie', function($scope, $http, api, genres, movieInfo, apiCall, functions, youtubePlayerApi){

	$scope.movieResult = movieInfo.data;
	$scope.movieCount = 1;
	$scope.youtubeID = $scope.movieResult.trailers.youtube[0].source;


	$scope.initialize = function(){
				apiCall.getGenres();
				apiCall.getConfiguration().then(function(data){ 
					$scope.configuration = data;
					$scope.poster = $scope.configuration.images.base_url + 'w185' + $scope.movieResult.poster_path;
					$scope.background = $scope.configuration.images.base_url + 'w780' + $scope.movieResult.backdrop_path;
				});
	}

	$scope.genres = genres.getGenres(); //list of all genres
	$scope.selectedGenres = []; //user selected genres
	$scope.random = 0; //random genre selected from selectedGenres[]	

	$scope.searchMovie = function(id, genre){
		apiCall.searchMovie(id, genre).then(function(data){
			$scope.item = data.item;
			$scope.getMovie(data.id, data.page, data.item);
		});
	}

	$scope.getMovie = function(id, page, item){
		apiCall.getMovie(id, page, item);
	}

	$scope.moveGenre = function(id, genre){
		if(functions.hasItem($scope.selectedGenres, id)){
			$scope.genres[functions.getIndex($scope.genres, id)].class = genres.setClass(false);
			$scope.selectedGenres = functions.deleteItem($scope.selectedGenres, id);			
			console.log($scope.selectedGenres);
		}
		else{
			$scope.genres[functions.getIndex($scope.genres, id)].class = genres.setClass(true);
			$scope.selectedGenres.push({id: id, genre: genre, class: genres.setClass(true)});
		}
	}

	$scope.nextMovie = function(){
		if($scope.selectedGenres.length){
			var random = Math.floor((Math.random() * $scope.selectedGenres.length) + 0)
			$scope.movieCount++;
			$scope.random = $scope.selectedGenres[random];
			$scope.searchMovie($scope.random.id, $scope.random.genre);
		}
		else return null;
	}

	$scope.movieResultGenresClass = function(genre){
		for(var i = 0; i <= $scope.selectedGenres.length - 1; i++){
			if($scope.selectedGenres[i].genre === genre){
				return 'selectedGenre btn btn-info';
			}
		}
		return 'genreSelect btn btn-primary';
	}

	$scope.getBackground = function(){
    	return { 'background-image' : 'url(' + $scope.background + ')',
    			 'background-size' : 'cover',
  				 'background-repeat' : 'no-repeat',
  			   };
		}

	$scope.videoExist = true;

	$scope.$watch('movieResult', function(){
		$scope.title = $scope.movieResult.title;
		$scope.date = $scope.movieResult.release_date.split("-", 1);
		if($scope.movieResult.overview.length <= 250)
			$scope.overview = $scope.movieResult.overview;
		else{
			$scope.overview = $scope.movieResult.overview.substring(0,300);
			$scope.overview = $scope.overview.concat("...");
			}
		$scope.poster = $scope.configuration.images.base_url + 'w185' + $scope.movieResult.poster_path;
		$scope.background = $scope.configuration.images.base_url + 'w780' + $scope.movieResult.backdrop_path;
		if(!angular.isDefined($scope.movieResult.trailers.youtube[0]) || $scope.movieResult.trailers.youtube[0] === null){
			console.log("no video available");
			$scope.videoExist = false;
		}
		else{
			$scope.youtubeID = $scope.movieResult.trailers.youtube[0].source;
			youtubePlayerApi.setVideo($scope.youtubeID);
			$scope.videoExist = true;
		}
	});

	$scope.$on('movie.update', function(event){
		$scope.movieResult = movieInfo.data;
	})

});