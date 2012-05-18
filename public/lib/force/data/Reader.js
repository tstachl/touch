Ext.define('Force.data.Reader', {
  extend: 'Ext.data.reader.Json',
  alternateClassName: 'Ext.data.reader.Force',
  alias : 'reader.force',
  
  config: {
    rootProperty: 'records',
    successProperty: 'success'
  },
  
  getResponseData: function(response) {
    var data = this.callParent([response]);
    if (data.hasOwnProperty('id')) {
      data[this.getRootProperty()] = {
        Id: data.id
      }
    }
    return data;
  }
});