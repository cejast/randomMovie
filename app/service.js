var randomMovieService = angular.module('randomMovieService', []);

randomMovieService.service('service', function($http){

	var api = '09e09aca22efd2b0335a2b5f780baad8';
	var genres = [];

	this.getAPI = function(){
		return api;
	}

	this.getGenres = function(){
		return genres;
	}

	this.setGenres = function(data){
		for(var i = 0; i <= data.genres.length - 1; i++){
			genres.push({
				id: data.genres[i].id,
				genre: data.genres[i].name
			});
		}
	};

	this.getGenreById = function(id){
		for(var i = 0; i <= genres.length - 1; i++)
			if(genres[i].id === id){
				return genres[i].genre;
			}
	}

});