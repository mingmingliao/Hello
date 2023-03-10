import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import sendEmail from '@salesforce/apex/test_lwcController.sendEmail'

export default class Test_lwc extends LightningElement {
    to;
    subject;
    message;

    updateFrom(event) {
        switch (event.target.name) {
            case 'to':
                this.to = event.detail.value
            case 'subject':
                this.subject = event.detail.value
            case 'message':
                this.message = event.detail.value
        }
    }

    showNotification() {
        const toastEvent = new ShowToastEvent({
            title: 'Email Sent Successfully',
            message: this.from + ' ' + this.to,
            variant: 'success'
        });
        this.dispatchEvent(toastEvent);
    }

    handleClick() {
        sendEmail({
            recipient: this.to,
            subject: this.subject,
            message: this.message
        }).then(result => {
            this.showNotification();
        }).catch(error => {
            console.log(error)
        })

    }
}