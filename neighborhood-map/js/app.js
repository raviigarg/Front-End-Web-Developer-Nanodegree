/*open the side navigation and set the left maegin of map to 300px*/
function openNav() {
	document.getElementById("side-bar").style.display = "block";
	document.getElementById("map").style.marginLeft = "300px";
}

/*closes the side navigation and set the left maegin of map to 0*/
function closeNav() {
	document.getElementById("side-bar").style.display = "none";
	document.getElementById("map").style.marginLeft = "0";
}

/*location data, Modal in MVvM */
var locations = [
	{
		title: 'Jantar Mantar',
		location: {lat: 26.924944, lng: 75.824549},
		id: '4bb594102f70c9b668628430'
	},
	{
		title: 'Central Park',
		location: {lat: 26.900430, lng: 75.813046},
		id: '4d60fad4149637047078ec94'
	},
	{
		title: 'Hawa Mahal',
		location: {lat: 26.926919, lng: 75.827929},
		id: '4f6858fee4b0eebfb4db8492'
	},
	{
		title: 'Jaigarh Fort',
		location: {lat: 26.985317, lng: 75.845614},
		id: '4c8b41fd1797236a768b6988'
	},
	{
		title: 'Birla Mandir',
		location: {lat: 26.892371, lng: 75.815551},
		id: '4ce6a853d8be6a315cb25642'
	}
];

/*View Modal*/
var map;
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
	center: {
		lat: 26.9091044,
		lng: 75.7637728
		},
	zoom: 12
	});

	ko.applyBindings(new ViewModal());
}

// shows error when there is error in loading of application
function errorMap(){
    window.alert("Ooops! Something went wrong with google maps API");
}

var ViewModal = function() {
	var self  = this;
	this.markers = ko.observableArray([]);
	this.venueTitle = ko.observable('');
	// knockout variables
	var marker;
	var content;
	
	var defaultIcon = makeMarkerIcon('ff0000');
	var highLightedIcon = makeMarkerIcon('0000ff');

	var bounds = new google.maps.LatLngBounds();
	var largeInfowindow = new google.maps.InfoWindow();

	/*update the markers on view when character is input in text field*/
	this.markersUpdate = function() {
		if(self.venueTitle().length !== 0) {
			for(var i = 0; i< locations.length; i++) {
				if(locations[i].title.toLowerCase().indexOf(self.venueTitle().toLowerCase()) >= 0) {
					self.markers()[i].visiblity(true);
					self.markers()[i].setVisible(true);
				} else {
					self.markers()[i].visiblity(false);
					self.markers()[i].setVisible(false);
				}
			}
		} else {
			for(var i = 0; i< locations.length; i++) {
				self.markers()[i].visiblity(true);
				self.markers()[i].setVisible(true);
			}

		}
	};

	/*fetch the info of likes and rating of place by json request from foursquare API */
	this.likesRatingInfo = function(marker) {
		$.ajax({
			url: "https://api.foursquare.com/v2/venues/" + marker.id + "?client_id=J04D2RK44N3GKI4B3XGVIHQNFRWD0MHG4J4JUKZSQMJ4NRXR&client_secret=YI1WUU3G3LUSQ4C5P01FB5MNVCLSP0MHKSTLQSWMMQWSSGIT&v=20171231",
			dataType: "json",
			success: function(data) {
				var result = data.response.venue;
				marker.likes = result.hasOwnProperty('likes') ? result.likes.summary : "No likes";
				marker.rating = result.hasOwnProperty('rating') ? result.rating : "No rating";
			},
			//alert if there is error in json request
			error: function (e) {
	             window.alert("Foursquare data is unavailable. Please try again later.");
			}
		});
	};

	/*when marker is clicked it bounce*/
	this.markerBounce = function(marker) {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            marker.setAnimation(null);
        }, 500);
	};

	/*add the info of marker to the infoWindow and open the infoWindow*/
	this.populateInfoWindow = function(marker, infowindow) {
		if(infowindow.marker != marker) {
			infowindow.marker = marker;
			infowindow.setContent('');
			var streetViewService = new google.maps.StreetViewService();
			var radius = 50;

			//street view of marker in the radius of 50m
			function getStreetView(data, status) {
				if(status == google.maps.StreetViewStatus.OK) {
					var nearStreetViewLocation = data.location.latLng;
					var heading = google.maps.geometry.spherical.computeHeading(nearStreetViewLocation, marker.getPosition());
					infowindow.setContent('<div><h5>'+marker.title+'</h5></div><div id="pano"></div><div><p>Likes: '+marker.likes+'</p><p>Rating: '+marker.rating+'</p></div>');
					var panoramaOptions = {
						position: nearStreetViewLocation,
						pov: {
							heading: heading,
							pitch: 30
						}
					};
					var panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), panoramaOptions);
				} else {
					infowindow.setContent('<div><h5>'+marker.title+'</h5></div><div>No Street View Found</div><div><p>Likes: '+marker.likes+'</p><p>Rating: '+marker.rating+'</p></div>');
				}
			}

			streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
			infowindow.open(map, marker);
			infowindow.addListener('closeclick', function() {
					infowindow.marker = "";
			});
		}
	};

	for(var i = 0; i < locations.length; i++) {
		marker = new google.maps.Marker({
			position: locations[i].location,
			title: locations[i].title,
			icon: defaultIcon,
			animation: google.maps.Animation.DROP,
			id: locations[i].id,
			visiblity: ko.observable(true)
		});
		this.likesRatingInfo(marker);
		self.markers().push(marker);
		bounds.extend(locations[i].location);
		marker.setMap(map);
		//event listeners to the markers
		marker.addListener('click', function() {
			self.populateInfoWindow(this, largeInfowindow);
		});
		marker.addListener('click', function() {
			self.markerBounce(this);
		});
		marker.addListener('mouseover', function() {
			this.setIcon(highLightedIcon);
		});
		marker.addListener('mouseout', function() {
			this.setIcon(defaultIcon);
		});
	}

	map.fitBounds(bounds);

	/*Populate infoWindow when list item is clicked*/
	this.populateWindow = function() {
		self.markerBounce(this);
		self.populateInfoWindow(this, largeInfowindow);
	};

	//function to change the color of marker 
	function makeMarkerIcon(markerColor) {
		var markerImage = new google.maps.MarkerImage('http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|'+markerColor,
			new google.maps.Size(21, 34),
			new google.maps.Point(0, 0),
			new google.maps.Point(10, 34),
			new google.maps.Size(21, 34)
			);
		return markerImage;
	}
}