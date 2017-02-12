FoodOnline.controller('loginController',function($scope,$http,$state){
	$scope.login=function(){
	  $http.post('/login',{"username":$scope.username,"password":$scope.password})
	  .success(function(data){
		  if(data[0].type===1){
	    	   $state.go('consumer');
	       }
	       if(data[0].type===2){
	    	   $state.go('provider');
	       }	
	  })
	  .error(function(data){
		  $scope.message="username or password is wrong!"
	  })
	};

	$scope.signup=function(){
		$state.go('signup');
	}
});
