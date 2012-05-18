'use strict';

Ext.define('touch.model.Contact', {
  extend: 'Force.data.Model',
  
  config: {
    fields: [
      { name: 'Title',              type: 'string'  },
      { name: 'FirstName',          type: 'string'  },
      { name: 'LastName',           type: 'string'  },
      { name: 'Email',              type: 'string'  },
      { name: 'Phone',              type: 'string'  },
      { name: 'MobilePhone',        type: 'string'  },
      { name: 'MailingStreet',      type: 'string'  },
      { name: 'MailingCity',        type: 'string'  },
      { name: 'MailingState',       type: 'string'  },
      { name: 'MailingPostalCode',  type: 'string'  },
      { name: 'MailingCountry',     type: 'string'  },
      { name: 'Picture__c',         type: 'string'  }
    ]
  },
  
  getFullName: function() {
    return this.get('FirstName') + ' ' + this.get('LastName');
  }
});