The backend portion of SpaceBirds retrieves the data about Earth's orbital environment from the https://www.space-track.org/ API. The API's documentation can be consulted here:

The data comprises publicly available orbital parameters of objects tracked by the United State's Air Force 18th Space Control Squadron. 

As of March 23rd 2020, this comprises NNNN objects, between payloads (operational and derelict), spent rocket stages, and general space debris with a radar cross-section (RCS) equal or above 5 cm.

Data is retrieved and cross-referenced with http://celestrak.com/


`https://www.space-track.org/basicspacedata/query/class/tle_latest/ORDINAL/1/EPOCH/>now-30/orderby/NORAD_CAT_ID asc/metadata/false`