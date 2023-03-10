public with sharing class test_lwcController {
    @AuraEnabled
    public static void sendEmail(String recipient, String subject, String message) {
        try {
            Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
            email.setToAddresses(new String[] {recipient});
            email.setSubject(subject);
            email.setHtmlBody(message);
            
            Messaging.sendEmail(new Messaging.SingleEmailMessage[] { email });
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}