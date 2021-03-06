Ext.define('Force.data.Proxy', {
  extend: 'Ext.data.proxy.Ajax',
  alternateClassName: 'Ext.data.proxy.Force',
  alias: 'proxy.force',
  requires: [
    'Force.data.Writer',
    'Force.data.Reader'
  ],
    
  config: {
    format: 'json',
    appendId: true,
    batchActions: false,
    pageParam: false,
    startParam: 'OFFSET',
    limitParam: 'LIMIT',
    groupParam: 'GROUP BY',
    sortParam: 'ORDER BY',
    filterParam: undefined,
    actionMethods: {
      create:  'POST',
      read:    'GET',
      update:  'PATCH',
      destroy: 'DELETE'
    },
    writer: {
      type: 'force'
    },
    reader: {
      type: 'force'
    }
  },
  
  buildUrl: function(request) {
    var me        = this,
        operation = request.getOperation(),
        records   = operation.getRecords() || [],
        record    = records[0],
        action    = request.getAction(),
        model     = me.getModel(),
        object    = model.getName().split('.').pop(),
        idProperty= model.getIdProperty(),
        format    = me.getFormat(),
        url       = me.getUrl(request) || '',
        params    = request.getParams() || {},
        id        = (record && !record.phantom) ? record.getId() : params[idProperty];
    
    if (action === 'read' && Ext.isEmpty(id)) {
      url += '/query';
    } else {
      url += '/sobjects/' + object;
    }
    
    if (me.getAppendId() && id) {
      if (!url.match(/\/$/)) {
        url += '/';
      }
      url += id;
      delete params[idProperty];
    }
    
    if (format) {
      if (!url.match(/\.$/)) {
        url += '.';
      }
  
      url += format;
    }
    
    if (action === 'read' && Ext.isEmpty(id)) {
      url = Ext.urlAppend(url, this.buildQuery(request));
    }
    
    request.setUrl(url);
    
    return me.callParent([request]);
  },
  
  buildQuery: function(request) {
    var me     = this,
        model  = me.getModel(),
        object = model.getName().split('.').pop(),
        fields = model.prototype.fields.keys.join(', '),
        params = Object.keys(request.getParams()).sort().map(function(key) { 
          return key + ' ' + request.getParams()[key]; 
        }).join(' '),
        query  = Ext.Object.toQueryString({
          q: Ext.String.format('Select {0} From {1} {2}', fields, object, params)
        });
    return query;
  }
});