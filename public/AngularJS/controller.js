var FoodOnline = angular.module('FoodOnline', ['ngMap','ui.router','ngFileUpload','uiGmapgoogle-maps']);

		FoodOnline.config(function($stateProvider, $urlRouterProvider) {
	    $urlRouterProvider.otherwise('/')

	    $stateProvider

	    
	    // route for the main page
            .state('main', {
            	url: '/',  
                templateUrl : 'views/main.html'
               
            })
            
        // route for the main page for consumer
            .state('mainconsumer', {
            	url: '/mainconsumer',  
                templateUrl : 'views/mainconsumer.html'
               
            })
            
        
        // route for the main page for provider
            .state('mainprovider', {
            	url: '/mainprovider',  
                templateUrl : 'views/mainprovider.html'
               
            })
            
            
            // route for the login page
             .state('login', {
            	url:'/login',
                templateUrl : 'views/login/login.html'
               
            })
            // route for the signup page
             .state('signup', {
            	 url:'/signup',
                templateUrl : 'views/login/signup.html'
               
            })
            
            
             // route for the displayitem page
             .state('displayitem', {
            	 url:'/displayitem',
                templateUrl : 'views/displayitem.html'
               
            })
            
            
            // route for the consumer page
            .state('consumer', {
            	 url:'/profile/consumer',
                templateUrl : 'views/profile/consumer/consumer.html'
               
            })
            // route for the serarch page
            .state('consumer.search', {
            	 url:'/search',
                templateUrl : 'views/profile/consumer/search.html'
               
            })
            // route for the cart page
            .state('consumer.cart', {
            	 url:'/cart',
                templateUrl : 'views/profile/consumer/cart.html'
               
            })
            // route for the order page
            .state('consumer.order', {
            	 url:'/order',
                templateUrl : 'views/profile/consumer/order.html'
               
            })
            // route for the profile page
            .state('consumer.profile', {
            	 url:'/profile',
                templateUrl : 'views/profile/consumer/profile.html'
               
            })
            // route for the changepassword page
            .state('consumer.changepassword', {
            	 url:'/changepassword',
                templateUrl : 'views/profile/consumer/changepassword.html'
               
            })
            // route for the message page
            .state('consumer.message', {
            	 url:'/message/:message',
                templateUrl : 'views/profile/consumer/message.html'
               
            })
            // route for the map page
            .state('consumer.map', {
            	 url:'/map',
                templateUrl : 'views/profile/consumer/map.html'
               
            })
            
           
            
            // route for the map--menu page
            .state('consumer.map.menu', {
            	 url:'/menu',
                templateUrl : 'views/profile/consumer/menu.html'
               
            })
            // route for the googlemap page
            .state('consumer.googlemap', {
            	 url:'/googlemap',
                templateUrl : 'views/profile/consumer/googlemap.html'
               
            })
             // route for the provider page
            .state('provider', {
            	 url:'/profile/provider',
                templateUrl : 'views/profile/provider/provider.html'
               
            })
            
             // route for the message page
            .state('provider.message', {
            	 url:'/message/:message',
                templateUrl : 'views/profile/provider/message.html'
               
            })
            
            // route for the listitem page
           .state('provider.listitem', {
        	    url:'/listitem',
                templateUrl : 'views/profile/provider/listitem.html'
          
            })
            
            // route for the createitem page
           .state('provider.createitem', {
        	    url:'/createitem',
                templateUrl : 'views/profile/provider/createitem.html'
          
            })
             // route for the updateitem page
           .state('provider.updateitem', {
        	    url:'/updateitem',
                templateUrl : 'views/profile/provider/updateitem.html'
          
            })
           
             // route for the orders page
           .state('provider.orders', {
        	    url:'/orders',
                templateUrl : 'views/profile/provider/orders.html'
          
            })
             // route for the commentsreceive page
           .state('provider.commentsreceive', {
        	    url:'/commentsreceive',
                templateUrl : 'views/profile/provider/commentsreceive.html'
          
            })
             // route for the commentsgive page
           .state('provider.commentsgive', {
        	    url:'/commentsgive',
                templateUrl : 'views/profile/provider/commentsgive.html'
          
            })
             // route for the info page
           .state('provider.info', {
        	    url:'/info',
                templateUrl : 'views/profile/provider/info.html'
          
            })
             // route for the mylocation page
           .state('provider.mylocation', {
        	    url:'/mylocation',
                templateUrl : 'views/profile/provider/mylocation.html'
          
            })
            
             // route for the security page
           .state('provider.security', {
        	    url:'/security',
                templateUrl : 'views/profile/provider/security.html'
          
            })
            
              // route for the changepassword page
           .state('provider.changepassword', {
        	    url:'/changepassword',
                templateUrl : 'views/profile/provider/changepassword.html'
          
            })
            
         
 
        });