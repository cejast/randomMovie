var app = angular.module('randomMovie', ['randomMovieController', 'randomMovieService']);

app.config( function ($httpProvider) {
	delete $httpProvider.defaults.headers.common['X-Requested-With'];
});