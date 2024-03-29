const config = require('config');

module.exports = (app) => {
  process.on('uncaughtException', (err) => {
    console.log(err.message, err);
    process.exit(1);
  });

  process.on('unhandledRejection', (err) => {
    throw new Error(err);
  });

  if (app.get('env') === 'production' && !config.get('auth.privateKey'))
    throw new Error('app_auth_private_key not defined.');

  if (!config.get('fcm.digimartCustomerServerKey')) {
    throw new Error('CUSTOMER_FCM_SERVER_KEY cannot be null.');
  }
};
