import { LightningElement, track, wire } from 'lwc';
import CreateTripModal from 'c/createTripModal';
import getRestaurants from '@salesforce/apex/RestaurantsController.getRestaurants'

export default class Restaurants extends LightningElement {
  @track data = [];
  @track columns = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Longitude', fieldName: 'Location__Longitude__s', type: 'double' },
    { label: 'Latitude', fieldName: 'Location__Latitude__s', type: 'double' }
  ];

  handleClick() {
    this.getRestaurantsFromTrip(123);
  }

  getRestaurantsFromTrip(tripIdVal) {
    getRestaurants({
        id: tripIdVal
    }).then(result => {
      this.data = result;
    }).error(error => {
      console.log('error')
    });
  }
}