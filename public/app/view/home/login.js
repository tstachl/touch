Ext.define("touch.view.home.login", {
  extend: 'Ext.form.Panel',
  requires: [
    'Ext.TitleBar',
    'Ext.field.Email',
    'Ext.field.Password',
    'Ext.form.FieldSet',
    'Ext.field.Checkbox'
  ],
  id: 'homelogin',
    
  config: {
    fullscreen: true,
    
    items: [{
      docked: 'top',
      xtype: 'titlebar',
      title: 'Authentication'
    }, {
      xtype: 'fieldset',
      title: 'Login',
      instructions: 'Please enter your credentials above.',
      items: [{
        xtype: 'emailfield',
        name: 'username',
        label: 'Username'
      }, {
        xtype: 'passwordfield',
        name: 'password',
        label: 'Password',
        id: 'loginFormPasswordField'
      }, {
        xtype: 'checkboxfield',
        name: 'security',
        label: 'Attach Security Token'
      }]
    }, {
      xtype: 'toolbar',
      docked: 'bottom',
      items: [{
        xtype: 'spacer'
      }, {
        text: 'Cancel'
      }, {
        text: 'Login',
        ui: 'confirm',
        action: 'login'
      }]
    }]
  }
});