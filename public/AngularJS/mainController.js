FoodOnline.controller('mainController',function($scope,$http,$state){
	
	
	
	$scope.displayitem=function(item){
		
		$scope.item=item;
		$state.go("displayitem")
	}
	$scope.addcart=function(item){
		
		$http.get('/userInfo')
		.success(function(data){
			$scope.user=data[0];
          if(data[0].cart.length==0)
        	  {
        	    $http.post('/addArrayToUser',item)
        	    .success(function(data){
			    alert("success add to cart")
			    $state.go("consumer.search")

		       })
		      .error(function(data){
			     console.log("Error:"+data);
		       })
        	  }
          else{
        	  var flag=true;
        	  for(var i=0;i<data[0].cart.length;i++){
        		  if(item.id==data[0].cart[i].item_id){
        			     flag=false;
        		  }
        	  }
        	  if(flag==false){
        		  alert("this item has already in cart")
    			  $state.go("consumer.search")
        	  }
        	  if(flag==true){
        		  $http.post('/addArrayToUser',item)
    			  .success(function(data){
    				  alert("success add to cart")
    				    $state.go("consumer.search")
	             })
	             .error(function(data){
		         console.log("Error:"+data);
	             })
        	  }
          }
	      
	  })
	  .error(function(data){
		  $state.go('login');
//		  alert(JSON.stringify(data));
	  });
	}
	
	//back to the search page
	$scope.back=function(){
		$state.go('consumer.search');
	}
	
});
FoodOnline.controller('serachController',function($scope,$http,$state){
	//findAllItem
	$scope.findAllItem=function(){
		$http.get('/itemFindAll')
        .success(function(data) {
        	$scope.items=data;
           
        })
        .error(function(data) {
            console.log('Error:' + data);
        });
		
	}
	
	//searchByKeyword
	$scope.searchByKeyword=function(){
		$http.post('/itemsByKeyword',{"keyword":$scope.keyword})
		.success(function(data){
			$scope.items=data;
			
			if(JSON.stringify(data)==null){
				$scope.messagesearch="Do not find item matched the keyword!"
			}
			else{
				$scope.messagesearch=""
			}
			
		})
		.error(function(data){
			console.log("Error:"+data);
		})

	}
})


FoodOnline.controller('serachController_consumer',function($scope,$http,$state){
	
	//findAllItem
	$scope.findAllItem=function(){
		$http.get('/itemFindAll')
        .success(function(data) {
        	$scope.items=data;
        	
        })
        .error(function(data) {
            console.log('Error:' + data);
        });
		
	}
	
	//searchByKeyword
	$scope.searchByKeyword=function(){
		$http.post('/itemsByKeyword',{"keyword":$scope.keyword})
		.success(function(data){
			$scope.items=data;
			
			if(JSON.stringify(data)==[]){
				$scope.messagesearch="Do not find item matched the keyword!"
			}
			else{
				$scope.messagesearch=""
			}
			
		})
		.error(function(data){
			console.log("Error:"+data);
		})

	}
})


FoodOnline.controller('serachController_provider',function($scope,$http,$state){
	
	//findAllItem
	$scope.findAllItem=function(){
		$http.get('/itemFindAll')
        .success(function(data) {
        	$scope.items=data;
        	if(JSON.stringify(data)==[]){
				$scope.messagesearch="Do not find item matched the keyword!"
			}
			else{
				$scope.messagesearch="";
			}
        })
        .error(function(data) {
            console.log('Error:' + data);
        });
		
	}
	
	//searchByKeyword
	$scope.searchByKeyword=function(){
		$http.post('/itemsByKeyword',{"keyword":$scope.keyword})
		.success(function(data){
			$scope.items=data;
			
		})
		.error(function(data){
			console.log("Error:"+data);
		})

	}
})



