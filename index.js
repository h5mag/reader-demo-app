/**
 * @format
 */

import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import Database from './Database';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => Database);
