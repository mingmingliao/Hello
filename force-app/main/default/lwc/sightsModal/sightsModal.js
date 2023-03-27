import { api } from 'lwc';
import LightningModal from 'lightning/modal';

import NAME_FIELD from '@salesforce/schema/Sight__c.Name';
import DESCRIPTION_FIELD from '@salesforce/schema/Sight__c.Description__c';
import SIGHT_OBJECT from '@salesforce/schema/Sight__c';

export default class sightsModal extends LightningModal {
    @api tripId;
    @api objectApiName = SIGHT_OBJECT;

    // Expose a field to make it available in the template
    // Address api done this way because importing it does not work
    fields = [
        NAME_FIELD, 
        DESCRIPTION_FIELD, 
        { fieldApiName: 'Address__Street__s', objectApiName: 'Sight__c' },
        { fieldApiName: 'Address__City__s', objectApiName: 'Sight__c' },
        { fieldApiName: 'Address__CountryCode__s', objectApiName: 'Sight__c' },
        { fieldApiName: 'Address__StateCode__s', objectApiName: 'Sight__c' },
        { fieldApiName: 'Address__PostalCode__s', objectApiName: 'Sight__c' }
    ];
    

    handleError() {
    }

    // TODO Should be data validation handling here
    // Right now will still submit if fields are empty... 
    // for demo purposes we can leave it like this
    handleSubmit(event) {
        event.preventDefault();
        const formFields = event.detail.fields;
        // Setting up relationship Id
        formFields["Travel_Plan__c"] = this.tripId;
        this.template.querySelector('lightning-record-form').submit(formFields);
    }

    handleSuccess(event) {
        this.close()
    }
}
