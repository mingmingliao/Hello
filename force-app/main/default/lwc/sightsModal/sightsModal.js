import { api } from 'lwc';
import LightningModal from 'lightning/modal';
import SIGHT_OBJECT from '@salesforce/schema/Sight__c';
import NAME_FIELD from '@salesforce/schema/Sight__c.Name';
import ADDRESS_FIELD from '@salesforce/schema/Sight__c.Address__c';
import DESCRIPTION_FIELD from '@salesforce/schema/Sight__c.Description__c';


export default class sightsModal extends LightningModal {
    @api content;

    // TODO Pull this in later from code
    objectApiName = "Sight__c"

    // Expose a field to make it available in the template
    fields = [NAME_FIELD, DESCRIPTION_FIELD, ADDRESS_FIELD];
    
    // Flexipage provides recordId and objectApiName
     @api recordId;
     @api objectApiName = RESTAURANT_OBJECT;

    handleOkay() {
        this.close('okay');
    }
}
