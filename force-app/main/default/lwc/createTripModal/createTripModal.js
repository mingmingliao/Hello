import { api } from 'lwc';
import LightningModal from 'lightning/modal';

export default class CreateTripModal extends LightningModal {
    @api options

    handleOptionClick() {
        this.close('okay');
    }
}