public with sharing class ContactController {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContactList(String sortBy, String sortDirection) {
        String query = 'SELECT Name,Title,Phone,Email FROM Contact WHERE (accountId=null) ';
        
        if (sortBy != null && sortDirection != null) {
            query += ' ORDER BY ' + sortBy + ' ' + sortDirection;
        }

        return Database.query(query);
    }
}

// ASSIGNMENT NOTES:

// This query was initially a little challenging.
// To figure out how to get at the names I created (they didn't have an 
// associated account), I had to use the Query Editor in the Developer Console.

// The conditional changes the query from the default sortedBy
// Name to whatever is passed in for the sortBy and sortDirection
// variables.  This is then appended to the query string, so
// that the contacts can be sorted by title.

// The AuraEnabled cacheable=true caches the returned result 
// from the getContactList method.  This can only be cached 
// if the data isn't mutated.

// I went back and forth on whether to make the query public
// or private.  I'd be interested to hear best practice for this.
// Public means the method or variable can be used by any Apex 
// in this application, which seemed helpful. I could see that 
// potentially being an issue if you have a large quantity of  
// class methods, but for this application public seemed okay.
// Private is the default and means that the method or variable
//  is accessible only within the Apex class. If you do not 
// specify an access modifier, the method or variable is private.

// Static variables or methods can’t be accessed through an
// instance of that class.  Here it didn't seem necessary, but 
// perhaps in a more complex application it would be.
