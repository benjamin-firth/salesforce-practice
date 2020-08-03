import { LightningElement, wire, api, track } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getContactList from '@salesforce/apex/ContactController.getContactList';

export default class ContactForm extends LightningElement {
  @track error;
  @track data = [];
  @api sortedDirection = 'asc';
  @api sortedBy = 'Name';
  result;
  @track columns = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Title', fieldName: 'Title', sortable: true},
    { label: 'Phone', fieldName: 'Phone', type: 'phone' },
    { label: 'Email', fieldName: 'Email', type: 'email' },
  ];

  @wire(getContactList, {sortBy: '$sortedBy', sortDirection: '$sortedDirection' })
  contactCheck(result) {
    this.result = result;
    if (result.data) {
      this.data = result.data;
    } else if (result.error) {
      this.error = result.error;
    }
  }

  sortColumns( event ) {
    this.sortedBy = event.detail.fieldName;
    this.sortedDirection = event.detail.sortDirection;
    return refreshApex(this.result);
  }

  // It seems like this functionality could be done in either JS or Apex. 
  // Is there a reason you might choose one over the other?
}