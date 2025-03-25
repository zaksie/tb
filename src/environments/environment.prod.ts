import {default as auth} from '../../auth_config.json';

export const environment = {
  production: true,
  backend: 'https://battle-squire.com',
  spdy_backend: '',
  auth: {
    domain: auth.domain,
    clientId: auth.clientId,
  },
  frontend: 'https://battle-squire.com',

}
