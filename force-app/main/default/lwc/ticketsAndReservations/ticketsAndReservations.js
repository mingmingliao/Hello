import { LightningElement } from 'lwc';
import ticketsAndReservationsModal from 'c/ticketsAndReservationsModal';

export default class TicketsAndReservations extends LightningElement {
    handleClick() {
        ticketsAndReservationsModal.open({
          // maps to developer-created `@api options`
          options: [
            { id: 1, label: 'Option 1' },
            { id: 2, label: 'Option 2' },
          ]
        }).then((result) => {
            console.log(result);
        });
    }
}