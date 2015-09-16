angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $http,$cordovaGeolocation) {

  $scope.posts = [];

var posOptions = {timeout: 10000, enableHighAccuracy: false};
  $ionicPlatform.ready(function(){
    $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function (position) {
        console.log(position)
      }, function(err) {
        // error
      });
  });
  $scope.getPosts = function(){
    
   return $http({
      url:'https://shoutshout.herokuapp.com/api/posts'
    }).then(function(data){
        console.log(data);
        $scope.posts = data.data;
    });
  };
  $scope.getPosts();

})

.controller('PostShowCtrl',function($scope,$http,$stateParams, $httpParamSerializerJQLike){
  $scope.post = {}
  $scope.getPost = function(){
   return $http({
      url:'https://shoutshout.herokuapp.com/api/posts/'+$stateParams.postId
    }).then(function(data){
        $scope.post = data.data;
    });
  };
  $scope.getPost();

  $scope.comment ={
    comment:''
  };

  $scope.newComment = function(){
    console.log($scope.comment.comment);
    return $http({
      method: 'POST',
      url:'https://shoutshout.herokuapp.com/api/posts/'+$stateParams.postId,
      data: $httpParamSerializerJQLike({comment:$scope.comment.comment}),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then(function(data){
      $scope.comment.comment = ""
      return $http({
        url:'https://shoutshout.herokuapp.com/api/posts/'+$stateParams.postId
      }).then(function(data){
          $scope.post = data.data;
      });
    });
  };
})

.controller('NewShoutCtrl', function($scope, $http, $httpParamSerializerJQLike,$window) {

  $scope.shout ={
    post:''
  };

  $scope.newShout = function(){
    console.log($scope.shout.post)
    return $http({
      method: 'POST',
      url:'https://shoutshout.herokuapp.com/api/posts',
      data: $httpParamSerializerJQLike({post:$scope.shout.post}),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then(function(data){
      $window.location.href = '#/tab/post/'+data.data._id
    });
  };

})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
