import { LightningElement, track, wire, api } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { deleteRecord, getRecordCreateDefaults, 
    generateRecordInputForCreate, createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import { getRelatedListRecords } from 'lightning/uiRelatedListApi';
import RESTAURANT_OBJECT from '@salesforce/schema/Restaurant__c';
import restaurantModal from 'c/restaurantModal';
import ADDRESS_FIELD from '@salesforce/schema/Restaurant__c.Address__c'

export default class Restaurants extends LightningElement {
    @api tripId;
    // track is deprecated
    @track restaurantData;
    @track wiredRestaurantData;
    @track error;
    // need to change these fields later
    @track columns = [
        { label: 'Name', fieldName: 'Name' }
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
     * how did i get relatedListId?
     * DescribeSObjectResult describe = SObjectType.Travel_Plan__c;
     * for (ChildRelationship relation: describe.getChildRelationships()) {
     *     system.debug(relation);
     * }
     * run this in dev console and you can find the relatedListName field to put in
     * TODO - Fields here should be moved into a global const where it can be reused and edited easily, kind of messy over here IMO
     **/
    @wire(getRelatedListRecords, {
        parentRecordId: '$tripId',
        relatedListId: 'Restaurants__r',
        fields : ["Restaurant__c.Id", "Restaurant__c.Name", "Restaurant__c.Address__c"]
    })
    wiredData(response) {
        this.wiredRestaurantData = response;
        const mockAddress = {
            city: 'San Francisco'
        }
        if (response.data) {
            let retrievedData = response.data.records.map(restaurantRecord => {
                return {
                    Id: restaurantRecord.fields.Id.value,
                    Name: restaurantRecord.fields.Name.value,
                    Address__c: mockAddress
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
    handleAdd() {
        this.recordInput = this.recordInputForCreate();
        console.log(this.recordInput)
        this.recordInput.fields.Name = "Add Test"
        this.recordInput.fields.Travel_Plan__c = this.tripId
        this.recordInput.fields.Address__City__s = "San Francisco"
        this.recordInput.fields.Address__CountryCode__s = "US"
        this.recordInput.fields.Address__PostalCode__s = "94105"
        this.recordInput.fields.Address__Street__s = "121 Spear St."
        this.recordInput.fields.Address__StateCode__s = "CA"


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
            console.log(ADDRESS_FIELD)
            console.log(error)
            console.log("add error lol")
        })
    }

    handleClick() {
        restaurantModal.open({
          // maps to developer-created `@api options`
          tripId: this.tripId,
          options: [
            { id: 1, label: 'Option 1' },
            { id: 2, label: 'Option 2' },
          ]
        }).then((result) => {
            console.log(result);
        });
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