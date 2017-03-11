var weatherModule = angular.module("ForecastApp", [])
    
    weatherModule.controller("WeatherServiceController", ["$scope", "$http", 
        "GoogleGeolocationService", "DarkSkyWeatherService",
        function($scope, $http, 
                 GoogleGeolocationService,
                 DarkSkyWeatherService){
	   
            var wsc = this;
            
            wsc.cityName = "";
            wsc.cityState = "";
            wsc.selected_lat = 0;
            wsc.selected_lon = 0;
        
            //key: sdfgsde5dfgsdfg34tsdfg

            //App name    
            wsc.app_name = "Weather App";
        
            wsc.cities = 
            [
                {
                    name: "Amarillo",
                    url_name: "Amarillo",
                    state: "TX",
                    lat: 0,
                    lon: 0
                }, 
                {
                    name: "Anchorage",
                    url_name: "Anchorage",
                    state: "AK",
                    lat: 0,
                    lon: 0
                },
                {
                    name: "Denver",
                    url_name: "Denver",
                    state: "CO",
                    lat: 0,
                    lon: 0
                },
                {
                    name: "Booker",
                    url_name: "Booker",
                    state: "TX",
                    lat: 0,
                    lon: 0
                },
                {
                    name: "Canyon",
                    url_name: "Canyon",
                    state: "TX",
                    lat: 0,
                    lon: 0
                }
                
            ]; 
            

            
            function update(){
            
            wsc.getLatLonForSelected = function(){
                GoogleGeolocationService.geoLocate(wsc.selected_city)
                    .then(function(res){
                        wsc.selected_lat = res.data.results[0].geometry.location.lat;
                        wsc.selected_lon = res.data.results[0].geometry.location.lng;
                        
                        wsc.selected_city.lat = wsc.selected_lat;
                        wsc.selected_city.lon = wsc.selected_lon;
                        
                        
                        var google_static_maps_key = "AIzaSyCOgKIW8r1VYuabzxKlcHJoy_AH7L7cGhc";
                        
                        wsc.google_static_maps_url = "https://maps.googleapis.com/maps/api/staticmap?center=" +
                                                     wsc.selected_lat + "," +
                                                     wsc.selected_lon + 
                                                     "&zoom=10&size=600x300&key=" +
                                                     google_static_maps_key;
                                                     
                        console.log("Google Static Map API URL");
                        console.log(wsc.google_static_maps_url);                        
                        
                        
                        
                        
                        wsc.getCurrentConditions();        
                        
                    })
                    .catch(function(err){
                        console.log(err);
                    });
            };
            
            wsc.getCurrentConditions = function(){
                DarkSkyWeatherService.getCurrentConditions(wsc.selected_city)
                    .then(function(res){
                        console.log(res);
                        
                        
                        wsc.observation_time = new Date(res.data.currently.time * 1000);
                        wsc.temperature      = res.data.currently.temperature;
                        wsc.dewpoint         = res.data.currently.dewPoint;
                        wsc.windBearing      = res.data.currently.windBearing;
                        wsc.windSpeed        = res.data.currently.windSpeed;
                        wsc.icon             = res.data.currently.icon;
                        
                    })
                    .catch(function(err){
                        
                    })
            };
            //converts temp reading from darksky to degrees
            wsc.convertTempToCelsius = function(){
                var celsius = (wsc.temperature - 32) * (5/9);
                celsius = celsius.toFixed(2);
                return celsius;
            }
            
            //converts dewpoint from darksky to degrees
            wsc.convertDewPointToCelsius = function(){
                var dewPointToCelsius = (wsc.dewpoint - 32) * (5/9);
                dewPointToCelsius = dewPointToCelsius.toFixed(2);
                return dewPointToCelsius;
            }
            
            //function to convert wind bearing angles to strings found at http://stackoverflow.com/questions/7490660/converting-wind-direction-in-angles-to-text-words by Matt Frear
            wsc.degToCompass = function(){
                var deg = Math.floor((wsc.windBearing / 22.5) + 0.5);
                var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
                return arr[(deg % 16)];
            }
            //Switch statement function to return pictures to corresponding icons
            wsc.getSummaryPic = function(){
                switch(wsc.icon){
                    case "clear-day":
                        var picUrl = "http://worldartsme.com/images/clear-day-weather-clipart-1.jpg";
                        break;
                        
                    case "clear-night":
                        var picUrl = "http://www.clker.com/cliparts/p/c/x/W/z/X/weather-clear-night-hi.png"
                        break;
                        
                    case "rain":
                        var picUrl = "http://images.clipartpanda.com/insulation-clipart-7QAI_weather_symbols_icons_clip_art.jpg"
                        break;
                        
                    case "snow":
                        var picUrl = "https://img.clipartfest.com/758b4748095936a1e07946ec33a654b5_e0cc839097cc4f3cab225aaffa362e-clipart-weather-symbols-free_425-352.jpeg"
                        break;
                        
                    case "sleet":
                        var picUrl = "http://preview.cutcaster.com/901278630-sleet-illustration.jpg"
                        break;
                        
                    case "wind":
                        var picUrl = "http://www.clipartbest.com/cliparts/biy/654/biy654X5T.png"
                        break;
                    
                    case "fog":
                        var picUrl = "http://www.clipartkid.com/images/24/overcast-icon-clip-art-at-clker-com-vector-clip-art-online-royalty-X6dQlc-clipart.png"
                        break;
                        
                    case "cloudy":
                        var picUrl = "http://clipart-library.com/data_images/185142.png"
                        break;
                        
                    case "partly-cloudy-day":
                        var picUrl = "http://www.clipartkid.com/images/30/weather-symbols-clip-art-at-clker-com-vector-clip-art-online-z80WzV-clipart.png"
                        break;
                        
                    case "partly-cloudy-night":
                        var picUrl = "http://clipart-library.com/data_images/185278.png"
                        break;
                        
                    default:
                        console.log("Current conditions icon")
                        
                }
                
                return picUrl;
                
            }

            
            
            
            
            wsc.getLatLonForSelected();
                        

            }
            //watches for changes in drop down list
            $scope.$watch('wsc.selected_city', update);
            wsc.selected_city = wsc.cities[0];
    }])
    weatherModule.directive('myConditionsSpecial', ['$sce', function($sce){
        
        //a reminder on naming conventions for directives: 
        //https://medium.com/@cironunesdev/angularjs-how-to-name-directives-118ac44b81d4#.idz35zby4

        /* https://docs.angularjs.org/guide/directive
        The restrict option is typically set to:

        'A' - only matches attribute name
        'E' - only matches element name
        'C' - only matches class name
        'M' - only matches comment
        */
        
        return{
            restrict: 'E',
            scope: true,
            templateUrl: $sce.trustAsResourceUrl('currentConditions.html')
        }
    }])
    weatherModule.factory('GoogleGeolocationService', ['$sce', '$http', 
        function($sce, $http){
            //https://docs.angularjs.org/api/ng/service/$sce
            
            //create an empty object
            var geolocationService = {};
            
            //Google Maps Geocoding API key   
            var key = "AIzaSyDBgB8eg5y-lBtvajdLZO-86Y7n0sgOp4M";
            
            geolocationService.geoLocate = function(location){

                var address = "+" + location.name + ",+" + location.state;
                var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" +
                          address + "&key=" + key;

                var trustedurl = $sce.trustAsResourceUrl(url);
                return $http.get(trustedurl);
            }
            
            return geolocationService;            
            
        }])
        
    weatherModule.factory('DarkSkyWeatherService',['$sce', '$http', 
        function($sce, $http){
            //work happens here
            
            var darkSkyWeatherService = {};
            
            //DarkSky API key
            var key = "4e4bfa1c9d0ee8e8cae8d0c27a34ecbd";
            
            darkSkyWeatherService.getCurrentConditions = function(location){
                
                var url = "https://api.darksky.net/forecast/" +
                          key + "/" + location.lat + "," + location.lon;
                          
                console.log("DarkSky API URL:");
                console.log(url);
                
                var trustedurl = $sce.trustAsResourceUrl(url);
                return $http.jsonp(trustedurl, {jsonpCallbackParam: 'callback'});
                
            }
            
            return darkSkyWeatherService;
        }
    ]);

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    