
import { LightningElement, wire, api } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { deleteRecord, getRecordCreateDefaults, 
    generateRecordInputForCreate, createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import { getRelatedListRecords } from 'lightning/uiRelatedListApi';
import TicketsAndReservationsObject from '@salesforce/schema/TicketOrReservation__c';
import ticketsAndReservationsModal from 'c/ticketsAndReservationsModal';

export default class TicketsAndReservations extends LightningElement {
    @api tripId;
    ticketAndReservationData;
    wiredTicketAndReservationData;
    error;

    columns = [
        { label: 'Name', fieldName: 'Name' },
        { label: 'Description', fieldName: 'Description__c' }
    ];

    // Used for deletion of rows
    ticketAndReservationSelectedRows = [];

    // Used for creation of record
    recordInput;

    @wire(getRelatedListRecords, {
        parentRecordId: '$tripId',
        relatedListId: 'Tickets_and_Reservations__r',
        fields : ["TicketOrReservation__c.Id", "TicketOrReservation__c.Name", "TicketOrReservation__c.Description__c"]
    })
    wiredData(response) {
        this.wiredTicketAndReservationData = response;
        if (response.data) {
            let retrievedData = response.data.records.map(ticketAndReservationRecord => {
            return {
                Id: ticketAndReservationRecord.fields.Id.value,
                Name: ticketAndReservationRecord.fields.Name.value,
                Description__c: ticketAndReservationRecord.fields.Description__c.value
            }
            })
            this.ticketAndReservationData = retrievedData
            this.error = undefined;
        } else if (response.error) {
            this.error = response.error;
            this.ticketAndReservationData = [];
        }
    };

    handleDelete() {
        const promises = this.ticketAndReservationSelectedRows.map(ticketAndReservation => {
            deleteRecord(ticketAndReservation.Id)
        });
          Promise.all(promises).then(ticketAndReservationList => {
            console.log(ticketAndReservationList)
            this.dispatchEvent(
                new ShowToastEvent({
                title: 'Success',
                message: 'Deleted ticket/reservation!',
                variant: 'success'
                })
            );
            // clearing selected rows so the check doesnt stay
            this.template.querySelector('lightning-datatable').selectedRows = [];
            return refreshApex(this.wiredTicketAndReservationData);
        }).error(error => {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Failed',
                message: 'Failed to add ticket/reservation!',
                variant: 'error'
            }))
            console.log(error)
        })
    }

    handleClick() {
        ticketsAndReservationsModal.open({
            // maps to developer-created `@api options`
            tripId: this.tripId
        }).then((result) => {
            return refreshApex(this.wiredRestaurantData)
        });
    }

    // Updates data table row selection in code
    handleRowSelection(event){
        this.ticketAndReservationSelectedRows = event.detail.selectedRows
    }
}