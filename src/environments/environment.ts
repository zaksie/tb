import {default as auth} from '../../auth_config.json';

export const environment = {
  production: false,
  backend: 'http://localhost:3000',
  spdy_backend: '',
  auth: {
    domain: auth.domain,
    clientId: auth.clientId,
  },
  frontend: 'http://localhost:4200',

}
