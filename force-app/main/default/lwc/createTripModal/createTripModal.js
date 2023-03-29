import { api } from 'lwc';
import LightningModal from 'lightning/modal';

import TRAVEL_PLAN_OBJECT from '@salesforce/schema/Travel_Plan__c';
import NAME_FIELD from '@salesforce/schema/Travel_Plan__c.Name';

export default class CreateTripModal extends LightningModal {
    @api options
    objectApiName = TRAVEL_PLAN_OBJECT
    fields = [
        NAME_FIELD,
        { fieldApiName: 'Address__City__s', objectApiName: 'Travel_Plan__c' },
        { fieldApiName: 'Address__CountryCode__s', objectApiName: 'Travel_Plan__c' },
        { fieldApiName: 'Address__StateCode__s', objectApiName: 'Travel_Plan__c' }
    ]
    
    handleError() {
    }

    // Right now will still submit if fields are empty... 
    // for demo purposes we can leave it like this
    handleSubmit(event) {
        event.preventDefault();
        const formFields = event.detail.fields;
        this.template.querySelector('lightning-record-form').submit(formFields);
    }

    handleSuccess(event) {
        this.close()
    }
}