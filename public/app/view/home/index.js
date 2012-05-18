Ext.define('touch.view.home.index', {
  extend: 'Ext.Panel',
  requires: ['Ext.TitleBar'],
  id: 'homeindex',
  
  config: {
    title: 'Home',
    iconCls: 'home',
    route: 'home',
    
    items: [{
      docked: 'top',
      xtype: 'titlebar',
      title: 'Bread and Music'
    }, {
      layout: Ext.os.deviceType == 'Phone' ? 'fit' : {
        type: 'vbox',
        align: 'center',
        pack: 'center'
      },
      items: {
        styleHtmlContent: true,
        scrollable: true,
        width: Ext.os.deviceType == 'Phone' ? null : 400,
        height: Ext.os.deviceType == 'Phone' ? null : 500,
        html: [
          '<h4>by Conrad Aiken</h4>',
          
          '<p>Music I heard with you was more than music,<br />',
          'And bread I broke with you was more than bread;<br />',
          'Now that I am without you, all is desolate;<br />',
          'All that was once so beautiful is dead.</p>',
          
          '<p>Your hands once touched this table and this silver,<br />',
          'And I have seen your fingers hold this glass.<br />',
          'These things do not remember you, belovèd,<br />',
          'And yet your touch upon them will not pass.</p>',
          
          '<p>For it was in my heart you moved among them,<br />',
          'And blessed them with your hands and with your eyes;<br />',
          'And in my heart they will remember always,—<br />',
          'They knew you once, O beautiful and wise.</p>'
        ].join('')
      }
    }]
  }
});