Ext.define('Force.data.Model', {
  extend: 'Ext.data.Model',
  requires: [
    'Force.data.Proxy'
  ],
  
  config: {
    idProperty: 'Id',
    proxy: {
      type: 'force',
    }
  },
  
  isRecordModified: function() {
    
  }
});