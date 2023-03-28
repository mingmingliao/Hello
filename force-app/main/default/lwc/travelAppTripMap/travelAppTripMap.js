import { LightningElement, api, wire } from 'lwc';
import { getRelatedListRecords } from 'lightning/uiRelatedListApi';

export default class TravelAppTripMap extends LightningElement {
    @api tripId
    // mock address atm

    restaurantData;
    wiredRestaurantData;
    sightData;
    wiredSightData;
    ticketAndReservationData;
    wiredTicketAndReservationData;
    error;

    @wire(getRelatedListRecords, {
        parentRecordId: '$tripId',
        relatedListId: 'Tickets_and_Reservations__r',
        fields : [
            "TicketOrReservation__c.Address__City__s", 
            "TicketOrReservation__c.Address__CountryCode__s", 
            "TicketOrReservation__c.Address__PostalCode__s",
            "TicketOrReservation__c.Address__Street__s", 
            "TicketOrReservation__c.Address__StateCode__s" 
        ]
    })
    wiredData(response) {
        this.wiredTicketAndReservationData = response;
        if (response.data) {
            let retrievedData = response.data.records.map(ticketAndReservationRecord => {
                return {
                    Street: ticketAndReservationRecord.fields.Address__Street__s.value,
                    City: ticketAndReservationRecord.fields.Address__City__s.value,
                    State: ticketAndReservationRecord.fields.Address__StateCode__s.value,
                    Country: ticketAndReservationRecord.fields.Address__CountryCode__s.value,
                    PostalCode: ticketAndReservationRecord.fields.Address__PostalCode__s.value
                }
            })
            this.ticketAndReservationData = retrievedData
            this.error = undefined;
        } else if (response.error) {
            this.error = response.error;
            this.ticketAndReservationData = [];
        }
    };

    @wire(getRelatedListRecords, {
        parentRecordId: '$tripId',
        relatedListId: 'Sights__r',
        fields : [
            "Sight__c.Address__City__s", 
            "Sight__c.Address__CountryCode__s", 
            "Sight__c.Address__PostalCode__s",
            "Sight__c.Address__Street__s", 
            "Sight__c.Address__StateCode__s" 
        ]
    })
    wiredData(response) {
        this.wiredSightData = response;
        if (response.data) {
            let retrievedData = response.data.records.map(sightRecord => {
                return {
                    Street: sightRecord.fields.Address__Street__s.value,
                    City: sightRecord.fields.Address__City__s.value,
                    State: sightRecord.fields.Address__StateCode__s.value,
                    Country: sightRecord.fields.Address__CountryCode__s.value,
                    PostalCode: sightRecord.fields.Address__PostalCode__s.value
                }
            })
            this.sightData = retrievedData
            this.error = undefined;
        } else if (response.error) {
            this.error = response.error;
            this.sightData = [];
        }
    };

    @wire(getRelatedListRecords, {
        parentRecordId: '$tripId',
        relatedListId: 'Restaurants__r',
        fields : [
            "Restaurant__c.Address__City__s", 
            "Restaurant__c.Address__CountryCode__s", 
            "Restaurant__c.Address__PostalCode__s",
            "Restaurant__c.Address__Street__s", 
            "Restaurant__c.Address__StateCode__s" 
        ]
    })
    wiredData(response) {
        this.wiredRestaurantData = response;
        if (response.data) {
            let retrievedData = response.data.records.map(restaurantRecord => {
                return {
                    Street: restaurantRecord.fields.Address__Street__s.value,
                    City: restaurantRecord.fields.Address__City__s.value,
                    State: restaurantRecord.fields.Address__StateCode__s.value,
                    Country: restaurantRecord.fields.Address__CountryCode__s.value,
                    PostalCode: restaurantRecord.fields.Address__PostalCode__s.value
                }
            })
            this.restaurantData = retrievedData
            this.error = undefined;
        } else if (response.error) {
            this.error = response.error;
            this.restaurantData = [];
        }
    };
    
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
            City: 'San Francisco',
            Country: 'USA'
        }
    }


}