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
    const { fieldName, sortDirection } = e.detail;
    this.sortedBy = fieldName;
    this.sortedDirection = sortDirection;
    return refreshApex(this.result);
  }

  onSubmitHandler(e) {
    e.preventDefault();
    const fields = e.detail.fields;
    const fullName = `${fields.FirstName} ${fields.LastName}`;
    let hasError = false;
    
    this.data.map(contact => {
      if (contact.Name === fullName) {
        hasError = true;
      }

      return hasError;
    });
    
    if (!hasError) {
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
  }
}

// ASSIGNMENT NOTES:

// @api, @track, and @wire are all LWC decorators.

// I understand @track to be similar to state in Javascript, 
// except that the variables are then accessible in the html. 
// Like state, @track fields are reactive.  This means if 
// the field changes, the component will rerender.

// @api exposes public methods or properties on an apex class.

// LWC's use @wire to access Salesforce data. Wire adapters take
// in an adapterId and adapterConfig.  The id is the identifier
// of the specific wire adapter that it's getting info from, in
// this case the getContactList.  The Config argument being passed
// in is an object specific to the wire adapter.  
// Finally, contactCheck is a function that receives the data 
// stream from the @wire service.  This essentially functions as
// a catch statement.

// The sortColumns method refreshes the results displayed on the 
// lightning-datatable with the sorted data. 
// I do have questions about whether this is best practice, or if there is a 
// more elegant solution.
// It seems like this functionality could be done in either JS or Apex. 
// Is there a reason you might choose one over the other?

// This onSubmitHandler logic is here to check if a name already exists in the
// data table.  If so, errorBool will be true and the duplicate toast message 
// will fire.

// LWC's can display toast messages / notifications.  These must be imported 
// from the 'lightning/platformShowToastEvent' module. They can be dispatched 
// from events.

// dispatchEvent is here because the onSubmit "stops" the event while you 
// execute the function's logic, so it must be re-dispatched.

// This last refreshApex bit refreshes the results displayed on the
// lightning-datatable. I do have questions about whether this is best practice, 
// or if there is a more elegant solution.
