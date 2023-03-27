import { LightningElement, wire } from "lwc";
import { refreshApex } from '@salesforce/apex';
import getTravelTrips from '@salesforce/apex/TravelAppController.getTravelTrips'
import CreateTripModal from 'c/createTripModal';

export default class Travel_app extends LightningElement {
    trips;
    error;

    // TODO fix this trip wire
    // change this to use result rather than {error, data}, will cause problems later when we update wired shit
    @wire(getTravelTrips) 
    wiredTrips({error, data}) {
      if (data) {
        this.trips = data;
        this.error = undefined;
      } else if (error) {
        this.error = error;
        this.trips = [];
      } else {
        this.trips = [];
      }
    };
    
    handleClick() {
        CreateTripModal.open({
          // maps to developer-created `@api options`
          options: [
            { id: 1, label: 'Option 1' },
            { id: 2, label: 'Option 2' },
          ]
        }).then((result) => {
            console.log(result);
        });
    }
}