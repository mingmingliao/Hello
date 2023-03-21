import { LightningElement, track, wire, api } from 'lwc';
import CreateTripModal from 'c/createTripModal';
import { refreshApex } from '@salesforce/apex';
import { deleteRecord, getRecordCreateDefaults, 
    generateRecordInputForCreate, createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import { getRelatedListRecords } from 'lightning/uiRelatedListApi';
import TicketsAndReservationsObject from '@salesforce/schema/TicketOrReservation__c';

export default class TicketsAndReservations extends LightningElement {
    @api tripId;
    @track ticketAndReservationData;
    @track wiredTicketAndReservationData;
    @track error;
    // need to change these fields later
    @track columns = [
        { label: 'Name', fieldName: 'Name' },
        { label: 'Longitude', fieldName: 'Location__Longitude__s', type: 'double' },
        { label: 'Latitude', fieldName: 'Location__Latitude__s', type: 'double' }
    ];

    // Used for deletion of rows
    ticketAndReservationSelectedRows = [];

    // Used for creation of record
    recordInput;
    @wire(getRecordCreateDefaults, { objectApiName: TicketsAndReservationsObject })
    ticketAndReservationCreateDefaults;

    @wire(getRelatedListRecords, {
        parentRecordId: '$tripId',
        relatedListId: 'TicketOrReservations__r',
        fields : ["TicketOrReservation__c.Id", "TicketOrReservation__c.Name",
         "TicketOrReservation__c.Location__Longitude__s", "TicketOrReservation__c.Location__Latitude__s"]
    })
    wiredData(response) {
        this.wiredTicketAndReservationData = response;
        if (response.data) {
            let retrievedData = response.data.records.map(ticketAndReservationRecord => {
            return {
                Id: ticketAndReservationRecord.fields.Id.value,
                Name: ticketAndReservationRecord.fields.Name.value,
                Location__Longitude__s: ticketAndReservationRecord.fields.Location__Longitude__s.value,
                Location__Latitude__s: ticketAndReservationRecord.fields.Location__Latitude__s.value,
            }
            })
            this.ticketAndReservationData = retrievedData
            this.error = undefined;
        } else if (response.error) {
            this.error = response.error;
            this.ticketAndReservationData = [];
        }
    };


    recordInputForCreate() {
        if (!this.ticketAndReservationCreateDefaults.data) {
            return undefined;
        }

        const ticketAndReservationObjectInfo =
            this.ticketAndReservationCreateDefaults.data.objectInfos[
                TicketsAndReservationsObject.objectApiName
            ];
        const recordDefaults = this.ticketAndReservationCreateDefaults.data.record;
        const recordInput = generateRecordInputForCreate(
            recordDefaults,
            ticketAndReservationObjectInfo
        );
        return recordInput;
    }
    
    handleAdd() {
        this.recordInput = this.recordInputForCreate();
        this.recordInput.fields.Name = "Add Test"
        this.recordInput.fields.Location__Latitude__s = 12.1
        this.recordInput.fields.Location__Longitude__s = 21.2
        this.recordInput.fields.Travel_Plan__c = this.tripId

        createRecord(this.recordInput)
        .then(record => {
            this.dispatchEvent(
                new ShowToastEvent({
                title: 'Success',
                message: 'Record created',
                variant: 'success'
            })
            );
            console.log(record)
            return refreshApex(this.wiredTicketAndReservationData)
        }).catch(error => {
            console.log(error)
            console.log("add error lol")
        })
    }
    
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

    // Updates data table row selection in code
    handleRowSelection(event){
        this.ticketAndReservationSelectedRows = event.detail.selectedRows
    }

    handleClick() {
        // open a modal with a record creation form
    }

}