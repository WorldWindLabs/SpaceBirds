<a href="http://worldwind.arc.nasa.gov/spacebirds/"><img src="https://github.com/NASAWorldWindResearch/SpaceBirds/blob/master/spacebirdsheader.png" alt="Click to begin" align="center" /></a>

##Video Tutorial: 
[![SpaceBirds video tutorial](https://img.youtube.com/vi/ojp8Tqf2j0k/0.jpg)](https://www.youtube.com/watch?v=ojp8Tqf2j0k)

##SpaceBirds: The World of Satellites at your Fingertips

<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NASA_logo.svg/200px-NASA_logo.svg.png" height="100px" /><img src="http://oykun.com/images/journal-header-whitespace.png" width="30px" /><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/ESA_logo_simple.svg/200px-ESA_logo_simple.svg.png" height="100px" />

##Sections:

* [Introduction](#introduction)
* [Application Walk-Through](#application-walk-through)

    1. [Clicking on an object](#clicking-on-an-object)
    2. [Searching for a satellite](#searching-for-a-satellite)
    3. [Categorizing by Type](#categorizing-by-type)
    4. [Categorizing by Orbit Range](#categorizing-by-orbit-range)
    5. [Ground Stations](#ground-stations)
    6. [Time Control](#time-control)

##Introduction
There is an amazing amount of objects orbiting our planet, from the International Space Station to random debris. For most, it is difficult to imagine this amount of objects floating around us, as well as their placement and trajectories.

SpaceBirds, an application intended as both a visual and educational tool, as well as a satellite tracking application, can be used by professionals, students, and enthusiasts alike. The app is developed using NASA Web World Wind , and consists of an easy to use interface that allows the user to display all known tracked orbital objects and ground stations, and display their relative information, such as type, orbital period, low, medium, and high earth orbit, country of origin, and use, all in a 3D environment.

The user will have access to over 15,000 satellites and their information. He/She will be able to group them by classification and even create and store their own custom groups through a streamline search ability or merely by clicking on them, in order to gain information and closely follow individual satellites and groups.

The app will offer fun and exciting visual interactivity, by providing 3D models, visual fields of satellites, and future and past orbit paths, while providing a powerful tool, allowing the user to work with orbital bodies and corresponding ground stations, track satellite trajectory and position, provide heat maps of satellites past and future coverage of the earth’s surface, and act as a warning system for potential collisions with the earths surface and other orbital objects.

The application is still in its alpha stage as it still contains some bugs and is lacking some features we plan to incorporate.

![image](https://cloud.githubusercontent.com/assets/19692086/18044330/2fc07996-6d82-11e6-8d3e-2b8e084fab7b.png)

![image](https://cloud.githubusercontent.com/assets/19692086/18044175/534d5db2-6d81-11e6-9e09-e1931e266171.png)

<img src="http://i.imgur.com/KhmyPZ1.png"/>

<img src="http://i.imgur.com/trhnhue.png"/>


##Application Walk-Through:

###Clicking on an object

* A wide range of information about the clicked object is displayed in the right-hand column of the app, including its name, type, position, velocity, etc. 
* A "Horizon" circle is drawn on the globe which accurately represents the view (coverage area) of the particular satellite.
* An accurate orbit of the satellite is plotted. The red section of the orbit represents a path that has already been traversed, and the green section represents the path to be taken in the future. 
* A "Follow" function is turned on, which allows you to track the object as it moves. 
* Additional buttons appear at the bottom of the screen. 
    * Toggling the *Follow On* button controls whether or not the object will be followed, and so will clicking anywhere else on the globe. 
    * Toggling the *Horizon On* button controls whether or not the horizon circle is displayed.
    * Toggling the *Orbit On* button controls  whether or not the orbit path is displayed.
    * Toggling the *Model On* button controls whether or not the 3D model of the object is displayed (Note that the model is only visible if the object is zoomed into)
    * Clicking on the *Add to Custom* button adds the object to your own Custom Group, which you can view separately by turning "Custom On" in the "Type" window in the left-hand column.
 
###Searching for a satellite

From the Search bar on the left-hand column, either type in the name of a satellite or select one from the drop-down menu. This will navigate the globe to center your view around this satellite, and it will also select that Satellite, which activates the same functions mentioned above for clicking on a satellite. 

###Categorizing by Type

Using the window on the left-hand column titled "Type", you can choose what type of objects you wish to be displayed in view around the globe. Those types include payloads, rocket bodies, or debris, as well as your own custom list.

###Categorizing by Orbit Range

Using the window in the left-hand column titled "Orbit Range", you can select one or more of the following orbit ranges to display satellites that correspond to them: Low Earth Orbit, Medium Earth Orbit, Geosynchronous, High Earth Orbit, and Unclassified. You can also use the slider placed here in order to control the length of the orbit that will be plotted around a selected object. Sliding to the right increases the length of the orbit. The date at the bottom of the slider shows the end date and time at which the future (green) orbit stops. The "mins" represent how many minutes of travel will the orbit be drawn for on each sides past, and present.

###Ground Stations

Using the window titled Ground Stations, you can search for a certain ground station by name, turn ground stations on and off, and add the horizon of the view of a ground station, or clear it. 

###Time Control

The Slider at the bottom of the screen allows you to change the date and time to a past or future value, and thereby change the entire view of everything around the globe accurately to that specific time. 


***

**Organization:** NASA Ames Research Center (PX)**

**Tutors:** Yann Voumard, Florin Draghici**

**Authors:** Miguel Del Castillo, Bert Stewart, Julija Semenenko**

**Developers:** Farah Salah, Enika Biswas, Nidhi Jain, Jenipher Gonzalez, Nancy Hernandez**

**Acknowledgements:** Benjamin Chang, Gabriel Militão, Khaled Sharif**
