var app = angular.module('starter');

app.config(function($httpProvider) {
    $httpProvider.defaults.headers.common = {};
  $httpProvider.defaults.headers.post = {};
  $httpProvider.defaults.headers.put = {};
  $httpProvider.defaults.headers.patch = {};
});





app.controller('MenuCtrl', function($http,$scope,$cordovaGeolocation,$stateParams,$ionicLoading,$ionicPlatform){
      

      //create order array
      $scope.orders = [];
      $scope.items = [];
      $scope.locations = [];
      $scope.count;
      $scope.Latitude;
      $scope.Longitude;
      $scope.originlat;
      $scope.originlong;
      $scope.p = 0;

            $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
            originlat  = position.coords.latitude;
            originlong = position.coords.longitude;
            $scope.originlat=originlat;
            $scope.originlong=originlong;   
            console.log(originlat+ "   "+originlong);      
             
        }, function(err) {
            $ionicLoading.hide();
            console.log(err);
        });
      
      //retrive processing order count for side menu
      $http.get( "https://www.kioski.co/wc-api/v3/orders/count?filter[status]=processing&consumer_key=ck_e6d3f3e923a9e33a75c4415792c75251082aceea&consumer_secret=cs_7d5c16fd0cfb77b426261d8e3fcfe12c9018250e").then(
      function(returnedData){

          $scope.count = returnedData.data.count;
          
          console.log(returnedData);

     }, function(err){
         console.log(err);
     })
     
      //retrive processing overs from store using woocommerce API and extract data
      $http.get( "https://www.kioski.co/wc-api/v3/orders?filter[meta]=true&consumer_key=ck_e6d3f3e923a9e33a75c4415792c75251082aceea&consumer_secret=cs_7d5c16fd0cfb77b426261d8e3fcfe12c9018250e").then(
      function(returnedData){

          $scope.orders = returnedData.data.orders;

          $scope.orders.forEach(function(element, index, array){
              //latitude = position.coords.latitude;
              //longitude = position.coords.longitude;
              //calculate distance from the store
              latitude = (element.order_meta.latitude); 
              longitude= (element.order_meta.longitude);
             storelatitude = -3.4033229;  
             storelongitude= 36.7047686;
    
             //resevrse geocoding to dtermine the location details
             $http.get( "https://maps.googleapis.com/maps/api/geocode/json?latlng="+latitude+","+longitude+"&key=AIzaSyBDEHonAaVf0douP3tdO5f5snt-KU-oMZQ").then(
             function(returnedData){
           
            
            $scope.locations = returnedData.data.results;
           
            //console.log(locations);
            $scope.locations.forEach(function(element2, index, array){
            
             //$scope.location = (element2.address_components[1].short_name);
            
            $scope.locationdetail = element2.place_id;
             //console.log(element2.formatted_address);
              }, function(err){
             console.log(err);
             })
            
            //latitude = position.coords.latitude;
            //$scope.customerlocation = $scope.locations;
            
             

             }, function(err){
             console.log(err);
             })

             
             //calcluates the distance
             p = 0.017453292519943295;
             c = Math.cos;
             a = 0.5 - c((storelatitude - latitude) * p)/2 +
             c(latitude * p) * c(storelatitude * p) *
             (1 - c((longitude - storelongitude) * p))/2;
             d = 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
             element.order_meta.distance= d.toFixed(1);
               
              lineitem = []; 
              lineitemarray= element.line_items;
              lineitemarraylength = lineitemarray.length;
              
              for (index =0; index <lineitemarraylength; index++)
              {
              items = [];
              items.push(element.line_items[index].name);
              //$scope.quantity = (element.line_items[i].quantity);
              $scope.itemdetails = items;
              }
              })
              
          //orderID = $scope.orders.Object.id;
          //console.log(orders);
         // var obj = orders[Object];
        /*
          for (var key in orders){
            if (!orders.hasOwnProperty(key)) continue;
            
            var obj = orders[key];

            for (var prop in obj) {
        // skip loop if the property is from prototype
        if(!obj.hasOwnProperty(prop)) continue;

        //code
        
        console.log(prop + " = " + obj[prop]);
      
    }
}
*/


          
          //destinationlatitude = order.order_meta.Latitude;
          //destinationlongitude = order.order_meta.Longitude;
          //console.log(destinationlongitude);
          //var originlong = returnedData.data.order.order_meta.Longitude;
      

     }, function(err){
         console.log(err);
     })
    //find the location of the courier and determine distance
      var posOptions = {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 0
        };
 

        //calculate distance using geolocation
        //double earthRadius = 6371000; //meters
        //double dLat = Math.toRadians(lat2-lat1);
        
         //$scope.setSelected = function(selected) {
         //$scope.selected = selected;
      

       // }

//}  

})





app.controller('PostCtrl',function($http,$scope,$cordovaGeolocation,$stateParams,$ionicLoading,$ionicPlatform) {
  
  //save data after time interval
   
   
 

  $scope.savedata = function (){
    //button to udelivery status and stream courier location
  $http({
                    method: 'put', // support GET, POST, PUT, DELETE
                    url: "https://www.kioski.co/wc-api/v3/orders/"+$stateParams.orderId+"?filter[meta]=true&consumer_key=ck_e6d3f3e923a9e33a75c4415792c75251082aceea&consumer_secret=cs_7d5c16fd0cfb77b426261d8e3fcfe12c9018250e",
                    data: '{"order":{"status": "completed"}}',
                    headers: 
                      "Content-Type: application/x-www-form-http://192.168.43.88:8100/"
                    ,
                    timeout: 30000, // timeout abort AJAX
                    cache: false
                }).
                success(function(data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available
                    console.log("success", data);
                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    console.error("error", data);
                });
                };
//button to stream location
    last_lon = 0;
    last_lat = 0;
    watchID = null;
    //PouchDB = require('pouchdb');
    db = new PouchDB('localdb');
    remotedb = 'https://seciessudahistiongulauti:7a6a71c23a14a92e0bcc46d648a36ceec60dbec0@kioski.cloudant.com/locationtracker';
    
    $scope.startwatch = function (){
      //set the order status to processing
        $http({
                    method: 'put', // support GET, POST, PUT, DELETE
                    url: "https://www.kioski.co/wc-api/v3/orders/"+$stateParams.orderId+"?filter[meta]=true&consumer_key=ck_e6d3f3e923a9e33a75c4415792c75251082aceea&consumer_secret=cs_7d5c16fd0cfb77b426261d8e3fcfe12c9018250e",
                    data: '{"order":{"status": "in_progress"}}',
                    headers: 
                      "Content-Type: application/x-www-form-http://192.168.43.88:8100/"
                    ,
                    timeout: 30000, // timeout abort AJAX
                    cache: false
                }).
                success(function(data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available
                    console.log("success", data);
                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    console.error("error", data);
                });
    


    watchID = $cordovaGeolocation.watchPosition(doWatch, watchError);

    console.log("start watch done");
    function watchError(err) {
        alert('Error' + err.code + ' msg: ' + err.message);
    
    };
 
    function doWatch() {

             var posOptions = {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 0
        };

            $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
            var lat  = position.coords.latitude;
            var lon = position.coords.longitude;
            console.log(lat + "    "+ lon);
            console.log("working");
            
            
            last_lon = lon;
            last_lat = lat;


           var coord = {
            "type":"Feature",
            "geometry": {
                "type":"Point",
                "coordinates": [ lon, lat ]
            },
            "properties": {
                "timestamp": position.timestamp
            }
        }; 
           
            db.post(coord, function callback(err, response) {
            if ( err ) { if ( err ) { alert('POST ERROR: '+err); } }

            db.get(response.id, function callback(err, doc) {
                if ( err ) {
                  document.getElementById('message').innerHTML = ('ERROR GETting doc from pouchdb: '+err);
                }


               console.log(position.coords.longitude);
               console.log(position.coords.latitude);
               //document.getElementById('message').innerHTML = new Date(position.timestamp*1000);
                   });
        });
            

        }, function(err) {
            $ionicLoading.hide();
            console.log(err);
        });
    }

function stopWatch() {

    if( watchID)
        $cordovaGeolocation.clearWatch(watchID); 
    console.log("watch stopped");
}


function saveToServer()
{
console.log("saving data");

 db.replicate.to(remotedb)
          .on('complete', function(info){

            msg = ' ...replicated ' + info.docs_written + ' docs at ' + info.start_time;
            document.getElementById('info4').innerHTML = msg;
        })
          .on('error', function(err) {
            document.getElementById('info4').innerHTML = err;
            ;});


}

//location streamer

   myVar = setInterval(time, 60000);
    function time ()
    {
    //var d = new Date();
    //document.getElementById("demo").innerHTML = d.toLocaleTimeString();
    doWatch();
    stopWatch();
    saveToServer();
   
   }
 //call the streamer function with the other functions inside
  time();

}
  
  //end location stream
  $scope.stopwatch = function() {
  clearInterval(myVar);


}

  //}

//retrive details about a specific order
  $http.get("https://www.kioski.co/wc-api/v3/orders/"+$stateParams.orderId+"?filter[meta]=true&consumer_key=ck_e6d3f3e923a9e33a75c4415792c75251082aceea&consumer_secret=cs_7d5c16fd0cfb77b426261d8e3fcfe12c9018250e"). then(


  function(returnedData){
    $scope.order = returnedData.data.order;
    $scope.latitude = returnedData.data.order.order_meta.latitude;
    $scope.longitude = returnedData.data.order.order_meta.longitude;
    destinationlatitude = $scope.latitude;
    destinationlongitude = $scope.longitude;
    
    //console.log(order.order_meta.Latitude);
    

   console.log(returnedData);

  }, function(err){
     
      console.log(err);

  })
  

  //geolocation
  var posOptions = {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 0
        };
 
        $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
            originlat  = position.coords.latitude;
            originlong = position.coords.longitude;
           
           //console.log($scope.Latitude + "   " + $scope.Longitude);
             
            //var myLatlng = new google.maps.LatLng(lat, long);
             
            //var mapOptions = {
                //center: myLatlng,
                //zoom: 16,
                //mapTypeId: google.maps.MapTypeId.ROADMAP
            //};          
             
            //var map = new google.maps.Map(document.getElementById("map"), mapOptions);          
             
            //$scope.map = map;   
            //$ionicLoading.hide();           
             
        }, function(err) {
            $ionicLoading.hide();
            console.log(err);
        });
})

app.controller('orderCtrl',function($http,$scope,$cordovaGeolocation,$stateParams,$ionicLoading,$ionicPlatform) {
  
  $scope.savedata = function (){
    //button to update order
    console.log("this works");
  
  $http({
                    method: 'put', // support GET, POST, PUT, DELETE
                    url: "https://www.kioski.co/wc-api/v3/orders/"+$stateParams.orderId+"?filter[meta]=true&consumer_key=ck_e6d3f3e923a9e33a75c4415792c75251082aceea&consumer_secret=cs_7d5c16fd0cfb77b426261d8e3fcfe12c9018250e",
                    data: '{"order":{"status": "completed"}}',
                    headers: 
                      "Content-Type: application/x-www-form-http://192.168.43.88:8100/"
                    ,
                    timeout: 30000, // timeout abort AJAX
                    cache: false
                }).
                success(function(data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available
                    console.log("success", data);
                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    console.error("error", data);
                });
                };

//retrive details about a specific order
  $http.get("https://www.kioski.co/wc-api/v3/orders/"+$stateParams.orderId+"?filter[meta]=true&consumer_key=ck_e6d3f3e923a9e33a75c4415792c75251082aceea&consumer_secret=cs_7d5c16fd0cfb77b426261d8e3fcfe12c9018250e"). then(


  function(returnedData){
    $scope.order = returnedData.data.order;
    $scope.latitude = returnedData.data.order.order_meta.latitude;
    $scope.longitude = returnedData.data.order.order_meta.longitude;
    destinationlatitude = $scope.latitude;
    destinationlongitude = $scope.longitude;
    
    //console.log(order.order_meta.Latitude);
    

   console.log(returnedData);

  }, function(err){
     
      console.log(err);

  })
  

  //geolocation
  var posOptions = {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 0
        };
 
        $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
            originlat  = position.coords.latitude;
            originlong = position.coords.longitude;
           
           //console.log($scope.Latitude + "   " + $scope.Longitude);
             
            //var myLatlng = new google.maps.LatLng(lat, long);
             
            //var mapOptions = {
                //center: myLatlng,
                //zoom: 16,
                //mapTypeId: google.maps.MapTypeId.ROADMAP
            //};          
             
            //var map = new google.maps.Map(document.getElementById("map"), mapOptions);          
             
            //$scope.map = map;   
            //$ionicLoading.hide();           
             
        }, function(err) {
            $ionicLoading.hide();
            console.log(err);
        });
})








