var app = angular.module('randomMovie', ['randomMovieController', 'randomMovieService', 'randomMovieDirective']);

app.config( function ($httpProvider) {
	delete $httpProvider.defaults.headers.common['X-Requested-With'];
});