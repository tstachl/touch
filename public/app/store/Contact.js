Ext.define('touch.store.Contact', {
  extend: 'Ext.data.Store',
  requires: ['Ext.data.proxy.Force'],
  
  config: {
    model: 'touch.model.Contact',
    proxy: {
      type: 'force'
    },
    sorters: 'LastName',
    grouper: function(rec) {
      return rec.get('FirstName')[0];
    }
  }
});