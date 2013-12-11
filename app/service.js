var module = angular.module('randomMovieService', []);

module.factory('api', function(){
	var api = {
		key: '09e09aca22efd2b0335a2b5f780baad8',
		url: 'http://api.themoviedb.org/3/'
		}
	return api;
});

module.factory('apiCall', ['$http', 'api', 'genres', 'movieInfo', function($http, api, genres, movieInfo){

	var http = {};

	http.getGenres = function(){
		$http({method: 'GET', url: api.url + 'genre/list?api_key=' + api.key})
			.success(function(data){
				return genres.setGenres(data);
			})
			.error(function(){
				return console.log('ERROR: unable to GET (initialize)');
			});
	}

	http.getConfiguration = function(){
		return $http({method: 'GET', url: api.url + 'configuration?api_key=' + api.key})
			.error(function(){
				console.log('ERROR: unable to GET (configuration)')
			})
			.then(function(response){
				return response.data;
			});
	}

	http.searchMovie = function(id, genre){
		return 	$http({method: 'GET', url: api.url + 'genre/' + id + '/movies?api_key=' + api.key})
			.error(function(){
				console.log('ERROR: unable to GET (searchMovie)')
			})
			.then(function(response){
				var movieNumber = Math.floor((Math.random() * response.data.total_results) + 1);
				var page = Math.floor(movieNumber / 20);
				if (page === 0){ page = 1;}
				var item = movieNumber % 20;
				return {id: id,page: page,item: item};
			});
	}

	http.getMovie = function(id, page, item){
		return 	$http({method: 'GET', url: api.url + 'genre/' + id + '/movies?api_key=' + api.key + '&page=' + page})
		.then(function(response){
			$http({method:'GET', url: api.url + 'movie/' + response.data.results[item].id + '?api_key=' + api.key + '&append_to_response=trailers'})
			.then(function(response){
				return movieInfo.update(response.data);
			})
		});

	}

	return http;
}]);

module.factory('functions', function(){
	var method = {};

	method.deleteItem = function(array, id){
		for(var i = 0; i <= array.length - 1; i++){
			if(array[i].id === id){
				array.splice(i, 1);
			}
		}
		return array;
	}

	method.hasItem = function(array, id){
		for(var i = 0; i <= array.length - 1; i++){
			if(array[i].id === id)
					return 1;
			}
		return 0;
	}

	method.getIndex = function(array, id){
		for(var i = 0; i <= array.length - 1; i++){
  			if(array[i].id === id)
  				return i;
  		}
  		return null;
	}

	return method;
});

module.service('genres', function(){
	var genres = [];
	var blacklist = ['Erotic', 'Film Noir', 'Fan Film', 'Neo-noir', 'Road Movie', 'Sport', 'Sporting Event', 'TV movie', 'Music', 'Musical'];

	this.blacklistHas = function(name){
		for (var i = 0; i <= blacklist.length - 1; i++){
			if(blacklist[i] === name) return true;
		}
		return false;
	}

	this.getGenres = function(){
		return genres;
	}

	this.setGenres = function(data){
		for(var i = 0; i <= data.genres.length - 1; i++){
			if(!this.blacklistHas(data.genres[i].name)){
				genres.push({
					id: data.genres[i].id,
					genre: data.genres[i].name,
					class: this.setClass(false),
				});
			}
		}
	}

	this.setClass = function(boolean){
		if(boolean){
			return "selected";
		}
		return "unselected";
	}

});

module.factory('movieInfo', [ '$rootScope', function($rootScope){
	var movie = { data: {"adult":false,"backdrop_path":"/qbwVJPmEZS4c4t4Xgn0ZNqSDFzc.jpg","belongs_to_collection":null,"budget":10000000,"genres":[{"id":28,"name":"Action"},{"id":878,"name":"Science Fiction"},{"id":53,"name":"Thriller"},{"id":10769,"name":"Foreign"}],"homepage":"","id":71254,"imdb_id":"tt1117581","original_title":"Arena","overview":"David Lord finds himself forced into the savage world of a modern gladiatorial arena, where men fight to the death for the entertainment of the online masses.","popularity":0.4995614375,"poster_path":"/3a84UEOIJcwdEaSGaMTMC6h7g4K.jpg","production_companies":[{"name":"Sony Pictures Home Entertainment","id":5388}],"production_countries":[{"iso_3166_1":"US","name":"United States of America"}],"release_date":"2011-10-11","revenue":0,"runtime":94,"spoken_languages":[{"iso_639_1":"en","name":"English"}],"status":"Released","tagline":"There's no greater battle... Than the battle for your life.","title":"Arena","vote_average":4.8,"vote_count":19,"trailers":{"quicktime":[],"youtube":[{"name":"Trailer Hd","size":"HD","source":"3rOBJZn4JFo","type":"Trailer"}]}},
				update: function(data){
					movie.data = data;
					$rootScope.$broadcast('movie.update');
				}
				};
	return movie;
}]);

module.factory('youtube', [function(){

}]);