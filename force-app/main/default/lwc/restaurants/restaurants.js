import { LightningElement, wire, api } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { deleteRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import { getRelatedListRecords } from 'lightning/uiRelatedListApi';
import restaurantModal from 'c/restaurantModal';

export default class Restaurants extends LightningElement {
    @api tripId;
    // track is deprecated
    restaurantData;
    wiredRestaurantData;
    error;
    
    columns = [
        { label: 'Name', fieldName: 'Name' },
        { label: 'Description', fieldName: 'Description__c' }
    ];

    // Used for deletion of rows
    restaurantSelectedRows = [];

    // Used for creation of record
    recordInput;

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
        fields : ["Restaurant__c.Id", "Restaurant__c.Name", "Restaurant__c.Description__c" ]
            // May need these in the future
            // "Restaurant__c.Address__City__s", 
            // "Restaurant__c.Address__CountryCode__s", "Restaurant__c.Address__PostalCode__s",
            // "Restaurant__c.Address__Street__s", "Restaurant__c.Address__StateCode__s" ]
    })
    wiredData(response) {
        this.wiredRestaurantData = response;
        if (response.data) {
            let retrievedData = response.data.records.map(restaurantRecord => {
                return {
                    Id: restaurantRecord.fields.Id.value,
                    Name: restaurantRecord.fields.Name.value,
                    Description__c: restaurantRecord.fields.Description__c.value
                }
            });
            this.restaurantData = retrievedData;
            this.error = undefined;
        } else if (response.error) {
            this.error = response.error;
            this.restaurantData = [];
        }
    };

    handleAddRestaurant() {
        restaurantModal.open({
          // maps to developer-created `@api options`
          tripId: this.tripId
        }).then((result) => {
            return refreshApex(this.wiredRestaurantData);
        });
    }

    // Deletes selected restaurants in the list. Fires off a toast message for successful deletion, or for a failed delete
    handleDeleteRestaurant() {
        if (this.restaurantSelectedRows.length == 0) {
            this.dispatchEvent(new ShowToastEvent({
                    title: 'Failed',
                    message: 'No value selected!',
                    variant: 'error'
                })
            );
        } else {
            const promises = this.restaurantSelectedRows.map(restaurant => {
                deleteRecord(restaurant.Id);
            });
            Promise.all(promises).then(restaurantList => {
                this.dispatchEvent(new ShowToastEvent({
                        title: 'Success',
                        message: 'Deleted restaurant/s!',
                        variant: 'success'
                    })
                );
                // clearing selected rows so the check doesnt stay
                this.template.querySelector('lightning-datatable').selectedRows = [];
                return refreshApex(this.wiredRestaurantData);
            }).error(error => {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Failed',
                    message: 'Failed to delete restaurant!',
                    variant: 'error'
                }));
            });
        }
    }

    // Updates data table row selection in code
    handleRestaurantRowSelection(event){
        this.restaurantSelectedRows = event.detail.selectedRows;
    }

}