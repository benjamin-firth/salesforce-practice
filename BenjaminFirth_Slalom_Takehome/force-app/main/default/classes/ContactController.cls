public with sharing class ContactController {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContactList() {
        return [
            SELECT Name,Title,Phone,Email
            FROM Contact
            WHERE (accountId=null) 
            ORDER BY Name
        ];
    }

    // This query was initially a little challenging.  
    // To figure out how to get at the names I created (they didn't have an associated account),
    // I had to use the Query Editor in the Developer Console.
}
