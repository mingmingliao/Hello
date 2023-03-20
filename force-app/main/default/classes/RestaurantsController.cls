public with sharing class RestaurantsController {
    @AuraEnabled(cacheable=true)
    public static List<Restaurant__c> getRestaurants(Id tripId) {
        try {
            List<Restaurant__c> restaurants = [SELECT Name, Travel_Plan__r.Id, Location__Latitude__s, Location__Longitude__s
                                                FROM Restaurant__c 
                                                WHERE Travel_Plan__r.Id =: tripId];
            return restaurants;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    
    @AuraEnabled(cacheable=true)
    public static void updateRestaurants(List<Restaurant__c> restaurants) {

    }
}