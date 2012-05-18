Ext.define('touch.model.SessionUser', {
  extend: 'Ext.data.Model',
  
  config: {
    idProperty: 'id',
    fields: [
      { name: 'id',                 type: 'string'  },
      { name: 'accessToken',        type: 'string'  },
      { name: 'refreshToken',       type: 'string'  },
      { name: 'assertedUser',       type: 'boolean' },
      { name: 'userId',             type: 'string'  },
      { name: 'organizationId',     type: 'string'  },
      { name: 'username',           type: 'string'  },
      { name: 'nickName',           type: 'string'  },
      { name: 'displayName',        type: 'string'  },
      { name: 'email',              type: 'string'  },
      { name: 'active',             type: 'boolean' },
      { name: 'userType',           type: 'string'  },
      { name: 'language',           type: 'string'  },
      { name: 'locale',             type: 'string'  },
      { name: 'utcOffset',          type: 'int'     },
      { name: 'lastMotifiedDate',   type: 'date'    },
      { name: 'instanceUrl',        type: 'string'  }
    ],
    proxy: {
      type: 'sessionstorage',
      id: 'SessionUser'
    }
  }
});

