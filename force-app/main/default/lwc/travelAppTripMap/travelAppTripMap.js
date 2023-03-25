import { LightningElement, api  } from 'lwc';

export default class TravelAppTripMap extends LightningElement {
    
    // mock address atm
    mapMarkers = [
        {
            location: {
                Street: '1 Market St',
                City: 'San Francisco',
                Country: 'USA',
            },
            title: 'The Landmark Building',
            description:
                'Historic <b>11-story</b> building completed in <i>1916</i>',
        },
    ];
    // mock
    zoomLevel = 11
    center = {
        location: {
            City: 'San Francisco'
        }
    }


}