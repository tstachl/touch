Ext.define('touch.view.contacts.show', {
  extend: 'Ext.Container',
  
  config: {
    layout: Ext.os.deviceType == 'Phone' ? 'fit' : {
      type: 'vbox',
      align: 'center',
      pack: 'center'
    },
    items: {
      width: Ext.os.deviceType == 'Phone' ? null : 400,
      flex: Ext.os.deviceType == 'Phone' ? null : 1,
      styleHtmlContent: true,
      scrollable: true,
      tpl: Ext.create('Ext.XTemplate',
        '<div class="contacts-header">',
          '<span class="contacts-picture"><img src="{[this.getPicture(values.Picture__c)]}" /></span>',
          '<h3>{FirstName} {LastName}</h3>',
          '<small>{Title}</small>',
        '</div>',
        '<div class="x-body contacts-body">',
          '<div class="x-inner x-form-fieldset-inner">',
            '<div class="x-container x-field-text x-field x-label-align-left x-field-labeled x-form-label-nowrap x-empty">',
              '<div class="x-form-label" style="width: 35% !important">Email</div>',
              '<div class="x-component-outer">',
                '<div class="x-field-input">',
                  '<span class="x-input-el x-form-field x-input-text">{Email}</span>',
                '</div>',
              '</div>',
            '</div>',
            '<div class="x-container x-field-text x-field x-label-align-left x-field-labeled x-form-label-nowrap x-empty">',
              '<div class="x-form-label" style="width: 35% !important">Phone</div>',
              '<div class="x-component-outer">',
                '<div class="x-field-input">',
                  '<span class="x-input-el x-form-field x-input-text">{Phone}</span>',
                '</div>',
              '</div>',
            '</div>',
            '<div class="x-container x-field-text x-field x-label-align-left x-field-labeled x-form-label-nowrap x-empty">',
              '<div class="x-form-label" style="width: 35% !important">Mobile</div>',
              '<div class="x-component-outer">',
                '<div class="x-field-input">',
                  '<span class="x-input-el x-form-field x-input-text">{MobilePhone}</span>',
                '</div>',
              '</div>',
            '</div>',
            '<div class="x-container x-field-text x-field x-label-align-left x-field-labeled x-form-label-nowrap x-empty">',
              '<div class="x-form-label" style="width: 35% !important">Address</div>',
              '<div class="x-component-outer">',
                '<div class="x-field-input">',
                  '<span class="x-input-el x-form-field x-input-text">{[this.toBr(values.MailingStreet)]}<br />{MailingCity}, {MailingState} {MailingPostalCode}<br />{MailingCountry}</span>',
                '</div>',
              '</div>',
            '</div>',
          '</div>',
        '</div>',
        {
          getPicture: function(url) {
            if (Ext.isEmpty(url))
              return 'https://na7.salesforce.com/social/images/unknown_profile_pic.png';
            return url;
          },
          toBr: function(str) {
            return str.replace('\n', '<br />');
          }
        }
      )
    }
  },
  
  applyData: function(data) {
    for (var key in data) {
      data[key] = data[key] ? data[key] : '';
    }
    this.child('container').setData(data);
    return data;
  },
  
  getRoute: function() {
    return 'contact/' + this.getData().Id;
  }
});