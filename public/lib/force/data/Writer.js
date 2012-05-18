function isEmpty(o) {
  var o = {};
  for (var p in o) {
    if (o[p] != o.constructor.prototype[p])
      return false
  }
  return true;
}

Ext.define('Force.data.Writer', {
  extend: 'Ext.data.writer.Json',
  alternateClassName: 'Ext.data.writer.Force',
  alias: 'writer.force',
  
  config: {
    writeAllFields: false
  },
  
  writeRecords: function(request, data) {
    data.forEach(function(item) {
      if (Ext.isDefined(item.Id))
        delete item.Id;
    });
    return this.callParent([request, data]);
  }
});