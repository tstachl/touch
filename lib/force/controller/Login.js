Ext.define('Force.controller.Login', {
    extend: 'Ext.app.Controller',
    
    config: {
      responseType: 'token',
      clientId: '',
      redirectUri: '',
      display: 'touch',
      scope: 'id api refresh_token',
      state: '',
      
      accessToken: '',
      refreshToken: '',
      instanceUrl: '',
      id: '',
      issuedAt: '',
      signature: '',
      
      loginUrl: '',
    },
    
    init: function() {
      if (!this.getClientId()) return;
      
      this.setLoginUrl('https://login.salesforce.com/services/oauth2/authorize?' + Ext.Object.toQueryString({
        response_type: this.getResponseType(),
        client_id: this.getClientId(),
        redirect_uri: this.getRedirectUri() || window.location.protocol + "//" + window.location.host + window.location.pathname,
        display: this.getDisplay(),
        scope: this.getScope(),
        state: this.getState()
      }));
    }
});