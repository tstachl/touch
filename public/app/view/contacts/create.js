Ext.define('touch.view.contacts.create', {
  extend: 'Ext.Container',
  requires: [
    'Ext.form.Panel',
    'Ext.form.FieldSet',
    'Ext.field.Text',
    'Ext.field.Email',
    'Ext.field.TextArea'
  ],
  
  config: {
    layout: Ext.os.deviceType == 'Phone' ? 'fit' : {
      type: 'vbox',
      align: 'center',
      pack: 'center'
    },
    items: {
      xtype: 'formpanel',
      width: Ext.os.deviceType == 'Phone' ? null : 400,
      flex: Ext.os.deviceType == 'Phone' ? null : 1,
      styleHtmlContent: true,
      scrollable: true,
      
      items: [{
        xtype: 'fieldset',
        title: 'Contact Details',
        
        items: [{
          xtype: 'textfield',
          name:  'FirstName',
          label: 'Firstname'
        }, {
          xtype: 'textfield',
          name:  'LastName',
          label: 'Lastname'
        }, {
          xtype: 'textfield',
          name:  'Title',
          label: 'Title'
        }, {
          xtype: 'emailfield',
          name:  'Email',
          label: 'Email'
        }, {
          xtype: 'textfield',
          name:  'Phone',
          label: 'Phone'
        }, {
          xtype: 'textfield',
          name:  'MobilePhone',
          label: 'Mobile'
        }, {
          xtype: 'textareafield',
          name:  'MailingStreet',
          label: 'Street'
        }, {
          xtype: 'textfield',
          name:  'MailingCity',
          label: 'City'
        }, {
          xtype: 'textfield',
          name:  'MailingState',
          label: 'State'
        }, {
          xtype: 'textfield',
          name:  'MailingPostalCode',
          label: 'Zip'
        }, {
          xtype: 'textfield',
          name:  'MailingCountry',
          label: 'Country'
        }]
      }]
    }
  },
  
  getRoute: function() {
    return 'contact/new';
  }
});