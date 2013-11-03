var randomMovieService = angular.module('randomMovieService', []);

randomMovieService.factory('api', function(){
	var api = '09e09aca22efd2b0335a2b5f780baad8';
	return api;
})

randomMovieService.factory('apiUrl', function(){
	var apiUrl = 'http://api.themoviedb.org/3/';
	return apiUrl;
})

randomMovieService.service('genres', function(){
	var genres = [];
	var blacklist = ['Erotic', 'Film Noir', 'Fan Film', 'Neo Noir', 'Road Movie', 'Sport', 'Sporting Event', 'TV movie'];

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
			return "selectedGenre btn btn-info";
		}
		return "genreSelect btn btn-primary";
	}

});