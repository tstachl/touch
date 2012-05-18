Ext.Loader.setPath({
  'Force': 'lib/force'
});

Ext.application({
  name: 'touch',
  
  requires: [
    'Ext.MessageBox',
    'Ext.data.Store',
    'Force.data.Model',
    'Force.data.Proxy',
    'Force.Auth'
  ],
  
  views: ['home.login'],
  controllers: [
    'Home',
    'Contacts'
  ],
  models: [
    'SessionUser',
    'Contact'
  ],
  stores: [
    'Session',
    'Contact'
  ],

  icon: {
    '57': 'resources/icons/Icon.png',
    '72': 'resources/icons/Icon~ipad.png',
    '114': 'resources/icons/Icon@2x.png',
    '144': 'resources/icons/Icon~ipad@2x.png'
  },

  isIconPrecomposed: true,

  startupImage: {
    '320x460': 'resources/startup/320x460.jpg',
    '640x920': 'resources/startup/640x920.png',
    '768x1004': 'resources/startup/768x1004.png',
    '748x1024': 'resources/startup/748x1024.png',
    '1536x2008': 'resources/startup/1536x2008.png',
    '1496x2048': 'resources/startup/1496x2048.png'
  },
  
  launch: function() {
    // destroying the app loading indicator
    Ext.fly('appLoadingIndicator').destroy();
    // creating the login view and the viewport
    Ext.create('touch.view.home.login');
    
    var me       =  this,
        viewport =  Ext.create('Ext.tab.Panel', {
                      fullscreen: true,
                      hidden: true,
                      id: 'viewport',
                      tabBarPosition: 'bottom'
                    }),
        config =    {
                      clientId: '3MVG9yZ.WNe6byQB25O_69lPCXYou4_2z_bHyLyBv_VQwLxB9kz5iNuzGsdtZa_U_JjAXLnMf7.BZAiFi3sXM',
                      clientSecret: '1157068118117890698',
                      useProxy: true,
                      proxyUrl: '/api'
                    };
    
    Force.Auth.setup(config);
  },
  
  onUpdated: function() {
    Ext.Msg.confirm(
      "Application Update",
      "This application has just successfully been updated to the latest version. Reload now?",
      function(buttonId) {
        if (buttonId === 'yes') {
          window.location.reload();
        }
      }
    );
  }
});
