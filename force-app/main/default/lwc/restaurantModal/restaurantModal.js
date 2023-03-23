import { api } from 'lwc';
import LightningModal from 'lightning/modal';

import NAME_FIELD from '@salesforce/schema/Restaurant__c.Name';
import RESTAURANT_OBJECT from '@salesforce/schema/Restaurant__c';
import ADDRESS_FIELD from '@salesforce/schema/Restaurant__c.Address__c';
import DESCRIPTION_FIELD from '@salesforce/schema/Restaurant__c.Description__c';

export default class restaurantModal extends LightningModal {
    @api content;

    // TODO Pull this in later from code
    objectApiName = "Restaurant__c"

    // Expose a field to make it available in the template
    fields = [NAME_FIELD, DESCRIPTION_FIELD, ADDRESS_FIELD];
    
    // Flexipage provides recordId and objectApiName
     @api recordId;
     @api objectApiName = RESTAURANT_OBJECT;

    handleOkay() {
        this.close('okay');
    }
}
