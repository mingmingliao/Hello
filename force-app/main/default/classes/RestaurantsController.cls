public with sharing class RestaurantsController {
    
    @AuraEnabled(cacheable=true)
    public static void updateRestaurants(List<Restaurant__c> restaurants) {

    }
}