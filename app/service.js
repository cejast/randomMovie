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
			$http({method:'GET', url: api.url + 'movie/' + response.data.results[item].id + '?api_key=' + api.key})
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
	var movie = { data: {"adult":false,"backdrop_path":"/jjAq3tCezdlQduusgtMhpY2XzW0.jpg","belongs_to_collection":{"id":121938,"name":"The Hobbit Collection","poster_path":"/4MyjzLpdX6H0Voj7H2kIgNgowli.jpg","backdrop_path":"/7wO7MSnP5UcwR2cTHdJFF1vP4Ie.jpg"},"budget":250000000,"genres":[{"id":28,"name":"Action"},{"id":12,"name":"Adventure"},{"id":14,"name":"Fantasy"}],"homepage":"http://www.thehobbit.com/","id":49051,"imdb_id":"tt0903624","original_title":"The Hobbit: An Unexpected Journey","overview":"Bilbo Baggins, a hobbit enjoying his quiet life, is swept into an epic quest by Gandalf the Grey and thirteen dwarves who seek to reclaim their mountain home from Smaug, the dragon.","popularity":35.0927029899782,"poster_path":"/nGLrjWHsFcz62Xw6Epz84j5faWZ.jpg","production_companies":[{"name":"Warner Bros. Pictures","id":174},{"name":"Metro-Goldwyn-Mayer Pictures","id":6127}],"production_countries":[{"iso_3166_1":"US","name":"United States of America"},{"iso_3166_1":"NZ","name":"New Zealand"}],"release_date":"2012-12-12","revenue":1017003568,"runtime":169,"spoken_languages":[{"iso_639_1":"en","name":"English"}],"status":"Released","tagline":"From the smallest beginnings come the greatest legends.","title":"The Hobbit: An Unexpected Journey","vote_average":6.5,"vote_count":3867},
				update: function(data){
					movie.data = data;
					$rootScope.$broadcast('movie.update');
				}
				};
	return movie;
}]);