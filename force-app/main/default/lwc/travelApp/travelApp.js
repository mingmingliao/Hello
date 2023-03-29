import { LightningElement, wire } from "lwc";
import { refreshApex } from '@salesforce/apex';
import getTravelTrips from '@salesforce/apex/TravelAppController.getTravelTrips'
import CreateTripModal from 'c/createTripModal';

export default class Travel_app extends LightningElement {
    trips;
    wiredTrips;
    error;

    // TODO fix this trip wire
    // change this to use result rather than {error, data}, will cause problems later when we update wired shit
    @wire(getTravelTrips) 
    wiredTripsResult(result) {
        this.wiredTrips = result;
        if (result.data) {
            this.trips = result.data;
            this.error = undefined;
        } else if (result.error) {
            this.trips = [];
            this.error = result.error;
        } else {
            this.trips = [];
        }
    };

    handleClick() {
        CreateTripModal.open({
          // maps to developer-created `@api options`
        }).then((result) => {
            return refreshApex(this.wiredTrips);
        });
    }

    handleDeleteTrip() {
        return refreshApex(this.wiredTrips);
    }
}