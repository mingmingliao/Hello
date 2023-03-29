public with sharing class TravelAppTripMapController {
    @AuraEnabled
    public static Map<String, String> getCenterOfTravelPlan(Id tripId){
        try {
            List<Travel_Plan__c> travelPlan = [SELECT Address__City__s, Address__StateCode__s, Address__CountryCode__s FROM Travel_Plan__c WHERE Travel_Plan__c.Id = :tripId];
            Map<String, String> centerLocation = new Map<String, String>();
            if (travelPlan.size() > 0) {
                Travel_Plan__c currentTrip = travelPlan[0];
                String countryCode = currentTrip.Address__CountryCode__s;
                String city = currentTrip.Address__City__s;
                String state = currentTrip.Address__StateCode__s;
                if (countryCode == null && city == null && state == null) {
                    centerLocation.put('Country', 'United States of America');
                } else {
                    centerLocation.put('Country', countryCode);
                    centerLocation.put('City', city);
                    centerLocation.put('State', state);
                }
            } else {
                // This should be some kind of error, but we'll set it as USA for now
                centerLocation.put('Country', 'United States of America');
            }
            return centerLocation;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}