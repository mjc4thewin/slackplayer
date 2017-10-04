interface AuthConfig {
  clientID: string;
  domain: string;
  callbackURL: string;
  apiUrl: string;
}

export const AUTH_CONFIG: AuthConfig = {
  clientID: '{YOUR_CLIENT_ID}', 
  domain: '{YOUR_AUTH0_DOMAIN}',
  callbackURL: 'http://localhost:8100/#/callback',
  apiUrl: '{YOUR_API_URL}'
};




