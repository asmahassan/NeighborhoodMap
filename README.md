# Neighborhood Map

**Auther:** Asmaa Hassan.

**Date:** Feb 5, 2017.

##Description:
This project is part of Udacity FrontEnd nanodegre, 


##Project Overview
Develop a single page application featuring a map of Amsterdam, and highlighting the top Meuseums in Amsterdam City center area. 
The application include the following functionality:
- Higlight locations using google maps markers. <a href="https://developers.google.com/maps/">Google Maps API</a>, is used to render the map and markers.
- Provide information about the Muesuem, including contact, descreption, rating , and website. The information is fetched from Foursquare using <a href="https://developer.foursquare.com/overview/venues.html">FourSquare venues API</a> V2.
- Provide current weather for Amsterdam city. The weather information is featech from openweathermap.orp using their JSON <a href="https://openweathermap.org/api">API</a> V2.5.
- Include side bar with the list of Meuseums visable on the map.
- Include search bar to allow the user filtering the visable muesuems using their names. As soon as user type on the search bar the list get filtered dynamicly.
- <a href="http://knockoutjs.com">Knockout framework</a> is used to handle the list, filter, and information in the page that subject to state change.
- For mobile users, the left side bar can be hiden, to provide more space for the map canvas.


### You can read the project specification at the following url:
- https://review.udacity.com/#!/rubrics/17/view


##Project Instruction:

### You can test the application using the following steps:
- Clone or Download the project files from the following git repository:
https://github.com/asmahassan/NeighborhoodMap

- Create local webserver (e.g. python -m SimpleHTTPServer or XAMPP)

- Open the index.html file in your Browser to launch the application.


### Application usage instruction:
- When the map load, you can click on any of the markers on the list to read more information about the specific museum.
- You can also use the left side bar to get more information about the selected museum.
- To filter the Museum in the map and the list please use the Seach bar on the top side of the page.
- To recenter the map, you can click on the "re-center map" icon on the top right of the map canvas.
- To view the current weather status in Amsterdam city, please click on the weather icon on the top right of the map canvas.
- For mobile users, you can hide the left side bar by clicking on the "X" icon on top of the side bar.
- To show the side bar again, you can click on the "Hamburger" Icon on the top left side of the navigation bar.
