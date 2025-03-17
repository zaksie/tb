import { default as auth } from '../../auth_config.json';

export const environment = {
  production: false,
  backend: '',
  auth: {
    domain: auth.domain,
    clientId: auth.clientId,
  },
}
