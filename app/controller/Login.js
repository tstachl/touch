Ext.define('touch.controller.Login', {
    extend: 'Force.controller.Login',
    
    config: {
      clientId: '3MVG9yZ.WNe6byQB25O_69lPCXYou4_2z_bHyLyBv_VQwLxB9kz5iNuzGsdtZa_U_JjAXLnMf7.BZAiFi3sXM',
      redirectUri: 'https://login.salesforce.com/services/oauth2/success'
    },
    
    launch: function() {
      alert(this.getLoginUrl());
    }
});