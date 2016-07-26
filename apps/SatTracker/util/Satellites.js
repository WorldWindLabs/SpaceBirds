/**
 * Created by bwstewart389 on 6/27/16.
 */
define(['Satellites'], function (satellites) {
    var satellites = [
        {
            displayName: 'ISS',
            fileName: 'ISS.dae',
            path: '../apps/SatTracker/collada-models/',
            initialScale: 5000,
            useTexturePaths: true,
            tle_line_1: '1 25544U 98067A   16167.17503470  .00003196  00000-0  54644-4 0  9994',
            tle_line_2: '2 25544  51.6428  68.0694 0000324   5.0932 150.3291 15.54558788  4673',
        },
        {
            displayName: 'Hubble',
            fileName: '',
            path: '',
            initialScale: 5000,
            useTexturePaths: true,
            tle_line_1: '1 20580U 90037B   16164.81209214  .00000774  00000-0  37292-4 0  9994',
            tle_line_2: '2 20580  28.4702 287.6126 0002813 156.6394 338.1735 15.08391210234458',
        }
        
        
    ];
});