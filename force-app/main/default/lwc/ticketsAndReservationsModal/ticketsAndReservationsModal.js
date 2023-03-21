import { api } from 'lwc';
import LightningModal from 'lightning/modal';

export default class ticketsAndReservationsModal extends LightningModal {
    @api content;

    handleOkay() {
        this.close('okay');
    }
}