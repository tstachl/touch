Ext.define('touch.controller.Contacts', {
  extend: 'Ext.app.Controller',
  requires: [
    'Ext.ActionSheet',
    'touch.model.Contact',
    'touch.view.contacts.index',
    'touch.view.contacts.show',
    'touch.view.contacts.edit',
    'touch.view.contacts.create'
  ],
  
  config: {
    control: {
      index: {
        painted: 'onIndexShow',
        back: 'onBackButtonTap',
        activeitemchange: 'onActiveItemChange'
      },
      list: {
        itemtap: 'onItemTap',
        itemswipe: 'onItemSwipe'
      },
      'button[action=create]': {
        tap: 'onCreateTap'
      },
      'button[action=edit]': {
        tap: 'onEditTap'
      },
      'button[action=save]': {
        tap: 'onSaveTap'
      },
      'button[action=delete]': {
        tap: 'onDeleteTap'
      }
    },
    routes: {
      'contacts': 'index',
      'contact/new': 'create',
      'contact/:id': 'show',
      'contact/:id/edit': 'edit'
    },
    refs: {
      index: '#contactsindex',
      list: '#contactslist'
    },
    deleteConfirmSheet: null
  },
  
  launch: function() {
    // adding the home screen to the viewport
    Ext.getCmp('viewport').add([
      Ext.create('touch.view.contacts.index')
    ]);
  },
  
  /**
   * ROUTES
   */
  index: function() {
    var viewCount = this.getIndex().getInnerItems().length;
    Ext.getCmp('viewport').setActiveItem(this.getIndex());
    this.getIndex().switchButton();
    if (viewCount > 1)
      this.getIndex().pop(viewCount - 1)
  },
  create: function() {
    Ext.getCmp('viewport').setActiveItem(this.getIndex());
    this.pushView('create');
    this.getIndex().switchButton('save');
  },
  show: function(id) {
    var me = this, once = true;
    Ext.getCmp('viewport').setActiveItem(me.getIndex());
    if (Ext.getStore('Contact').isLoaded()) {
      me.pushView('show', id);
    } else {
      Ext.getStore('Contact').on('load', function() {
        if (once) {
          me.pushView('show', id);
          once = false;
        }
      });
    }
    me.getIndex().switchButton('edit');
  },
  edit: function(id) {
    var me = this, once = true;
    Ext.getCmp('viewport').setActiveItem(me.getIndex());
    if (Ext.getStore('Contact').isLoaded()) {
      me.pushView('edit', id);
    } else {
      Ext.getStore('Contact').on('load', function() {
        if (once) {
          me.pushView('edit', id);
          once = false;
        }
      });
    }
    me.getIndex().switchButton('save');
  },
  doDelete: function() {
    var me   = this,
        data = me.getIndex().getActiveItem().getData() ||
                me.getList().getLastSelected().getData();
    
    me.getDeleteConfirmSheet().hide();
    Ext.Viewport.setMasked({
      xtype: 'loadmask',
      message: 'Deleting ...'
    });
    if (data && data.Id) {
      Ext.getStore('Contact').getById(data.Id).erase({
        success: function(rec) {
          Ext.Viewport.unmask();
          me.getIndex().switchButton();
          Ext.getStore('Contact').remove(rec);
          me.redirectTo(me.getIndex().getRoute());
        }
      });
    }
  },
  
  /**
   * EVENT LISTENERS
   */
  onIndexShow: function() {},
  
  onItemTap: function(list, index, target, record, evt, eopts) {
    // don't want the tap to go anywhere else
    evt.stopEvent();
    evt.stopPropagation();
    
    this.redirectTo(record.toUrl());
  },
  
  onItemSwipe: function(list, index, target, record, evt, eopts) {
    // don't want the swipe to go anywhere else
    evt.stopEvent();
    evt.stopPropagation();
    
    // if selected deselect the record
    if (list.isSelected(record) && target.hasCls('x-item-decline')) {
      this.getIndex().switchButton();
      list.deselect(record, true);
    } else {
      // else select
      this.getIndex().switchButton('delete');
      list.select(record);
      target.addCls('item', 'x', 'decline');
    }
  },
  
  onActiveItemChange: function() {
    this.getList().deselectAll();
    
  },
  
  onCreateTap: function() {
    this.redirectTo('contact/new');
  },
  
  onEditTap: function() {
    this.redirectTo(this.getIndex().getActiveItem().getRoute() + '/edit');
  },
  
  onSaveTap: function() {
    Ext.Viewport.setMasked({
      xtype: 'loadmask',
      message: 'Saving Contact ...'
    });
    
    var me      = this,
        hash    = me.getIndex().down('formpanel').getValues(),
        record  = Ext.isDefined(hash.Id) ? 
                    Ext.getStore('Contact').getById(hash.Id) :
                    Ext.create('touch.model.Contact', hash),
        phantom = record.phantom,
        views   = me.getIndex().getInnerItems().length;
    
    if (!phantom) {
      record.set(hash);
    }
    
    if (record.dirty || phantom) {
      record.save({
        success: function(rec, operation) {
          Ext.Viewport.unmask();
          me.getIndex().switchButton();
          if (phantom) Ext.getStore('Contact').add(rec);
          if (views > 1)
            me.getIndex().pop(views - 1);
          me.redirectTo(record.toUrl());
        }
      });
    } else {
      Ext.Viewport.unmask();
      if (views > 1)
        me.getIndex().pop(views - 1);
      me.redirectTo(record.toUrl());
    }
  },
  
  onDeleteTap: function() {
    if (!this.getDeleteConfirmSheet()) {
      this.setDeleteConfirmSheet(Ext.Viewport.add({
        xtype: 'actionsheet',
        items: [{
          text: 'Delete',
          ui: 'decline',
          scope: this,
          handler: this.doDelete
        }, {
          text: 'Cancel',
          scope: this,
          handler: function() {
            this.getDeleteConfirmSheet().hide();
          }
        }]
      }));
    }
    this.getDeleteConfirmSheet().show();
  },
  
  onBackButtonTap: function(index) {
    var route = index.getRoute();
    if (Ext.isDefined(index.getActiveItem().getRoute)) {
      route = index.getActiveItem().getRoute();
      if (route.indexOf('edit') === -1) {
        this.getIndex().switchButton('edit');
      }
    } else {
      this.getIndex().switchButton();
    }
    this.getApplication().getHistory().add(Ext.create('Ext.app.Action', {
      url: route
    }), true);
  },
  
  pushView: function(view, id) {
    var me     = this,
        record = id ? Ext.getStore('Contact').getById(id) : null,
        title  = id && record ? record.getFullName() : 'New Contact',
        data   = id && record ? record.getData() : null;
    
    if (id && !record) return me.redirectTo(me.getIndex().getRoute());
    
    this.getIndex().push({
      xclass: 'touch.view.contacts.' + view,
      title: title,
      data: data
    });
  }
});