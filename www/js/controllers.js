angular.module('starter.controllers', [])

.controller('DashCtrl', function($ionicPlatform, $scope, $httpParamSerializerJQLike, $http,$rootScope) {
  $scope.posts = [];

  $scope.getPosts = function(){
    if(!$rootScope.location.lon || !$rootScope.location.lat) return;
     return $http({
        url:'http://shoutshout.herokuapp.com/api/posts/'+$rootScope.location.lon+'/'+$rootScope.location.lat,
      }).then(function(data){
          console.log(data);
          $scope.posts = data.data;
      });
  };  
  $rootScope.$watchCollection('location',$scope.getPosts)
})

.controller('PostShowCtrl',function($scope,$http,$stateParams, $httpParamSerializerJQLike,$rootScope){
  $scope.post = {}
  $scope.getPost = function(){
   return $http({
      url:'http://shoutshout.herokuapp.com/api/posts/'+$stateParams.postId
    }).then(function(data){
        $scope.post = data.data;
        console.log($scope.post)
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
      url:'http://shoutshout.herokuapp.com/api/posts/'+$stateParams.postId,
      data: $httpParamSerializerJQLike({comment:$scope.comment.comment}),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then(function(data){
      $scope.comment.comment = ""
      return $http({
        url:'http://shoutshout.herokuapp.com/api/posts/'+$stateParams.postId
      }).then(function(data){
          $scope.post = data.data;
      });
    });
  };
})

.controller('NewShoutCtrl', function($scope, $http, $httpParamSerializerJQLike,$window,$rootScope) {

  $scope.shout ={
    post:'',
    location:{
      lon:$rootScope.location.lon,
      lat:$rootScope.location.lat
    }
  };

  $scope.newShout = function(){
    console.log($scope.shout.post)
    return $http({
      method: 'POST',
      url:'http://shoutshout.herokuapp.com/api/posts',
      data: $httpParamSerializerJQLike({post:$scope.shout.post,location:$scope.shout.location}),
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
