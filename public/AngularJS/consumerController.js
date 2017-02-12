var userinfo;
var shops;
var markers=[];
FoodOnline.controller('consumerController',function($scope,$http,$state, $stateParams){
	$http.get('/userInfo')
	.success(function(data){
//	  alert(JSON.stringify(data));
	  $scope.username=data[0].name;
	  $scope.user=data[0];
      userinfo=data[0];
      $http.post('/sellerinfo')
      .success(function(data){
    	  shops=data;
    	  for(var i=0;i<shops.length;i++){
        	  markers[i]={
        			  "id":shops[i].name,
        			  "latitude":shops[i].location[1],
        			  "longitude":shops[i].location[0]
        	  }
          }
    	 
      })
  })
  .error(function(data){
	  $state.go('login');
//	  alert(JSON.stringify(data));
  });
  
	


	//update user info
	$scope.updateuser=function(user){
//		alert(JSON.stringify(user));
		$http.post('/updateuser',user)
		.success(function(data){
			$state.go('consumer.message',{"message":"success update user information"})
		})
		.error(function(data){
			$state.go('consumer.message',{"message":"can not update user information"})
		})
	}
	
});


//change password
FoodOnline.controller('consumerchangepasswordController',function($scope,$http,$state, $stateParams){
	 
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
//				alert(JSON.stringify(args));
				$http.post('/changepassword',args)
			    .success(function(data){
				   $state.go('consumer.message',{"message":"success change password"})
			     })
			    .error(function(data){
				   $state.go('consumer.message',{"message":"can not change password"})
			    })
			}
		}
  })
  .error(function(data){
	  $state.go('login');
//	  alert(JSON.stringify(data));
  })
});


//consumer map controller
FoodOnline.controller('mapController',function($scope,$state,$http,NgMap){
	$http.get('/userInfo')
	.success(function(data){

	  $scope.user=data[0];
	  $scope.user.latitude=data[0].location[1];
	  $scope.user.longitude=data[0].location[0];
	  $http.post('/sellerinfo')
      .success(function(data){
    	  var sellers=[];
    	  for(var i=0;i<data.length;i++){
    		  sellers[i]={
    				  "shopname":data[i].shopname,
    				  "name":data[i].name,
    				  "telephone":data[i].tel,
    				  "latitude":data[i].location[1],
    				  "longitude":data[i].location[0],
    				  "user_id":data[i].user_id
    		  }
    	  }
    	  
    	  $scope.sellers =sellers;
         
     })
     .error(function(data){
	  
     });
  })
  .error(function(data){
	 
	  alert(JSON.stringify(data));
  });
	NgMap.getMap().then(function(map) {
		$scope.map=map;
	    
	  });
	$scope.showdata=function(event,seller){
		$scope.selectseller=seller;
		$scope.map.showInfoWindow('info-window', this);
		
	}
	
	$scope.menu=function(name){
		$http.post('/itemsbyprovider',{"name":name})
		.success(function(items){
//			alert(JSON.stringify(items));
            $scope.items=items;

		})
		.error(function(items){
			alert(JSON.stringify(items));
		})
	}
	
})
//FoodOnline.controller('locatorController', function($scope, $timeout, uiGmapGoogleMapApi) {
//
//	
//	$scope.map = {
//      center: userinfo.location,
//      control: {},
//      zoom: 8,
//      window: {
//        model: {},
//        show: false,
//        options:{
//          pixelOffset: {width:-1,height:-20}
//        }
//      },
//      
//      markers: markers,
//      markersEvents: {
//        click: function(marker, eventName, model, args) {
//          $scope.map.window.model = model;
//          $scope.map.window.show = true;  
//          
//        }
//      }
//    };
//	
//}).controller('templateController',function(){});

// search item for consumer
FoodOnline.controller('consumerSearchController',function($scope,$http,$state){
	
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
			
			
		})
		.error(function(data){
			console.log("Error:"+data);
		})

	}
})

//cart controller
FoodOnline.controller('cartController',function($scope,$state,$http){
	$http.get('/userInfo')
	.success(function(data){
	  $scope.carts=data[0].cart;
   })
   .error(function(data){
	
	  alert(JSON.stringify(data));
   });
  //delete the item from cart
  $scope.deleteitem=function(cart){
	  $http.post('/deleteitemfromcart',cart)
	  .success(function(data){
		  $http.get('/userInfo')
			.success(function(data){
			  $scope.carts=data[0].cart;
			  $state.go('consumer.cart')
		   })
		   .error(function(data){
			
			  alert(JSON.stringify(data));
			  
		   });
	  })
	  .error(function(data){
		  alert(JSON.stringify(data));
	  })
  }
  
  //create order
  $scope.checkout=function(carts){
	  var consumer=$scope.user;
	  
	  var item_info=[];
	  for(var i=0;i<carts.length;i++){
		  item_info[i]={
				name:carts[i].name, 
				unitPrice:carts[i].unitPrice,
				status:"unprocess",
				owner_name:carts[i].owner_name,
				owner_tel:carts[i].owner_tel,
				item_id:carts[i].item_id
	  }
	  
	  }
	  var order={
			  item_info:item_info,
			  consumer_name:consumer.name,
			  consumer_tel:consumer.tel
     }
	 if(JSON.stringify(order.consumer_tel)==null)
		 {
		    $scope.messagecart="do not have your phone number,please update your profile"
		 }
	  
//	 alert(JSON.stringify(order));
	 else{
		 $scope.messagecart="";
		 $http.post('/createorder',order)
		 .success(function(data){
			 $http.post('/updateuser',{"cart":[]})
			 .success(function(data){
				 $state.go('consumer.order')
			 })
			 .erro(function(data){
				 alert(JSON.stringify(data));
			 })
		 })
		 .error(function(data){
			 alert(JSON.stringify(data))
		 })
	 }
	 

	  
	  
  }
  
  
  
});


//order controller
FoodOnline.controller('orderConsumerController',function($scope,$state,$http){
	$http.get('/userInfo')
	.success(function(data){
//	  alert(JSON.stringify(data));
	  $scope.user=data[0];
   })
  .error(function(data){
	  
	  alert(JSON.stringify(data));
  });
	$http.post("/orderinfo",{"name":$scope.user.name})
	.success(function(data){
		$scope.orders=data;
//		alert(JSON.stringify(data))
	})
	.error(function(data){
		alert(JSON.stringify(data))
	})
	$scope.deleteitemfromOrder=function(order_id,item){
		if(item.status=="unprocess")
		{
		$scope.message="";
		var order_id=order_id;
		var sendjson={
				order_id:order_id,
				item:item
		}
		$http.post('/deleteitemfromOrder',sendjson)
		.success(function(data){
			$http.post("/orderinfo",{"name":$scope.user.name})
			.success(function(data){
				$scope.orders=data;
				$state.go('consumer.order')
			})
			.error(function(data){
				alert(JSON.stringify(data))
			})
			
		})
		.error(function(data){
			alert(JSON.stringify(data))
		})
	}
		else{
			$scope.message="can not delete process item!";
		}
}
	
});


//consumer message
FoodOnline.controller('consumerMessageController',function($scope,$state,$stateParams){
	$scope.message=$stateParams.message;
});