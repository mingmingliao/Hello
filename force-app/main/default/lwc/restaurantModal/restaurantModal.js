import { api } from 'lwc';
import LightningModal from 'lightning/modal';

import NAME_FIELD from '@salesforce/schema/Restaurant__c.Name';
import DESCRIPTION_FIELD from '@salesforce/schema/Restaurant__c.Description__c';
import RESTAURANT_OBJECT from '@salesforce/schema/Restaurant__c';

export default class restaurantModal extends LightningModal {
    @api tripId;
    @api objectApiName = RESTAURANT_OBJECT;

    // Expose a field to make it available in the template
    // Address api done this way because importing it does not work
    fields = [
        NAME_FIELD, 
        DESCRIPTION_FIELD, 
        { fieldApiName: 'Address__Street__s', objectApiName: 'Restaurant__c' },
        { fieldApiName: 'Address__City__s', objectApiName: 'Restaurant__c' },
        { fieldApiName: 'Address__CountryCode__s', objectApiName: 'Restaurant__c' },
        { fieldApiName: 'Address__StateCode__s', objectApiName: 'Restaurant__c' },
        { fieldApiName: 'Address__PostalCode__s', objectApiName: 'Restaurant__c' }
    ];

    handleFormError() {
    }

    // TODO Should be data validation handling here
    // Right now will still submit if fields are empty... 
    // for demo purposes we can leave it like this
    handleFormSubmit(event) {
        event.preventDefault();
        const formFields = event.detail.fields;
        // Setting up relationship Id
        formFields["Travel_Plan__c"] = this.tripId;
        this.template.querySelector('lightning-record-form').submit(formFields);
    }

    handleFormSuccess(event) {
        this.close();
    }
}
