import {default as auth} from '../../auth_config.json';

export const environment = {
  production: true,
  backend: '',
  spdy_backend: '',
  auth: {
    domain: auth.domain,
    clientId: auth.clientId,
  },
}
