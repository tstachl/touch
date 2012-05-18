Ext.define('touch.store.Session', {
  extend: 'Ext.data.Store',
  requires: ['Ext.data.proxy.SessionStorage'],
  
  config: {
    model: 'touch.model.SessionUser',
    proxy: {
      type: 'sessionstorage',
      id: 'SessionUser'
    }
  }
});