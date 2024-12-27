const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
    "1013917016901-b0o7dhm29ecf0jvufkhes3af33e670gp.apps.googleusercontent.com",
    "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",
    'http://localhost:3003/auth/google/callback'
);

const scopes = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://mail.google.com/',
];

const url = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
});

console.log('Authorize this app by visiting this url:', url);
