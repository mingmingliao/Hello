import { LightningElement, track, wire, api } from 'lwc';
import CreateTripModal from 'c/createTripModal';
import { refreshApex } from '@salesforce/apex';
import { deleteRecord, getRecordCreateDefaults, 
    generateRecordInputForCreate, createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import { getRelatedListRecords } from 'lightning/uiRelatedListApi';
import SIGHT_OBJECT from '@salesforce/schema/Sight__c';

export default class Sights extends LightningElement {
    @api tripId;
    @track sightData;
    @track wiredSightData;
    @track error;
    // need to change these fields later
    @track columns = [
        { label: 'Name', fieldName: 'Name' },
        { label: 'Longitude', fieldName: 'Location__Longitude__s', type: 'double' },
        { label: 'Latitude', fieldName: 'Location__Latitude__s', type: 'double' }
    ];

    // Used for deletion of rows
    sightSelectedRows = [];

    // Used for creation of record
    recordInput;
    @wire(getRecordCreateDefaults, { objectApiName: SIGHT_OBJECT })
    sightCreateDefaults;

    @wire(getRelatedListRecords, {
        parentRecordId: '$tripId',
        relatedListId: 'Sights__r',
        fields : ["Sight__c.Id", "Sight__c.Name", "Sight__c.Location__Longitude__s", "Sight__c.Location__Latitude__s"]
    })
    wiredData(response) {
        this.wiredSightData = response;
        if (response.data) {
            let retrievedData = response.data.records.map(sightRecord => {
            return {
            Id: sightRecord.fields.Id.value,
            Name: sightRecord.fields.Name.value,
            Location__Longitude__s: sightRecord.fields.Location__Longitude__s.value,
            Location__Latitude__s: sightRecord.fields.Location__Latitude__s.value,
            }
            })
            this.sightData = retrievedData
            this.error = undefined;
        } else if (response.error) {
            this.error = response.error;
            this.sightData = [];
        }
    };


    recordInputForCreate() {
        if (!this.sightCreateDefaults.data) {
            return undefined;
        }

        const sightObjectInfo =
            this.sightCreateDefaults.data.objectInfos[
              SIGHT_OBJECT.objectApiName
            ];
        const recordDefaults = this.sightCreateDefaults.data.record;
        const recordInput = generateRecordInputForCreate(
            recordDefaults,
            sightObjectInfo
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
            return refreshApex(this.wiredSightData)
        }).catch(error => {
            console.log(error)
            console.log("add error lol")
        })
    }
    
    handleDelete() {
        const promises = this.sightSelectedRows.map(sight => {
            deleteRecord(sight.Id)
        });
        Promise.all(promises).then(sightList => {
            console.log(sightList)
            this.dispatchEvent(
                new ShowToastEvent({
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
            }))
            console.log(error)
        })
    }

    // Updates data table row selection in code
    handleRowSelection(event){
        this.sightSelectedRows = event.detail.selectedRows
    }

    handleClick() {
        // open a modal with a record creation form
    }

}