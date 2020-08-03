import { LightningElement, wire } from 'lwc';
import getContactList from '@salesforce/apex/ContactController.getContactList';

const columns = [
  { label: 'Name', fieldName: 'Name' },
  { label: 'Title', fieldName: 'Title', sortable: true},
  { label: 'Phone', fieldName: 'Phone', type: 'phone' },
  { label: 'Email', fieldName: 'Email', type: 'email' },
];

export default class ContactForm extends LightningElement {
  @wire(getContactList) contacts;
  columns = columns;
  
}