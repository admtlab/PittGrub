import { Constants } from 'expo';


export const supportEmail = userId => `

  ____________________________________________
  Please enter support inquiry above the line

  User ID: ${userId}
  App version: ${Constants.manifest.version}
  Device type: ${Constants.platform.ios ? Constants.platform.ios.model : Constants.deviceName}
  System version: ${Constants.platform.ios
    ? Constants.platform.ios.systemVersion || ''
    : Constants.platform.android.versionCode || ''}

`;
