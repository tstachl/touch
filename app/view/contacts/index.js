Ext.define('touch.view.contacts.index', {
  extend: 'Ext.navigation.View',
  requires: [
    'Ext.TitleBar',
    'Ext.dataview.List'
  ],
  id: 'contactsindex',
  
  config: {
    title: 'Contacts',
    iconCls: 'address_book',
    route: 'contacts',
    
    navigationBar: {
      items: [{
        align: 'right',
        iconCls: 'add',
        action: 'create',
        iconMask: true
      }, {
        align: 'right',
        iconCls: 'compose',
        action: 'edit',
        iconMask: true,
        hidden: true
      }, {
        align: 'right',
        iconCls: 'check_black1',
        action: 'save',
        ui: 'confirm',
        iconMask: true,
        hidden: true
      }, {
        align: 'right',
        iconCls: 'delete',
        action: 'delete',
        ui: 'decline',
        iconMask: true,
        hidden: true
      }]
    },
    
    items: [{
      title: 'Contacts',
      layout: Ext.os.deviceType == 'Phone' ? 'fit' : {
        type: 'vbox',
        align: 'center',
        pack: 'center'
      },
      items: {
        xtype: 'list',
        width: Ext.os.deviceType == 'Phone' ? null : 400,
        flex: Ext.os.deviceType == 'Phone' ? null : 1,
        ui: 'round',
        id: 'contactslist',
        grouped: true,
        indexBar: true,
        styleHtmlContent: true,
        allowDeselect: true,
        store: 'Contact',
        itemTpl: '<div class="contact"><strong>{FirstName}</strong> {LastName}</div>'
      }
    }]
  },
  
  switchButton: function(flag) {
    var flag = flag || 'create',
        nb   = this.getNavigationBar(),
        c    = nb.down('button[action=create]'),
        e    = nb.down('button[action=edit]'),
        s    = nb.down('button[action=save]'),
        d    = nb.down('button[action=delete]');
    
    d.hide();
    e.hide();
    s.hide();
    c.hide();
    
    if (flag === 'create') {
      c.show();
    } else if (flag === 'save') {
      s.show();
    } else if (flag === 'delete') {
      d.show();
    } else {
      e.show();
    }
  }
});