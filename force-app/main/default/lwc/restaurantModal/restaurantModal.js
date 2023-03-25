import { api } from 'lwc';
import LightningModal from 'lightning/modal';

import NAME_FIELD from '@salesforce/schema/Restaurant__c.Name';
import RESTAURANT_OBJECT from '@salesforce/schema/Restaurant__c';
import ADDRESS_FIELD from '@salesforce/schema/Restaurant__c.Address__PostalCode__s';
import DESCRIPTION_FIELD from '@salesforce/schema/Restaurant__c.Description__c';

export default class restaurantModal extends LightningModal {
    @api content;
    @api tripId;

    // TODO Pull this in later from code
    objectApiName = "Restaurant__c"
    city
    country
    state
    street
    postalCode

    // Expose a field to make it available in the template
    fields = [
        NAME_FIELD, 
        DESCRIPTION_FIELD, 
        { fieldApiName: 'Address__Street__s', objectApiName: 'Restaurant__c' },
        { fieldApiName: 'Address__City__s', objectApiName: 'Restaurant__c' },
        { fieldApiName: 'Address__CountryCode__s', objectApiName: 'Restaurant__c' },
        { fieldApiName: 'Address__StateCode__s', objectApiName: 'Restaurant__c' },
        { fieldApiName: 'Address__PostalCode__s', objectApiName: 'Restaurant__c' }
    ];
    
    // Flexipage provides recordId and objectApiName
    @api recordId;
    @api objectApiName = RESTAURANT_OBJECT;

    handleError() {
        console.log('okay');
        console.log(DESCRIPTION_FIELD)
        console.log(ADDRESS_FIELD)
    }

    handleSubmit(event) {
        console.log(event.detail.fields)
        event.preventDefault();
        const formFields = event.detail.fields;
        formFields["Travel_Plan__c"] = this.tripId;
        console.log(formFields)
        this.template.querySelector('lightning-record-form').submit(formFields);
    }

    handleAddressChange(event) {
        this.city = event.target.city;
        this.country = event.target.country;
        this.state = event.target.state;
        this.street = event.target.street;
        this.postalCode = event.target.postalCode;
    }
}
