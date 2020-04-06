##Hi SpaceApps participants!

As part of the SpaceApps hackathon, SpaceBirds is given as a resource for the [Orbital Scrap Metal](https://2019.spaceappschallenge.org/challenges/stars/orbital-scrap-metal-the-video-game/details) challenge since 2019.

SpaceBirds is a web application that displays all the objects tracked in Earth orbit in real time. It's built with the [NASA WorldWind 3D globe web library](https://github.com/NASAWorldWind/WebWorldWind) and it obtains the information of all the orbiting objects from a service set up by the US government.

Parts of SpaceBirds may prove useful for you in order to understand how the orbiting objects' information is obtained and shown in an application in real time, and at the same time, it can teach you one thing or two about how satellites orbit the Earth and how can we know their current, past, and present position at any given time.

You can also learn what are the categories of orbiting objects, and how to define and distinguish *orbital debris* among them. The definition may not be as clear-cut as you initially thought!

Since one of the requirements of the **Orbital Scrap Metal** challenge is to have real-world satellite information, SpaceBirds may prove you useful into how to request and obtain such information from an automated system. This is a very useful skill for any aspiring programmer that goes way beyond satellite tracking. Pretty much every online service that you use makes use of such automated systems.

## Sections:

* [Satellite data basics](#satellite-data-basics)
* [Data retrieval](#data-retrieval)
* [Rendering the orbital objects in WorldWind](#rendering-the-orbital-objects-in-worldwind)
* [Additional resources](#additional-resources)

### Satellite data basics

How does SpaceBirds (or pretty much any other satellite tracker, for the matter) tracks satellites in real time? 

One of the most recurring questions about SpaceBirds and satellite tracker applications is "Does it obtain constant updates on where the satellites are located?"

The answer is no, it's not needed to constantly obtain the positional information of a satellite to have an accurate idea of where it currently is above Earth (or any other celestial body, for that matter, but this guide is centered around our planet).

### Data retrieval

SpaceBirds obtains the information of the orbital objects from [https://www.space-track.org/](https://www.space-track.org/)

The backend portion of SpaceBirds retrieves the data about Earth's orbital environment from Space-track's API. The API's documentation can be consulted [here](https://www.space-track.org/documentation#/api). I suggest creating a free account with Space-track in order to increase the limits of requests that can be done per day.

The data comprises publicly available orbital parameters of objects tracked by the United State's Air Force 18th Space Control Squadron. 

As of March 23rd 2020, this comprises N objects, between payloads (operational and derelict), spent rocket stages, and general space debris with a radar cross-section (RCS) equal or above 5 cm.

Data is retrieved and cross-referenced with [http://celestrak.com/](http://celestrak.com/)

The query being requested to Spacetrack's API is:

`https://www.space-track.org/basicspacedata/query/class/tle_latest/ORDINAL/1/EPOCH/>now-30/orderby/NORAD_CAT_ID asc/metadata/false`

### Rendering the orbital objects in WorldWind

Remember that using NASA WorldWind is not mandatory for you to participate in the Orbital Scrap Metal SpaceApps challenge. It is recommended that beginners create 2D games, or if you're familiar with a 3D game engine, you might prefer to use that instead with the real-world satellite data.

That being said, if your interests lie alongside virtual terrestrial globes, Geospatial Information Systems (GIS) or

### Additional resources