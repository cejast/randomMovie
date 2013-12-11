var app = angular.module('randomMovie', ['randomMovieController', 'randomMovieService']);

app.config( function ($httpProvider) {
	delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

app.run(function(){
	var tag = document.createElement('script');
    tag.src = "http://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
});