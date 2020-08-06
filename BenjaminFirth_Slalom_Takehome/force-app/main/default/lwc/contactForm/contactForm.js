import { LightningElement, wire, api, track } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
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

  sortColumns(e) {
    this.sortedBy = e.detail.fieldName;
    this.sortedDirection = e.detail.sortDirection;
    return refreshApex(this.result);
  }

  // It seems like this functionality could be done in either JS or Apex. 
  // Is there a reason you might choose one over the other?

  onSubmitHandler(e) {
    e.preventDefault();
    const fields = e.detail.fields;
    const fullName = `${fields.FirstName} ${fields.LastName}`;
    let errorBool = false;
    
    this.data.map(contact => {
      if (contact.Name === fullName) {
        errorBool = true;
      }
      return errorBool;
    });
    
    if (!errorBool) {
      this.template.querySelector('lightning-record-edit-form').submit(fields);
    } else {
      const event = new ShowToastEvent({
        title: 'Duplicate Warning',
        message: 'Contact already exists!',
        variant: 'warning',
        mode: 'dismissable'
      });

      this.dispatchEvent(event);
    }
  }

  handleSuccess() {
    const event = new ShowToastEvent({
      title: 'Record Update',
      message: 'Contact has been added!',
      variant: 'success',
      mode: 'dismissable'
    });
    const inputFields = this.template.querySelectorAll(
      'lightning-input-field'
    );

    this.dispatchEvent(event);

    if (inputFields) {
      inputFields.forEach(field => field.reset());
    }
    
    return refreshApex(this.result);
    // This last bit refreshes the results displayed on the lightning-datatable. I do have questions about whether this is best practice, or if there is a more elegant solution.
  }
}
