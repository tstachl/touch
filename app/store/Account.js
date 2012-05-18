Ext.define('touch.store.Account', {
  extend: 'Ext.data.Store',
  requires: ['Ext.data.proxy.Force'],
  
  config: {
    model: 'touch.model.Account',
    proxy: {
      type: 'force'
    },
    sorters: 'Name',
    grouper: function(rec) {
      return rec.get('Name')[0];
    }
  }
});