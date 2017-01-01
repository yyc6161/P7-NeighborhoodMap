"use strict";
var locations = [
	{
		name: "Carnegie Hall",
		address: "881 7th Ave, New York, NY 10019",
		location: {lat: 40.765004, lng: -73.97985},
		imgUrl: "img/failMessage.png"
	},
	{
		name: "Central Park Zoo",
		address: "64th St and 5th Ave, New York, NY 10021",
		location: {lat: 40.767778, lng: -73.971833},
		imgUrl: "img/failMessage.png"
	},
	{
		name: "Webster Hall",
		address: "125 E 11th St, New York, NY 10003",
		location: {lat: 40.731777, lng: -73.989157},
		imgUrl: "img/failMessage.png"
	},
	{
		name: "Mercury Lounge",
		address: "217 E Houston St, New York, NY 10002",
		location: {lat: 40.722168, lng: -73.986746},
		imgUrl: "img/failMessage.png"
	},
	{
		name: "The Spotted Pig",
		address: "314 W 11th St, New York, NY 10014",
		location: {lat: 40.735607, lng: -74.006671},
		imgUrl: "img/failMessage.png"
	},
	{
		name: "Empire State Building",
		address: "350 5th Ave, New York, NY 10118",
		location: {lat: 40.74844, lng: -73.985655},
		imgUrl: "img/failMessage.png"
	},
	{
		name: "Tenement Museum",
		address: "103 Orchard St, New York, NY 10002",
		location: {lat: 40.718796, lng: -73.99007},
		imgUrl: "img/failMessage.png"
	}
];

/*
* This function calls a third-party API: the Flickr API, 
* it parses the json file and stores the address of the associated picture in the array location.
*/
function getImgFromFlickr(){
	var theUrl, imgID, imgFarm, imgServer, imgSecret;
	locations.forEach(function(location){
		theUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=56de27d389b39c42f7b663f6ed1f4494&text=' +
		location.name + '&content_type=1&media=photos&per_page=1&format=json&nojsoncallback=1';
		$.ajax({ 
			url: theUrl, 
			data: JSON.stringify(), 
			success: function(result, status){
				var tag = true;
				result.photos.photo[0].id ? imgID = result.photos.photo[0].id : tag = false;
				result.photos.photo[0].farm ? imgFarm = result.photos.photo[0].farm : tag = false;
				result.photos.photo[0].server ? imgServer = result.photos.photo[0].server : tag = false;
				result.photos.photo[0].secret ? imgSecret = result.photos.photo[0].secret : tag = false;
        		if(tag) location.imgUrl = "https://farm"+imgFarm+".staticflickr.com/"+imgServer+"/"+imgID+"_"+imgSecret+"_t.jpg";
        		else location.imgUrl = "img/failMessage.png";
      		},
      		error: function(){
      			location.imgUrl = "img/failMessage.png";
      	}});
	});
}
getImgFromFlickr();

var map;
var markers = [];
var largeInfowindow;

//This function as Google map callback function, its role is to initialize Google Maps
function initMap() {
	//Google Maps personalized style
	var styles = [
    {
        "featureType": "administrative",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "lightness": 33
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "color": "#f2e5d4"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#c5dac6"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#c5c6c6"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#e4d7c6"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#fbfaf7"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#acbcc9"
            }
        ]
    }];
    // Constructor creates a new map.
    map = new google.maps.Map(document.getElementById('map'), {
    	center: {lat: 40.7413549, lng: -73.9980244},
    	zoom: 13,
    	styles: styles,
        mapTypeControl: false
    });
    largeInfowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();

    // Style the markers a bit. This will be our listing marker icon.
    var defaultIcon = makeMarkerIcon('26A69A');

    // Create a "highlighted location" marker color for when the user mouses over the marker.
    var highlightedIcon = makeMarkerIcon('D4E157');

    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < locations.length; i++) {
        // Get the position from the location array.
        var position = locations[i].location;
        var title = locations[i].name;
        var address = locations[i].address;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i,
            address: address,
            icon: defaultIcon,
        });
        // Push the marker to array of markers.
        markers.push(marker);
        // Create an onclick event to open an infowindow at each marker.
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
            //When the mouse click the marker, the marker keep bouncing,
			//when the mouse click agein, the marker stop.
            var tag = true;
            if(this.getAnimation() !== null) tag = false;
            markers.forEach(function(m){
  				if(m.setAnimation() !== null) m.setAnimation(null);
  			});
  			if(tag) this.setAnimation(google.maps.Animation.BOUNCE);
        });
        bounds.extend(markers[i].position);

        marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
        });
        marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
        });
    }
    // Extend the boundaries of the map for each marker
    map.fitBounds(bounds);  

    google.maps.event.addDomListener(window, 'resize', function() {
  		map.fitBounds(bounds); 
	});  
}

/**
 * Error callback for GMap API request
 */
function mapError() {
  // Error handling
  alert("Sorry, an error happened so the map is failed to load:(. Please check the network connection or refresh the page.");
}

/* 
* This function populates the infowindow when the marker is clicked. We'll only allow
* one infowindow which will open at the marker that is clicked, and populate based on that markers position.
*/ 
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent('<div><strong>' + marker.title + '</strong><br>'+marker.address+
          	'<br><img src="'+locations[marker.id].imgUrl+'">'+'</div>');
        infowindow.open(map, marker);
    }
}

// This function will creat a personalized icon and return
function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21,34));
        return markerImage;
}

//Hides the specified marker
function hideMarker(i) {
    markers[i].setMap(null); 
}
//Displays the specified marker
function showMarker(i) {      
    markers[i].setMap(map);
}

/*
*The function of this function is to filter out the markers do not meet the requirements.
*/
function checkFilter(keyword){
	var tag = false;
	var bounds = new google.maps.LatLngBounds();
	locations.forEach(function(loc,i){
		//Check whether the location name contains keywords
		if(loc.name.indexOf(keyword)>=0){
			tag = true;
			showMarker(i);
			bounds.extend(markers[i].position);
			viewModel.locationList()[i].display(true);
		}else{
			hideMarker(i);
			viewModel.locationList()[i].display(false);
		}
	});
	// If there is a marker that meets the requirements, fix the boundary 
	if(tag) map.fitBounds(bounds);
}

var viewWidth = document.body.offsetWidth;

/*
* Here is knockout's viewModel
*/
var viewModel = {
	toggleTag: true,
	menuStatus: ko.observable('menu-hidden'),
	// This function toggles a class to perform the hiding/showing of slide-menu.
	changeMenuStatus: function() {
		if(this.toggleTag) {
			this.menuStatus('');
			this.toggleTag = false;
		}else {
			this.menuStatus('menu-hidden');
			this.toggleTag = true;
		}
	},
	// This function get user input text, then pass it to function checkFilter().
	filterKeyword: function() {
		var keyword = $(".keyword").val();
		checkFilter(keyword);
	},
	locationList: ko.observableArray([]),
	// This function add elements to Array locationList.
	addLocation: function() {
		locations.forEach(function(ele,i){
			viewModel.locationList.push({name: ele.name, id: i, click: function(){

				if(viewWidth < 800){
					viewModel.changeMenuStatus();
				}
				populateInfoWindow(markers[this.id], largeInfowindow);
				// When the mouse click the location, it's marker keep bouncing,
				// when the mouse click agein, the marker stop.
				var tag = true;
            	if(markers[this.id].getAnimation() !== null) tag = false;
            	markers.forEach(function(m){
  					if(m.setAnimation() !== null) m.setAnimation(null);
  				});
  				if(tag) markers[this.id].setAnimation(google.maps.Animation.BOUNCE);

			},mouseover: function(){
			// This function will change color of location's name and corresponding marker
				this.color('#CDDC39'); 
				markers[this.id].setIcon(makeMarkerIcon('D4E157'));

			},mouseout: function(){
				this.color('white');
				markers[this.id].setIcon(makeMarkerIcon('26A69A'));

			},display: ko.observable(true),color: ko.observable('white')});
		});
    },  
 };
viewModel.addLocation();
ko.applyBindings(viewModel);

// If the screen width is greater than 1000px, 
// I don't think the slide-menu need to be hidden from the beginning
if(viewWidth > 1000) viewModel.changeMenuStatus();