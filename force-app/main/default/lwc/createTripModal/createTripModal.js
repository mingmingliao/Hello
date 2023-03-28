import { api } from 'lwc';
import LightningModal from 'lightning/modal';

import TRAVEL_PLAN_OBJECT from '@salesforce/schema/Travel_Plan__c';
import NAME_FIELD from '@salesforce/schema/Travel_Plan__c.Name';

export default class CreateTripModal extends LightningModal {
    @api options
    objectApiName = TRAVEL_PLAN_OBJECT
    fields = [
        NAME_FIELD,
        { fieldApiName: 'Address__Street__s', objectApiName: 'Travel_Plan__c' },
        { fieldApiName: 'Address__City__s', objectApiName: 'Travel_Plan__c' },
        { fieldApiName: 'Address__CountryCode__s', objectApiName: 'Travel_Plan__c' },
        { fieldApiName: 'Address__StateCode__s', objectApiName: 'Travel_Plan__c' },
        { fieldApiName: 'Address__PostalCode__s', objectApiName: 'Travel_Plan__c' }
    ]

    handleOptionClick() {
        this.close('okay');
    }
}