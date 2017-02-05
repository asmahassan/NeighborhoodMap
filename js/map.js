//foursquare API info
var CLIENT_ID = "W1GFTDZFWZMVTYVRP1EV0N4WSUMQ5VBSV1MDXYMB0N5YMWAH";
var CLIENT_SECRET = "TQLE1DOWEYXCOIQIR4M0O1OJBOTILJSMQB3Y23FSIOVWYF4T";

// Global variables and location array definition.
var map, infoWindow, infoContent;
var amsterdamCenterlat = 52.370216;
var amsterdamCenterlng = 4.895168;
// Weather information variables
var units = 'metric';
var temp;
var country = 'NL';
var weatherCity = "amsterdam"
// Meusum locations variables
var cityCenter;
var locations = [
  {title: 'Museum of Bags and Purses', location: { lat: 52.365270, lng: 4.896824 }, foursquareID: '4a270703f964a520ae8c1fe3'},
  {title: 'Van Gogh Museum', location: { lat: 52.358416, lng: 4.881076}, foursquareID: '4a2706faf964a5208c8c1fe3'},
  {title: 'Stedelijk Museum', location: { lat: 52.358011, lng: 4.879755 }, foursquareID: '4b5fe77bf964a5203fd029e3'},
  {title: 'EYE Filmmuseum', location: { lat: 52.384328, lng: 4.900809 }, foursquareID: '4de0c8681f6ece647382df30'},
  {title: 'Het Scheepvaartmuseum', location: { lat: 52.371708, lng: 4.914880}, foursquareID: '4a2706fff964a520a28c1fe3'},
  {title: 'Het Rembrandthuis', location: { lat: 52.369369, lng: 4.901235}, foursquareID: '4a2706f8f964a520888c1fe3'},
  {title: 'Museum Het Schip', location: { lat: 52.390401, lng: 4.873813}, foursquareID: '4a2706fef964a5209c8c1fe3'},
  {title: 'Amsterdam Pipe Museum', location: { lat: 52.364120, lng: 4.885286}, foursquareID: '509e66e4e4b0b11968f76947'},
  {title: 'Anne Frank House', location: { lat: 52.375218, lng: 4.883977}, foursquareID: '4af1b6faf964a5206ce221e3'}
];

// Museum constructor
// Credit https://discussions.udacity.com/t/having-trouble-accessing-data-outside-an-ajax-request/39072/10
var MuseumConstruct = function (data) {
    "use strict";
    this.title = ko.observable(data.title);
    this.lat = ko.observable(data.location.lat);
    this.lng = ko.observable(data.location.lng);
    this.id = ko.observable(data.foursquareID);
    this.marker = ko.observable();
    this.phone = ko.observable('');
    this.description = ko.observable('');
    this.address = ko.observable('');
    this.rating = ko.observable('');
    this.url = ko.observable('');
    this.canonicalUrl = ko.observable('');
    this.photoPrefix = ko.observable('');
    this.photoSuffix = ko.observable('');
    this.infoWindowContent = ko.observable('');
};

// initalizae google map perameters 
function initMap() {
  "use strict";
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: amsterdamCenterlat, lng: amsterdamCenterlng },
    zoom: 13,
    zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER,
            style: google.maps.ZoomControlStyle.SMALL
          },
          streetViewControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER
            },
  });
  infoWindow = new google.maps.InfoWindow({
        maxWidth: 400,
    });

  ko.applyBindings(new MyViewModel());
}

// View Model Start
var MyViewModel = function () {
    "use strict";
    var self = this;

    // Credit https://www.udacity.com/course/viewer#!/c-ud989-nd/l-3406489055/e-3464818693/m-3464818694
    // Create array for all museums 
    self.museumList = ko.observableArray([]);
    self.userInput = ko.observable('');
    self.visibleMuseums = ko.observableArray();
  
    // Populate the museum list by calling the museum constructor for each item in the locations array
    locations.forEach(function (museumItem) {
        self.museumList.push(new MuseumConstruct(museumItem));
    });

    // getWeatherData is used as helper function to pull weather informaiton from openweathermap.org via ajax api call.
    // getWeatherData need to be called outside the foreach loop as the weather info should be requested only once.
    getWeatherData(weatherCity);

    // for each Item in the museum list, fetch the museum data from Foursquare and store the info in the object constructor
    // also for every museum in the list create map marker.
    self.museumList().forEach(function (museumItem) {
      // getMuseumData use foursquare api to collect data about the meuseum in the location lists above.
      getMuseumData(museumItem);

      // Create Map markers
      var title = museumItem.title();
      var marker = new google.maps.Marker({
        map: map,
        position: new google.maps.LatLng(museumItem.lat(), museumItem.lng()),
        title: title,
        animation: google.maps.Animation.DROP
      });

      museumItem.marker = marker;
      
      // Create an onclick event to open an infowindow at each marker.
      google.maps.event.addListener(museumItem.marker, 'click', function () {
          self.hideWeather(); 
          infoWindow.open(map, this);
          // google map marker Bounce animation
          marker.setAnimation(google.maps.Animation.BOUNCE);
          map.setZoom(13);
          map.setCenter(marker.position);
          setTimeout(function () {
              marker.setAnimation(null);
          }, 500);
          //Build the infowindow content
          infoWindow.setContent(museumItem.infoWindowContent());
      });
    });

    // centerMap function is used to return to the center of the city when clicking the center map Icon on the right top side of the canvas.
    self.centerMap = function() {
      infoWindow.close();
      cityCenter = new google.maps.LatLng(amsterdamCenterlat, amsterdamCenterlng);
      map.panTo(cityCenter);
      map.setZoom(13);
    }


    // toggleWeather function is a helper function to toggle the weather card visiblity when used click show weather button.
    self.toggleWeather = function() {
      var weatherDiv = document.getElementById("weather-card");
      if (weatherDiv.style.visibility == "visible"){
        self.hideWeather();
      } 
      else {
        self.showWeather();
      }
    }
    // showWeather function is helper function to show the weather card,
    self.showWeather = function() {
      document.getElementById("weather-card").style.visibility = "visible"; 
      self.centerMap();
    }

    // hideWeather function is helper function to hide the weather card if user open infowindow or clicked on the map.
    self.hideWeather = function() {
      document.getElementById("weather-card").style.visibility = "hidden";
    }

    // go to marker is function used to activate the muesum marker when the Muesum  item clicked on the left side pane.
    self.goToMarker = function(clickedMuseumItem) {
      google.maps.event.trigger(clickedMuseumItem.marker, 'click');
    };


    // openNav function is used to toggle the navigation sidebar on.
    self.openNav = function() {
      document.getElementById("mySidenav").style.width = "25%";
    }

    // openNav function is used to toggle the navigation sidebar off.
    self.closeNav = function() {
      document.getElementById("mySidenav").style.width = "0";
    }

    // Create list for all the marker that should be visible,
    // in the begining all marker should be visible, and remote the items only if the user enter relevent name in the search bar.
    self.museumList().forEach(function(museum) {
      self.visibleMuseums.push(museum);
    });

    // filterMuseums function is used to filter the muserm map marker and list entries based on the user search entry.
    self.filterMuseums = function () {
        // Set all markers and places to not visible.
        var searchInput = self.userInput().toLowerCase();
        self.visibleMuseums.removeAll();
        self.museumList().forEach(function (museum) {
            museum.marker.setVisible(false);
            // set the place and marker as visible, If user input is included in the name, 
            if (museum.title().toLowerCase().indexOf(searchInput) !== -1) {
                self.visibleMuseums.push(museum);
            }
        });
        self.visibleMuseums().forEach(function (museum) {
            museum.marker.setVisible(true);
        });
        self.hideWeather();
    };

    // add map listener to center the map if the user closed the info window.
    google.maps.event.addListener(infoWindow,'closeclick',function(){
        self.hideWeather();
        self.centerMap();
        self.hideWeather();
    });

    // add map listener to close the infowindow and center the map if the user click on the map while the infowindow is open
    google.maps.event.addListener(map, "click", function(event) {
        infoWindow.close();
        self.centerMap();
        self.hideWeather();
    });


    // Make the info Window stylish :)
    //credit http://en.marnoto.com/2014/09/5-formas-de-personalizar-infowindow.html
    google.maps.event.addListener(infoWindow, 'domready', function() {
      // Reference to the DIV that wraps the bottom of infowindow
      var iwOuter = $('.gm-style-iw');
      /* Since this div is in a position prior to .gm-div style-iw.
       * We use jQuery and create a iwBackground variable,
       * and took advantage of the existing reference .gm-style-iw for the previous div with .prev().
      */
      var iwBackground = iwOuter.prev();
      // Removes background shadow DIV
      iwBackground.children(':nth-child(2)').css({'display' : 'none'});
      // Removes white background DIV
      iwBackground.children(':nth-child(4)').css({'display' : 'none'});
      // Moves the shadow of the arrow 76px to the left margin.
      iwBackground.children(':nth-child(1)').attr('style', function(i,s){ return s + 'left: 76px !important;'});
      // Moves the arrow 76px to the left margin.
      iwBackground.children(':nth-child(3)').attr('style', function(i,s){ return s + 'left: 76px !important;'});
      // Changes the desired tail shadow color.
      iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'rgba(72, 181, 233, 0.6) 0px 1px 6px', 'z-index' : '1'});
      // Reference to the div that groups the close button elements.
      var iwCloseBtn = iwOuter.next();
      // Apply the desired effect to the close button
      iwCloseBtn.css({opacity: '1', right: '38px', top: '3px', border: '7px solid #48b5e9', 'border-radius': '13px', 'box-shadow': '0 0 5px #3990B9'});
    });


};


// Get Weather info

function getWeatherData(city) {
    $.ajax({
        url: 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&units='+units+'&appid=8ecbea4d668deb8baf07e07dd0667890',
        dataType: "json",
        success: function (data) {
          $("#city-country").html(data.name+', '+data.sys.country);
          temp = data.main.temp;
          $("#temp").html(data.main.temp+" &deg;C"); 
          $("#weather-description").html(data.weather[0].description);
          $("#weather-main").html(data.weather[0].main);
          $(".icon").html('<img src="http://openweathermap.org/img/w/'+data.weather[0].icon+'.png" height="60px" width="60px">');
        },
        error: function (e){

        }
    });
}

// Get data about the Museum from foursuqre
function getMuseumData(museumItem){
    var museumID = museumItem.id()
    // Make AJAX request to Foursquare
    $.ajax({
        url: 'https://api.foursquare.com/v2/venues/' + museumID + 
        '?client_id='+ CLIENT_ID + '&client_secret=' + CLIENT_SECRET + '&v=20130815',
        dataType: "json",
        success: function (data) {
            // Make results easier to handle
            var result = data.response.venue;
            var contact = result.hasOwnProperty('contact') ? result.contact : 'Not available';
            if (contact.hasOwnProperty('formattedPhone')) {
                museumItem.phone(contact.formattedPhone || '');
            }
            var location = result.hasOwnProperty('location') ? result.location : 'Not available';
            if (location.hasOwnProperty('address')) {
                museumItem.address(location.address || '');
            }
            var bestPhoto = result.hasOwnProperty('bestPhoto') ? result.bestPhoto : '';
            if (bestPhoto.hasOwnProperty('prefix')) {
                museumItem.photoPrefix(bestPhoto.prefix || '');
            }
            if (bestPhoto.hasOwnProperty('suffix')) {
                museumItem.photoSuffix(bestPhoto.suffix || '');
            }
            var description = result.hasOwnProperty('description') ? result.description : 'This Museum has no description available at the moment.' + 
            ' please check again later';
            museumItem.description(description || '');

            var rating = result.hasOwnProperty('rating') ? result.rating : 'Rating not avialable';
            museumItem.rating(rating || 'none');

            var url = result.hasOwnProperty('url') ? result.url : 'URL not available';
            museumItem.url(url || '');

            museumItem.canonicalUrl(result.canonicalUrl);
            buildInfoWindow(museumItem);
        },
        // Alert the user on error. Set messages in the DOM and infowindow
        error: function (e) {
            infowindow.setContent('<p>Foursquare data is unavailable. Please try refreshing later.</p>');
        }
    });
};

// helper funciton to create the infowindow contents..
function buildInfoWindow(museumItem){
    museumItem.infoWindowContent('<div id="iw-container">' +
                                      '<div class="iw-title">' + museumItem.title() + '</div>' +
                                      '<div class="iw-content">' +
                                          '<div class="iw-subTitle">Museum Information:</div>' +
                                          '<img src="' + museumItem.photoPrefix() + '200x200' + museumItem.photoSuffix() +
                                          '" alt="Image Location">' + 
                                          '<p><b>Phone:</b> ' + museumItem.phone() + '</p>' +
                                          '<p><b>Address:</b> ' + museumItem.address() + '</p>' + 
                                          '<p><b>description:</b> ' + museumItem.description() + '</p>' +
                                          '<p><b>Rating:</b> ' + museumItem.rating() + '</p>' +
                                          '<p><a href=' + museumItem.url() + '>' + museumItem.url() + '</a></p>' +
                                          '<p><a target="_blank" href=' + museumItem.canonicalUrl() + '>Foursquare Page</a></p>' +
                                          '<p><a target="_blank" href=https://www.google.com/maps/dir/Current+Location/' + museumItem.lat() + ',' + museumItem.lng() + '>Directions</a></p>' +
                                          '<p style="text-align:center;"><a href="https://foursquare.com"><b>Powered by Foursquare</b></a></p>' +
                                      '</div>' +
                                      '<div class="iw-bottom-gradient"></div>' +
                                  '</div>'); 
};


