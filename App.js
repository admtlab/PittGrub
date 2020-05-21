import { KeepAwake, registerRootComponent } from 'expo';
import App from './src/index';

if (__DEV__) {
  KeepAwake.activate();
}

registerRootComponent(App);
