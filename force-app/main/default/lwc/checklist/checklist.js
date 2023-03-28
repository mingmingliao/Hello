import { LightningElement } from 'lwc';

export default class CheckboxGroupBasic extends LightningElement {

    handleClick() {
        
    }

    

    value = ['option1'];

    get options() {
        return [
            { label: 'Toothpaste', value: 'option1' },
            { label: 'Underwear', value: 'option2' },
        ];
    }

    get selectedValues() {
        return this.value.join(',');
    }

    handleChange(e) {
        this.value = e.detail.value;
    }
}