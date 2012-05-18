'use strict';

Ext.String.camelize = function(str) {
  return str.replace(/(?:[-_])(\w)/g, function(_, c) {
    return c ? c.toUpperCase () : '';
  });
};

Ext.define('Force.Auth', {
  extend: 'Ext.Base',
  mixins: ['Ext.mixin.Observable'],
  singleton: true,
  
  PROXY_HEADER: 'Proxy',
  LOGIN_URL: 'https://login.salesforce.com/services/oauth2/authorize',
  TOKEN_URL: 'https://login.salesforce.com/services/oauth2/token',
  ERROR_MAP: {
    invalid_request:            'The request is missing a required parameter, includes an unknown parameter or parameter value, or is otherwise malformed.',
    invalid_client:             'The client identifier provided is invalid.',
    unauthorized_client:        'The client is not authorized to use the requested response type.',
    redirect_uri_mismatch:      'The redirection URI provided does not match a pre-registered value.',
    access_denied:              'The end-user or authorization server denied the request.',
    unsupported_response_type:  'The requested response type is not supported by the authorization server.',
    invalid_grant:              'Please check your credentials and make sure your IP is not restricted.',
    300:                        'The value used for an external ID exists in more than one record. The response body contains the list of matching records.',
    400:                        'The request could not be understood, usually because the JSON or XML body has an error.',
    401:                        'The session ID or OAuth token used has expired or is invalid.',
    403:                        'The request has been refused. Verify that the logged-in user has appropriate permissions.',
    404:                        'The requested resource could not be found. Check the URI for errors, and verify that there are no sharing issues.',
    405:                        'The method specified in the Request-Line is not allowed for the resource specified in the URI.',
    415:                        'The entity specified in the request is in a format that is not supported by specified resource for the specified method.',
    500:                        'An error has occurred within Force.com, so the request could not be completed. Contact salesforce.com Customer Support.'
  },
  
  loggedIn: false,
  
  config: {
    proxyUrl: '',
    useProxy: false,
    
    clientId: '',
    clientSecret: '',
    redirectUri: '',
    display: 'touch',
    scope: 'id api',
    state: '',
    version: '24.0',
    
    id: '',
    accessToken: '',
    instanceUrl: '',
    refreshToken: '',
    assertedUser: '',
    userId: '',
    organizationId: '',
    username: '',
    password: '',
    nickName: '',
    displayName: '',
    email: '',
    active: false,
    userType: '',
    language: '',
    locale: '',
    utcOffset: '',
    lastModifiedDate: ''
  },
  
  /**
   * Events:
   * failure - 1 argument error message
   * login - 1 argument Force.Auth
   **/
  
  setup: function(config) {
    this.initConfig(config);
    
    Ext.Ajax.on('beforerequest', this.onBeforeRequest, this);
    Ext.Ajax.on('requestexception', this.onRequestException, this);
    this.on('logout', this.onLogout, this);
  },
  
  authenticate: function() {
    // password flow
    if (!Ext.isEmpty(this.getPassword())) {
      this.postRequest(Force.Auth.TOKEN_URL, {
        grant_type: 'password',
        client_id: this.getClientId(),
        client_secret: this.getClientSecret(),
        username: this.getUsername(),
        password: this.getPassword(),
        callback: this.processAuthentication
      });
      this.setPassword(null);
      return;
    }
    
    // session flow
    if (!Ext.isEmpty(this.getId()) && !Ext.isEmpty(this.getAccessToken()))
      return this.getRequest(this.getId(), { callback: this.processUserInformation });
    
    return this.fireEvent('failure', 'Can not authenticate, no method provided.');
  },
  
  postRequest: function(url, params) {
    this.request('POST', url, params);
  },
  
  getRequest: function(url, params) {
    this.request('GET', url, params);
  },
  
  processAuthentication: function(req, success, rsp) {
    // try to decode the response body
    var hash = this.decodeHash(rsp.responseText);
    
    // callout is not possible, internet connection, proxy?
    if (!success && !hash.hasOwnProperty('error'))
      return this.fireEvent('failure', Force.Auth.ERROR_MAP[rsp.status] || 'Something went wrong, please try again later.');
    
    if (hash.hasOwnProperty('error'))
      return this.fireEvent('failure', Force.Auth.ERROR_MAP[hash.error] || 'Something went wrong, please try again later.');
    
    for (var key in hash) {
      hash[Ext.String.camelize(key)] = hash[key];
      if (Ext.String.camelize(key) !== key) delete hash[key];
    }
    
    this.setConfig(hash);
    this.getRequest(this.getId(), { callback: this.processUserInformation });
  },
  
  processUserInformation: function(req, success, rsp) {
    // try to decode the response body
    var hash = this.decodeHash(rsp.responseText);
    
    if (!success && !hash.hasOwnProperty('error')) return this.fireEvent('failure', Force.Auth.ERROR_MAP[rsp.status]);
    
    if (hash.hasOwnProperty('error') && !Ext.isEmpty(hash.error))
      return this.fireEvent('failure', Force.Auth.ERROR_MAP[hash.error] || 'User information could not be retrieved, please try again later.');
    
    for (var key in hash) {
      hash[Ext.String.camelize(key)] = hash[key];
      delete hash[key];
    }
    this.setConfig(hash);
    this.loggedIn = true;
    this.fireEvent('login', this);
  },
  
  request: function(method, url, params) {
    var callback;
    if (params && params.hasOwnProperty('callback')) {
      callback = params.callback;
      delete params.callback;
    }
    
    Ext.Ajax.request({
      url: url,
      params: params,
      method: method,
      callback: callback,
      scope: this
    });
  },
  
  onBeforeRequest: function(_, options) {
    options.headers = options.headers || {};
    // check if we have to prepend the instance url
    if (options.url.indexOf('http') !== 0) {
      // throw an error if we don't have an instance url
      if (Ext.isEmpty(this.getInstanceUrl())) throw new Error('['+ Ext.getDisplayName(arguments.callee) +'] No instance url has been defined.');
      // set the new url prepending the instance url and adding the version
      options.url = Ext.String.format('{0}/services/data/v{1}{2}', this.getInstanceUrl(), this.getVersion(), options.url);
    }
    
    // if we use a proxy we need to set the header
    if (this.getUseProxy()) {
      // throw an error if there is no proxy url defined
      if (Ext.isEmpty(this.getProxyUrl())) throw new Error('['+ Ext.getDisplayName(arguments.callee) +'] No proxy url has been defined.');
      options.headers[this.PROXY_HEADER] = options.url;
      options.url = this.getProxyUrl();
    }
  },
  
  onRequestException: function(conn, response, options) {
    if (response.status === 401 && this.loggedIn) {
      Ext.Ajax.abortAll();
      if (this.getRefreshToken()) this.tryReconnect();
      this.setAccessToken('');
      this.fireEvent('logout');
    } else {
      var hash    = this.decodeHash(response.responseText),
          message = '';
      if (!Ext.isArray(hash)) hash = [hash];
      hash.forEach(function(item) {
        if (item.hasOwnProperty('message')) {
          message += ' ' + item.message;
        }
      });
      Ext.Msg.alert(response.statusText, message.trim() || 'No error message available. Please contact the support.', Ext.emptyFn);
    }
  },
  
  onLogout: function() {
    this.loggedIn = false;
  },
  
  decodeHash: function(str) {
    // try to decode the response body
    try { str = Ext.JSON.decode(str); }
    catch (e) { str = Ext.Object.fromQueryString(str); }
    return str;
  },
  
  applyAccessToken: function(token) {
    if (!Ext.isEmpty(token))
      Ext.Ajax.setDefaultHeaders({
        'Authorization': 'OAuth ' + token
      });
    return token;
  }
});