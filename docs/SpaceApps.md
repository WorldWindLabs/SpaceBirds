## How to run
* Download and install [NodeJS](https://nodejs.org/en/download/)
* Open a command line and run `npm install http-server -g` to install a development web server
* Open a command line in the root folder of this project and run:
  `http-server -o http://127.0.0.1:8080/index.html`

## Hi SpaceApps participants!

As part of the [SpaceApps](https://www.spaceappschallenge.org/) hackathon, SpaceBirds is given as a resource for the [Orbital Scrap Metal](https://2020.spaceappschallenge.org/challenges/sustain/orbital-scrap-metal-the-video-game-v20/details) challenge since 2019.

[SpaceBirds](https://worldwind.arc.nasa.gov/spacebirds/) is a web application that displays all the objects tracked in Earth orbit in real time. You can see a demo on its usage here. It's based around the [NASA WorldWind 3D globe web library](https://worldwind.arc.nasa.gov/web) and the [Satellite.js](https://github.com/shashwatak/satellite-js) library.  It obtains the information of all the orbiting objects from a [public data source](https://www.space-track.org/) set up by the US government. If you want to see SpaceBirds source code, check [this point in the history](https://github.com/WorldWindLabs/SpaceBirds/tree/59b4790296e4c6c610145dd5f4119521012cf8d6) of the repository. In its current state, the repository contains a minimal satellite tracker to help you get you going with your project if you choose to leverage the geospatial power of NASA WorldWind. WorldWind is designed to be relatively easy to use, even for coders not too familiarized with web development. You can browse code examples for WorldWind [in here](https://worldwind.arc.nasa.gov/web/examples/).

If you're familiarized with HTML and JavaScript, you're good to go to modify SpaceBirds and use WorldWind. Being familiar with Git is not required, but it will help you to organize your coding and share the workload with your team members. Here are some good resources to get started:
* [HTML Introduction](https://www.w3schools.com/html/html_intro.asp)
* [JavaScript basics](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/JavaScript_basics)
* [Git - the simple guide](https://rogerdudler.github.io/git-guide/)

Parts of SpaceBirds may prove useful for you in order to understand how the orbiting objects' information is obtained and shown in an application in real time, and at the same time, it can teach you one thing or two about how satellites orbit the Earth and how can we know their current, past, and present position at any given time. If you want a challenge, you can attempt to *gamify* SpaceBirds itself to convert it into an orbital debris poaching videogame.

You can also learn what are the categories of orbiting objects, and how to define and distinguish **orbital debris** among them. The definition may not be as clear-cut as you initially thought!

One of the requirements of the **Orbital Scrap Metal** challenge is to have real-world satellite information. You can find an up-to-date dataset of all on-orbit objects in the [`satellite_data` folder](/satellite_data/), in three different file formats. This dataset is useful regardless of if you base your project on SpaceBirds or not. If you're tackling the Orbital Scrap Metal challenge using other tools (*e.g*. a 2D solution, Unity, *et cetera*), these datasets will prove useful for you.

## Sections:


- [How to run](#how-to-run)
- [Hi SpaceApps participants!](#hi-spaceapps-participants)
- [Sections:](#sections)
  - [Satellite data basics](#satellite-data-basics)
  - [Data retrieval](#data-retrieval)
  - [Rendering the orbital objects in WorldWind](#rendering-the-orbital-objects-in-worldwind)
  - [Additional resources](#additional-resources)

### Satellite data basics

How does SpaceBirds (or pretty much any other satellite tracker, for the matter) tracks satellites in real time? 

One of the most recurring questions about SpaceBirds and satellite tracker applications is "Does it obtain constant updates on where the satellites are located?"

The answer is no, it's not needed to constantly obtain the positional information of a satellite to have an accurate idea of where it currently is above Earth (or any other celestial body, for that matter).

*to be updated...*

### Data retrieval

SpaceBirds obtains the information of the orbital objects from [https://www.space-track.org/](https://www.space-track.org/)

The backend portion of SpaceBirds retrieves the data about Earth's orbital environment from Space-track's web API. You need to create an account to be able to query the database. The API's documentation can be consulted [here](https://www.space-track.org/documentation#/api). 

The data comprises publicly available orbital parameters of objects tracked by the [United State's Air Force 18th Space Control Squadron](https://www.af.mil/News/Article-Display/Article/1335482/18th-space-control-squadron-keeping-watch-up-above/). 

As of **October 2nd 2020**, this comprises **19,824 on-orbit objects** with a radar cross-section (RCS) equal or above 5 cm; between payloads (operational and derelict), spent rocket stages, and general space debris.

The query being requested to Spacetrack's API is:

`https://www.space-track.org/basicspacedata/query/class/gp/decay_date/null-val/epoch/%3Enow-30/orderby/norad_cat_id/format/json`

The same dataset can be retrieved with different formats, changing the last field. Give it a try:

https://www.space-track.org/basicspacedata/query/class/gp/decay_date/null-val/epoch/%3Enow-30/orderby/norad_cat_id/format/csv

https://www.space-track.org/basicspacedata/query/class/gp/decay_date/null-val/epoch/%3Enow-30/orderby/norad_cat_id/format/3le

You can find a copy of the data of that query in the `satellite_data` folder.

### Rendering the orbital objects in WorldWind

Remember that using NASA WorldWind is not mandatory for you to participate in the **Orbital Scrap Metal SpaceApps challenge**. It is recommended that beginner teams create 2D games, or if you're familiar with a 3D game engine, you might prefer to use that instead with the real-world satellite data that you acquired.

That being said, if your interests lie alongside virtual terrestrial globes, general mapping applications, and Geospatial Information Systems (for instance, like the applications that real satellite controllers use at NASA and other space agencies) here is the description of how the satellite TLE data is translated into terms of latitude, longitude and altitude.

### Additional resources

*to be updated...*