Ext.define('touch.controller.Home', {
  extend: 'Ext.app.Controller',
  requires: [
    'Ext.tab.Panel',
    'touch.view.home.index',
    'touch.view.home.login'
  ],
  
  config: {
    control: {
      index: {
        painted: 'onIndexShow'
      },
      'button[action=login]': {
        tap: 'doPasswordLogin'
      }
    },
    routes: {
      'home': 'index',
      'login': 'login'
    },
    refs: {
      index: '#homeindex',
      passwordField: 'passwordfield'
    },
    returnUrl: '',
    fromSession: true
  },
  
  launch: function() {
    // event listener on the auth object
    Force.Auth.on('login', this.onLogin, this);
    Force.Auth.on('failure', this.onFailure, this);
    
    // saving the return url and redirecting to login
    this.setReturnUrl(window.location.hash.substr(1));
    this.getApplication().getHistory().add(Ext.create('Ext.app.Action', {
      url: 'login'
    }), true);
    
    // masking the viewport
    Ext.Viewport.setMasked({
      xtype: 'loadmask',
      message: 'Authenticating ...'
    });
    
    // initializing from session if available
    Ext.getStore('Session').on('load', function(store, recs) {
      if (recs.length === 1) {
        Force.Auth.setConfig(store.first().getData());
      }
      Force.Auth.authenticate();
    });
    Ext.getStore('Session').load();
    
    // adding the home screen to the viewport
    Ext.getCmp('viewport').add([
      Ext.create('touch.view.home.index')
    ]);
  },
  
  /**
   * ROUTES
   */
  index: function() {
    Ext.getCmp('viewport').setActiveItem(this.getIndex());
  },
  
  login: function() {},
  
  /**
   * ACTIONS
   */
  doPasswordLogin: function() {
    // masking the viewport
    Ext.Viewport.setMasked({
      xtype: 'loadmask',
      message: 'Authenticating ...'
    });
    
    var hash = Ext.getCmp('homelogin').getValues();
    if (hash.security)
      hash.password += '9kDL1gICkkIw51huUJNdOQfoQ'
    
    Force.Auth.setConfig({
      username: hash.username,
      password: hash.password
    });
    Force.Auth.authenticate();
  },
  
  /**
   * EVENT LISTENERS
   */
  onLogin: function(auth) {
    // unmask the viewport and creating a session user
    Ext.Viewport.unmask();
    Ext.create('touch.model.SessionUser', auth.config).save();
    
    // check if we have a return url, if so redirect
    if (this.getReturnUrl() !== '/login' || this.getReturnUrl() !== '') {
      this.redirectTo(this.getReturnUrl());
    } else {
      this.redirectTo('home');
    }
    
    // load all stores for the application
    this.getApplication().getStores().forEach(function(store) {
      if (!store.isLoaded()) store.load();
    });
    
    var me = this;
    Ext.getCmp('viewport').on('activeitemchange', function(panel, value, oldValue) {
      me.getApplication().getHistory().add(Ext.create('Ext.app.Action', {
        url: value.getRoute()
      }));
    });
    
    // now show the viewport and hide the login panel
    Ext.getCmp('homelogin').hide();
    Ext.getCmp('viewport').show();
  },
  onFailure: function(message) {
    // unmask the viewport make sure viewport is hidden and login is shown
    Ext.Viewport.unmask();
    Ext.getCmp('homelogin').show();
    Ext.getCmp('viewport').hide()
    
    // if we have an active session user the session run out so we destroy it
    if (Ext.getStore('Session').first()) Ext.getStore('Session').first().erase();
    
    // change the url from wherever we came back to login
    this.redirectTo('login');
    
    // reset the form and show an alert message
    if (message && !this.getFromSession())
      Ext.Msg.alert('Login Error', message, Ext.emptyFn);
    this.setFromSession(false);
  },
  onLoginShow: function() {
    this.getPasswordField().setValue('');
  },
  onIndexShow: function() {
    
  }
});