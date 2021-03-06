angular.module('starter.controllers', [])

.controller('DashCtrl', function($ionicPlatform, $scope, $httpParamSerializerJQLike, $http,$rootScope,socket,$cordovaGeolocation) {
  $scope.posts = [];
  $scope.newPosts = 0;
  $scope.offset = 0;
  $scope.button = 'button-light';
  $ionicPlatform.ready(function(){
    var posOptions = {timeout: 10000, enableHighAccuracy: true};
    $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function (position) {
        $rootScope.location.lat = position.coords.latitude;
        $rootScope.location.lon = position.coords.longitude;
        $rootScope.locSetTime = new Date();
      }, function(err) {
        // error
      });
  });
  $scope.getPosts = function(){
    if(!$rootScope.location.lon || !$rootScope.location.lat) return;
     return $http({
        url:'http://shoutshout.herokuapp.com/api/posts/'+
        $rootScope.location.lon+
        '/'+$rootScope.location.lat+
        '/'+$rootScope.range+
        '/'+$scope.offset
      }).then(function(data){
          // console.log(data,$rootScope.range);
          if($scope.offset > 0){
          for(i=0;i<data.data.length;i++){
          $scope.posts.push(data.data[i])
          }
          }else{
            $scope.posts = data.data
          }
          $scope.button = 'button-light'
          $scope.newPosts = 0;
          if(data.data.length === 10){
            $scope.moar = true;
          }else{
            $scope.moar = false;
          };
      });
  };  
  $scope.setOff = function(off){
    $scope.offset = off;
  };
  socket.on('new post',function(post){
    if((post.location.lat>=$rootScope.location.lat - $rootScope.range) &&
     (post.location.lat<=$rootScope.location.lat + $rootScope.range)&&
     (post.location.lon>=$rootScope.location.lon - $rootScope.range)&&
     (post.location.lon<=$rootScope.location.lon + $rootScope.range)){
    $scope.newPosts = $scope.newPosts +1
    $scope.button = 'button-calm'
    }
  })
     $rootScope.$watchCollection('location',$scope.getPosts)
})

.controller('PostShowCtrl',function($scope,$http,$stateParams, $httpParamSerializerJQLike,$rootScope,socket){
  $scope.post = {}
  $scope.getPost = function(){
   return $http({
      url:'http://shoutshout.herokuapp.com/api/posts/'+$stateParams.postId
    }).then(function(data){
        $scope.post = data.data;
        // console.log($scope.post);
    });
  };
  $scope.getPost();

  $scope.comment ={
    comment:'',
    poster:$rootScope.first +' '+ $rootScope.last
  };

  $scope.newComment = function(){
    console.log($scope.comment.comment);
    return $http({
      method: 'POST',
      url:'http://shoutshout.herokuapp.com/api/posts/'+$stateParams.postId,
      data: $httpParamSerializerJQLike({comment:$scope.comment.comment,poster:$scope.comment.poster}),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then(function(data){
      $scope.comment.comment = ""
      socket.emit('new comment')
    });
  };
  socket.on('new comment', function(){
    return $http({
        url:'http://shoutshout.herokuapp.com/api/posts/'+$stateParams.postId
      }).then(function(data){
          $scope.post.comments = data.data.comments;
      });
  })
})

.controller('NewShoutCtrl', function($scope, $http, $httpParamSerializerJQLike,$window,$rootScope,socket) {

  $scope.shout ={
    post:'',
    poster:$rootScope.first +' '+ $rootScope.last,
    location:{
      lon:$rootScope.location.lon,
      lat:$rootScope.location.lat
    }
  };

  $scope.newShout = function(){
    if (!$rootScope.location.lon ||!$rootScope.location.lat){
      alert("Looks like your location isn't set. Try updating it in settings!")
    }else{
    return $http({
      method: 'POST',
      url:'http://shoutshout.herokuapp.com/api/posts',
      data: $httpParamSerializerJQLike({post:$scope.shout.post,location:$scope.shout.location,poster:$scope.shout.poster}),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then(function(data){
      socket.emit('new post',{location:$scope.shout.location})
      $scope.shout.post = '';
      $window.location.href = '#/tab/post/'+data.data._id
    });
    };
  };

})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope,$rootScope,$ionicPlatform,$cordovaGeolocation) {
  $scope.setTime = $rootScope.locSetTime;
  $scope.setRange = function(range){
    $rootScope.range = range
  }
  $scope.resetLocation = function(){
    $ionicPlatform.ready(function(){
    var posOptions = {timeout: 10000, enableHighAccuracy: true};
    $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function (position) {
        $rootScope.location.lat = position.coords.latitude;
        $rootScope.location.lon = position.coords.longitude;
        $rootScope.locSetTime = new Date();
        console.log($rootScope.location,$rootScope.locSetTime)
      }, function(err) {
        // error
      });
  });
  }
});
