FoodOnline.controller('providerController',function($scope,$http,$state, $stateParams){
		$http.get('/userInfo')
		.success(function(data){
//		  alert(JSON.stringify(data));
		  $scope.username=data[0].name;
		  $scope.user=data[0];
          
	  })
	  .error(function(data){
		  $state.go('login');
//		  alert(JSON.stringify(data));
	  })
	 
	  //list all items belong to provider
     $scope.listitem=function(){
			
			$http.get('/listitem')
			.success(function(items){
//				alert(JSON.stringify(items));
                $scope.items=items;
	
			})
			.error(function(items){
				alert(JSON.stringify(items));
			})
		}
	
	//update item for a certain item
	$scope.edititem=function(item){
//		alert("update a item:"+JSON.stringify(item));
		$scope.item=item;
		$state.go('provider.updateitem');
		
	}
	
	
	//update item for provider
	$scope.updateitem=function(item){
		
		
		$http.post('/updateitem',item)
		.success(function(data){
			$state.go('provider.listitem')
		})
		.error(function(data){
			alert(JSON.stringify(data));
		})
		
		
	}
	$scope.deleteitem=function(item){
		
		$http.post('/deleteitem',{"id":item.id})
		.success(function(data){
			$state.go('provider.message',{"message":"delete a dish"})
		})
		.error(function(data){
			$state.go('provider.message',{"message":"can not delete a dish"})
		})
	}
	
	//update user info
	$scope.updateuser=function(user){
		
		$http.post('/updateuser',user)
		.success(function(data){
			$state.go('provider.message',{"message":"success update user information"})
		})
		.error(function(data){
			$state.go('provider.message',{"message":"can not update user information"})
		})
	}
	
});
FoodOnline.controller('createitemController',function($scope,$http,$state, $stateParams,Upload){
	//create item for provider
	if($scope.user.tel==null){
		$scope.messagecreateitem="do not have your phone number, please update your profile!"
	}
	else{
		$scope.messagecreateitem="";
	
	$scope.createitem=function(){
		if (!$scope.data.file) {
	        return;
	    }
        
	    Upload.upload({
	        url: '/upload',
	        data: {file:$scope.data.file}
	    }).success(function (data) {
	    	var args={   		
		 			"name": $scope.name,
		 			"description" : $scope.description,	 		
		 			"unitPrice" : $scope.unitPrice,	 	
		 			"owner_tel":$scope.user.tel
		 			};
			$http.post('/createitem',args)
				
			.success(function(doc){
				$state.go('provider.message',{message:"success upload a new dish"});
				
			})
			.error(function(doc){
				alert(JSON.stringify(doc));
			})
	    }).error(function () {
	        logger.log('error');
	    });
	};
	
	}
});

FoodOnline.controller('providerchangepasswordController',function($scope,$http,$state, $stateParams){
	 
	$http.get('/userInfo')
	.success(function(data){
//	  alert(JSON.stringify(data));
	  $scope.username=data[0].name;
	  $scope.user=data[0];
      
	  
	//chage password
		$scope.changepassword=function(){
			if($scope.password1===$scope.password2){
				var args={
						"name":$scope.username,
						"password":$scope.password2
				};
				
				$http.post('/changepassword',args)
			    .success(function(data){
				   $state.go('provider.message',{"message":"success change password"})
			     })
			    .error(function(data){
				   $state.go('provider.message',{"message":"can not change password"})
			    })
			}
		}
  })
  .error(function(data){
	  $state.go('login');
//	  alert(JSON.stringify(data));
  })
});

FoodOnline.controller('providerMessageController',function($scope,$state,$stateParams){
	$scope.message=$stateParams.message;
});

//change item status in order 
FoodOnline.controller('orderProviderController',function($scope,$state,$http){
	$http.post('/orderinfoProvider',{name:$scope.user.name})
	.success(function(data){
//		alert(JSON.stringify(data))
		var items=[];
		var k=0;
		for(var i=0;i<data.length;i++){
			for(var j=0;j<data[i].item_info.length;j++)
				{
				    if(data[i].item_info[j].owner_name==$scope.user.name)
				    {
				      items[k]={
						   "item_id":data[i].item_info[j].item_id,
						   "order_id":data[i].order_id,
						   "name":data[i].item_info[j].name,
						   "unitPrice":data[i].item_info[j].unitPrice,
						   "status":data[i].item_info[j].status,
						   "consumer_name":data[i].consumer_name,
						   "consumer_tel":data[i].consumer_tel
						   
				     
				     }
				     k++;
//				     alert(JSON.stringify(items[i+j])+"==--=="+k)	 
				   }
				}
		}
//		alert(JSON.stringify(items))
		$scope.items=items;
//		for(var i=0;i<items.length;i++){
//			if(items[i].status=="process")
//				{
//				  
//				  $scope.changeitem=true;
//				}
//			else{
//				$scope.changeitem=false;
//			}
//		}
	
	})
	.error(function(data){
		alert(JSON.stringify(data))
	})
	
	$scope.changeitemstatus=function(item){
		item.status="process";
		if(item.status=="process"){
			$scope.message="have already accept the item order"
		}
		else{
			$scope.message=""
		}
		$http.post('/orderbyquery',{"order_id":item.order_id})
		.success(function(data){
//			alert(JSON.stringify(data))
			for(var i=0;i<data.length;i++)
				{
				 for(var j=0;j<data[i].item_info.length;j++)
					 {
					    if(data[i].item_info[j].item_id==item.item_id)
					    	{
					    	    data[i].item_info[j].status="process";
					    	}
					 }
				}
			var sendjson=data[0];
//			alert(JSON.stringify(sendjson))
			$http.post('/updateorder',sendjson)
			.success(function(doc){
				$scope.changeitem=true;
			})
			.error(function(data){
				alert(JSON.stringify(doc))
			})
			
		})
		.error(function(data){
			alert(JSON.stringify(data))
		})
//		alert(JSON.stringify(item))
	}
	
});

