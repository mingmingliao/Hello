import { LightningElement, wire, api } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { deleteRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import { getRelatedListRecords } from 'lightning/uiRelatedListApi';
import sightsModal from 'c/sightsModal';

export default class Sights extends LightningElement {
    @api tripId;
    sightData;
    wiredSightData;
    error;
    
    columns = [
        { label: 'Name', fieldName: 'Name' },
        { label: 'Description', fieldName: 'Description__c' }
    ];

    // Used for deletion of rows
    sightSelectedRows = [];

    // Used for creation of record
    recordInput;

    @wire(getRelatedListRecords, {
        parentRecordId: '$tripId',
        relatedListId: 'Sights__r',
        fields : ["Sight__c.Id", "Sight__c.Name", "Sight__c.Description__c"]
    })
    wiredData(response) {
        this.wiredSightData = response;
        if (response.data) {
            let retrievedData = response.data.records.map(sightRecord => {
                return {
                    Id: sightRecord.fields.Id.value,
                    Name: sightRecord.fields.Name.value,
                    Description__c: sightRecord.fields.Description__c.value
                }
            });
            this.sightData = retrievedData;
            this.error = undefined;
        } else if (response.error) {
            this.error = response.error;
            this.sightData = [];
        }
    };
    
    handleDeleteSight() {
        const promises = this.sightSelectedRows.map(sight => {
            deleteRecord(sight.Id);
        });
        Promise.all(promises).then(sightList => {
            this.dispatchEvent(new ShowToastEvent({
                    title: 'Success',
                    message: 'Deleted sight!',
                    variant: 'success'
                })
            );
            // clearing selected rows so the check doesnt stay
            this.template.querySelector('lightning-datatable').selectedRows = [];
            return refreshApex(this.wiredSightData);
        }).error(error => {
            this.dispatchEvent(new ShowToastEvent({
                    title: 'Failed',
                    message: 'Failed to add sight!',
                    variant: 'error'
                })
            );
        })
    }

    handleAddSight() {
        sightsModal.open({
            // maps to developer-created `@api options`
            tripId: this.tripId
        }).then((result) => {
            return refreshApex(this.wiredRestaurantData);
        });
    }


    // Updates data table row selection in code
    handleRowSelection(event){
        this.sightSelectedRows = event.detail.selectedRows;
    }
}