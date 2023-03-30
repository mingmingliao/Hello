public with sharing class TravelAppController {
    @AuraEnabled(cacheable=true)
    public static List<Travel_Plan__c> getTravelTrips() {
        List<Travel_Plan__c> travelList = [SELECT Name, Id FROM Travel_Plan__c];
        system.debug(travelList);
        return travelList;
    }
}