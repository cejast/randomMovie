var randomMovieService = angular.module('randomMovieService', []);

randomMovieService.service('service', function($http){

	var api = '09e09aca22efd2b0335a2b5f780baad8';
	var genres = [];
	var blacklist = ['Erotic', 'Film Noir', 'Fan Film', 'Neo Noir', 'Road Movie', 'Sport', 'Sporting Event', 'TV movie'];

	this.getAPI = function(){
		return api;
	}

	this.getGenres = function(){
		return genres;
	}

	this.blacklistHas = function(name){
		for (var i = 0; i <= blacklist.length - 1; i++){
			if(blacklist[i] === name) return true;
		}
		return false;
	}

	this.setGenres = function(data){
		for(var i = 0; i <= data.genres.length - 1; i++){
			if(!this.blacklistHas(data.genres[i].name)){
				genres.push({
					id: data.genres[i].id,
					genre: data.genres[i].name
				});
			}
		}
	};

	this.getGenreById = function(id){
		for(var i = 0; i <= genres.length - 1; i++)
			if(genres[i].id === id){
				return genres[i].genre;
			}
	}

});