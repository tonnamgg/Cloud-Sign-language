import { Amplify } from 'aws-amplify';

export const isDev = !import.meta.env.VITE_USER_POOL_ID || import.meta.env.VITE_USER_POOL_ID === 'your-user-pool-id';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_USER_POOL_ID as string,
      userPoolClientId: import.meta.env.VITE_APP_CLIENT_ID as string,
      loginWith: {
        username: true,
        email: true,
      },
    }
  }
});