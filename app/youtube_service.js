var youtube = angular.module('youtubeService', []);

youtube.service('youtubePlayerApi', ['$window', '$rootScope', '$log', function ($window, $rootScope, $log) {
        var service = $rootScope.$new(true);

        $window.onYouTubeIframeAPIReady = function () {
            $log.info('Youtube API is ready');
            service.bindVideoPlayer('youtube_player');
            service.ready = true;
            service.loadPlayer();
    		$rootScope.$apply();
        };

        service.ready = false;
        service.playerId = null;
        service.player = null;
        service.videoId = '3rOBJZn4JFo';
        service.playerHeight = '240';
        service.playerWidth = '426';

        service.bindVideoPlayer = function (elementId) {
            $log.info('Binding to player ' + elementId);
            service.playerId = elementId;
        };

        service.createPlayer = function () {
            $log.info('Creating a new Youtube player for DOM id ' + this.playerId + ' and video ' + this.videoId);
            return new YT.Player(this.playerId, {
                height: this.playerHeight,
                width: this.playerWidth,
                videoId: this.videoId
            });
        };

        service.loadPlayer = function () {
            if (this.ready && this.playerId) {
                if(this.player) {
                    this.player.destroy();
                }
                this.player = this.createPlayer();
            }
        };

        service.setVideo = function(videoId){
		    this.videoId = videoId;
		    service.loadPlayer();
        }

        return service;
}]);