import { Platform } from 'react-native';
import RNFS from 'react-native-fs';
import { MainBundlePath, DocumentDirectoryPath } from 'react-native-fs';

/**
 * Navigates to the online or offline EditionReader.
 * @param {string} e edition
 * @param {string} projectDomain
 * @param {any} navigation
 */
export const goToEdition = (e, projectDomain, navigation) => {
	const osPath = (Platform.OS === 'android' ? DocumentDirectoryPath : MainBundlePath) + '/' + projectDomain + e.path;
	const targetPath = osPath;

	RNFS.exists(targetPath).then((exists) => {
		if (exists && e.downloaded) {
			navigation.navigate('Offline', { edition: e, projectDomain: projectDomain });
		} else {
			navigation.navigate('Online', { edition: e, projectDomain: projectDomain });
		}
	});
};
