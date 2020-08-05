@isTest
public with sharing class ContactControllerTest {
    @isTest static void testGetContactList() {
        String testDirection = 'asc';
        String testBy = 'Title';

        List<Contact> getContacts = ContactController.getContactList(testDirection, testBy);
        
        System.assertNotEquals(null, getContacts);
    }
}
