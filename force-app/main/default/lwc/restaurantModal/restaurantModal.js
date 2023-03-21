import { api } from 'lwc';
import LightningModal from 'lightning/modal';

export default class restaurantModal extends LightningModal {
    @api content;

    handleOkay() {
        this.close('okay');
    }
}
