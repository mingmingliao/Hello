import { LightningElement, track, wire, api } from 'lwc';
import CreateTripModal from 'c/createTripModal';
import { refreshApex } from '@salesforce/apex';
import { deleteRecord, getRecordCreateDefaults, 
    generateRecordInputForCreate, createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import { getRelatedListRecords } from 'lightning/uiRelatedListApi';
import RESTAURANT_OBJECT from '@salesforce/schema/Restaurant__c';

export default class Restaurants extends LightningElement {
    @api tripId;
    @track restaurantData;
    @track wiredRestaurantData;
    @track error;
    // need to change these fields later
    @track columns = [
        { label: 'Name', fieldName: 'Name' },
        { label: 'Longitude', fieldName: 'Location__Longitude__s', type: 'double' },
        { label: 'Latitude', fieldName: 'Location__Latitude__s', type: 'double' }
    ];

    // Used for deletion of rows
    restaurantSelectedRows = [];

    // Used for creation of record
    recordInput;
    @wire(getRecordCreateDefaults, { objectApiName: RESTAURANT_OBJECT })
    restaurantCreateDefaults;

    /** 
     * notes to use wire because it was really annoying for me
     * wire function cannot use {data, error} if you want to use refreshData with this
     * the only way this worked for me was if i used a second variable 'wiredRestaurantData'
     * and then updated restaurantData inside the if else statements. i'm still unsure why that is,
     * the docs for specific things in salesforce is very scarce
     * this will get rerun when you use refreshData(this.wiredRestaurantData)
     * 
     * TODO - Fields here should be moved into a global const where it can be reused and edited easily, kind of messy over here IMO
     **/
    @wire(getRelatedListRecords, {
        parentRecordId: '$tripId',
        relatedListId: 'Restaurants__r',
        fields : ["Restaurant__c.Id", "Restaurant__c.Name", "Restaurant__c.Location__Longitude__s", "Restaurant__c.Location__Latitude__s"]
    })
    wiredData(response) {
        this.wiredRestaurantData = response;
        if (response.data) {
            let retrievedData = response.data.records.map(restaurantRecord => {
            return {
            Id: restaurantRecord.fields.Id.value,
            Name: restaurantRecord.fields.Name.value,
            Location__Longitude__s: restaurantRecord.fields.Location__Longitude__s.value,
            Location__Latitude__s: restaurantRecord.fields.Location__Latitude__s.value,
            }
            })
            this.restaurantData = retrievedData
            this.error = undefined;
        } else if (response.error) {
            this.error = response.error;
            this.restaurantData = [];
        }
    };


    recordInputForCreate() {
        if (!this.restaurantCreateDefaults.data) {
            return undefined;
        }

        const restaurantObjectInfo =
            this.restaurantCreateDefaults.data.objectInfos[
              RESTAURANT_OBJECT.objectApiName
            ];
        const recordDefaults = this.restaurantCreateDefaults.data.record;
        const recordInput = generateRecordInputForCreate(
            recordDefaults,
            restaurantObjectInfo
        );
        return recordInput;
    }
    
    // test function that adds a record, hopefully refreshes
    // dont use mockRecordInput here
    addR() {
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
            return refreshApex(this.wiredRestaurantData)
        }).catch(error => {
            console.log("add error lol")
        })
    }

    handleClick() {
        // open a modal with a record creation form
    }

    // Deletes selected restaurants in the list. Fires off a toast message for successful deletion, or for a failed delete
    handleDelete() {
        const promises = this.restaurantSelectedRows.map(restaurant => {
            deleteRecord(restaurant.Id)
        });
        Promise.all(promises).then(restaurantList => {
            console.log(restaurantList)
            this.dispatchEvent(
                new ShowToastEvent({
                title: 'Success',
                message: 'Deleted restaurant!',
                variant: 'success'
                })
            );
            // clearing selected rows so the check doesnt stay
            this.template.querySelector('lightning-datatable').selectedRows = [];
            return refreshApex(this.wiredRestaurantData);
        }).error(error => {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Failed',
                message: 'Failed to add restaurant!',
                variant: 'error'
            }))
            console.log(error)
        })
    }

    // Updates data table row selection in code
    handleRowSelection(event){
        this.restaurantSelectedRows = event.detail.selectedRows
    }

}