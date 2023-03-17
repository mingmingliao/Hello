public with sharing class RestaurantsController {
    @AuraEnabled
    public static List<Restaurant__c> getRestaurants(Id tripId) {
        List<Restaurant__c> restaurants = new List<Restaurant__c>();
        Restaurant__c restaurant = new Restaurant__c();
        Location randomLoc = Location.newInstance(28.635308,77.22496);
        restaurant.Location__Latitude__s = randomLoc.latitude;
        restaurant.Location__Longitude__s = randomLoc.longitude;
        restaurant.Name = 'Tes123t';
        restaurant.Travel_Plan__c = tripId;
        restaurants.add(restaurant);
        System.debug(restaurant.Location__Latitude__s);
        Restaurant__c restaurant2 = new Restaurant__c();
        Location randomLoc2 = Location.newInstance(77.635308,27.22496);
        restaurant2.Location__Latitude__s = randomLoc2.latitude;
        restaurant2.Location__Longitude__s = randomLoc2.longitude;
        restaurant2.Name = 'Test2';
        restaurant2.Travel_Plan__c = tripId;
        restaurants.add(restaurant2);
        return restaurants;
    }
}