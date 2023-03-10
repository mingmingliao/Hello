public class AddContacts {
    public static void addFiveHundredContacts() {
        List<String> firstNamePool = new List<String>{'Edward', 'Ed', 'Bob', 'Paul', 'Liam', 'Kyle', 'John', 'Johnny', 
            'Zariah','Tallon','Harlyn','Alucard','Farren','Jaelyn','Rowan','Yehuda','Anwen','Gage','Dion','Torryn','Enoch',
            'Britta','Sveah','Rhea','Thaddeus','Neva','Bronwy','Imre','Greer','Elora','Josiah','Caspian','Roderick','Ainsley',
            'Kyan','Embry','Ina','Augustin','Bodhi','Ulani','Corbin','Kaia','Gracen','Malachi','Thea','Delaney', 'Ben',
            'Lazy', 'Noel', 'Bobby'};
        List<String> lastNamePool = new List<String> {'Elsher','Solace','Levine','Thatcher','Raven','Bardot','St. James','Hansley','Cromwell','Ashley'};
        
        List<Contact> cons = new List<Contact>();
        for (String firstName : firstNamePool) {
            for (String lastName : lastNamePool) {
                cons.add(new Contact(FirstName=firstName, LastName=lastName));
            }
        }
        List<Account> accounts = new List<Account>();
        for (Contact con : cons) {
            accounts.add(new Account(Name=(con.FirstName + con.LastName + 'Account')));
        }
        insert accounts;
        
        for (Integer i = 0; i < accounts.size(); i++) {
            cons[i].AccountId = accounts[i].id; 
        }
        insert cons;
    }
}