public class AcademyUtility {
    
    private static List<String> firstNamePool = new List<String>{'Edward', 'Ed', 'Bob', 'Paul', 'Liam', 'Kyle', 'John', 'Johnny', 
        'Zariah','Tallon','Harlyn','Alucard','Farren','Jaelyn','Rowan','Yehuda','Anwen','Gage','Dion','Torryn','Enoch',
        'Britta','Sveah','Rhea','Thaddeus','Neva','Bronwy','Imre','Greer','Elora','Josiah','Caspian','Roderick','Ainsley',
        'Kyan','Embry','Ina','Augustin','Bodhi','Ulani','Corbin','Kaia','Gracen','Malachi','Thea','Delaney', 'Ben',
        'Lazy', 'Noel', 'Bobby'};
    private static List<String> lastNamePool = new List<String>{'Elsher','Solace','Levine','Thatcher','Raven','Bardot','St. James',
        'Hansley','Cromwell','Ashley'};
                    
    /* This function only generates Contacts, does not insert into SalesForce.
	 * 
	 */
    public static List<Contact> createRecords(Integer contactsToCreate) {
        List<Contact> cons = new List<Contact>();
        for (String firstName : firstNamePool) {
            for (String lastName : lastNamePool) {
                // add to list
                cons.add(new Contact(FirstName = firstName, LastName = lastName));
                if (cons.size() == contactsToCreate) {
                    break;
                }
            }
            // must do it in this loop as well
            if (cons.size() == contactsToCreate) {
                break;
            }
        }
        return cons;
    }
    
    public static List<Contact> query(String word) {
        List<Contact> cons = [SELECT Contact.FirstName, Contact.LastName, Contact.Id 
                              FROM Contact 
                              WHERE Contact.FirstName > :word And Contact.LastName < :word];
        return cons;
    }
}