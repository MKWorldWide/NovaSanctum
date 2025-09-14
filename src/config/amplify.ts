export const config = {
  aws_project_region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
  aws_cognito_region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
  aws_user_pools_id: process.env.NEXT_PUBLIC_USER_POOL_ID,
  aws_user_pools_web_client_id: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID,
  oauth: {
    domain: process.env.NEXT_PUBLIC_AWS_OAUTH_DOMAIN,
    scope: ['email', 'openid', 'profile'],
    redirectSignIn: process.env.NEXT_PUBLIC_AWS_OAUTH_REDIRECT_SIGN_IN,
    redirectSignOut: process.env.NEXT_PUBLIC_AWS_OAUTH_REDIRECT_SIGN_OUT,
    responseType: 'code',
  },
  aws_appsync_graphqlEndpoint: process.env.NEXT_PUBLIC_AWS_APPSYNC_API_URL,
  aws_appsync_region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
  aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
};
