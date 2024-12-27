const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
    1013917016901-b0o7dhm29ecf0jvufkhes3af33e670gp.apps.googleusercontent.com,
    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,
    'http://localhost:3003/auth/google/callback'
);

const code = 'YOUR_AUTHORIZATION_CODE'; // Replace with the code you received

oauth2Client.getToken(code, (err, tokens) => {
  if (err) {
    console.error('Error getting oAuth tokens:', err);
    return;
  }
  console.log('Refresh Token:', tokens.refresh_token);
});