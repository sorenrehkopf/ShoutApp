angular.module('starter.services', [])

.factory('socket', function(socketFactory) {

  var myIoSocket = io.connect('http://localhost:3000');

    mySocket = socketFactory({
      ioSocket: myIoSocket
    });  

    return mySocket;

});
