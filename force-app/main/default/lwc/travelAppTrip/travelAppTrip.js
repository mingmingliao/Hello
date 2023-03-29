import { LightningElement, wire, track, api } from "lwc";
import { deleteRecord } from 'lightning/uiRecordApi';

export default class TravelAppTrip extends LightningElement {
    @api tripId;

    handleDeleteTrip() {
        deleteRecord(this.tripId).then(result => {
            const deleteEvent = new CustomEvent("deletetrip");
            this.dispatchEvent(deleteEvent);
        });
    }
}