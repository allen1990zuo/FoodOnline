FoodOnline.controller('signupController',function($scope,$http,$location,$state){
	
	$scope.$watch('password',function(now,old){
		var reg=/^(\w){6,20}$/; 
		if(reg.test(now)){
			$scope.messagepassword=""
		}
		else
		{
			$scope.messagepassword="the length of the password is 6-20, and just have alphabet,number,underline!"
		}
		
	})
	$scope.signup=function(){
		if($scope.usertype==undefined){
			$scope.messagetype="please select a user type!"
		}
		else{
			$scope.messagetype=" "
			$http.post('/signup',
					{"name":$scope.name,"password":$scope.password,"type":$scope.usertype})
			.success(function(data){
				
				if(JSON.stringify(data)=='true'){
					$scope.message="the username was already registered, please use another username"
					
				}
				else{
		       $state.go('login')
				}
			})
			.error(function(data){
				$scope.message=JSON.stringify(data);
				
			})
		}
	
	};
	
	$scope.login=function(){
		$state.go('login');
	}
});

