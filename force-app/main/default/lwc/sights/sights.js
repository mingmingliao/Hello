import { LightningElement } from 'lwc';
import CreateTripModal from 'c/createTripModal';

export default class Sights extends LightningElement {
    handleClick() {
        CreateTripModal.open({
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