public class ifClass {
    public void ifTree() {
        Contact contact = new Contact();
        
        if (contact.Name < 'E') { // starts with A-E
            if (contact.Phone != null) {
                System.debug('Well done');
            } else {
                System.debug('Add a phone lol');
            }
        } else if (contact.Name < 'L') { // starts with E-L
            if (contact.Phone != null) {
                System.debug('Something else');
            } else {
                System.debug('You don\'t need to add a phone');
            }
        } else if (contact.Name < 'P') { // starts with L-P
            Date cutoffDate = Date.newInstance(2000, 01, 01);
            if (contact.Birthdate > cutoffDate) {
                System.debug('missed the cutoff');
            } else if (contact.Birthdate < cutoffDate) {
                System.debug('boomer probably idk');
            }
        } else { // Starts with P-Z
            System.debug('you just lose');
        }
    }
}