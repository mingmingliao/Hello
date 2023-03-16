import { LightningElement, track, wire } from 'lwc';
import CreateTripModal from 'c/createTripModal';
import getRestaurants from '@salesforce/apex/RestaurantsController.getRestaurants'

export default class Restaurants extends LightningElement {
  @track data = [{ Name: 'name' }, { Name: 'test' }];
  @track columns = [
    { label: 'Name', fieldName: 'Name' }
    // { label: 'Longitutde', fieldName: 'Location__Longitude__s', type: 'double' },
    // { label: 'Latitude', fieldName: 'Location__Latitude__s', type: 'double' },
  ];

  handleClick() {
    this.getRestaurantsFromTrip(123)
    // CreateTripModal.open({
    //   // maps to developer-created `@api options`
    //   options: [
    //     { id: 1, label: 'Option 1' },
    //     { id: 2, label: 'Option 2' },
    //   ]
    // }).then((result) => {
    //     console.log(result);
    // });
  }

  getRestaurantsFromTrip(tripId) {
    getRestaurants({
      id: tripId
    }).then(result => {
      console.log(result);
      this.data = result;
    }).error(error => {
      console.log('error')
    });
  }
}