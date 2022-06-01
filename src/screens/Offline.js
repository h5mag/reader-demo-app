import Icon from 'react-native-vector-icons/Ionicons'; Icon.loadFont();
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform } from 'react-native';
import { MainBundlePath, DocumentDirectoryPath } from 'react-native-fs';
import EditionMenu from '../components/EditionMenu';
import styles from '../css/style';
import H5mag from '@h5mag/react-native-h5mag';

export default function Offline({ route, navigation }) {
	const { edition, projectDomain } = route.params;

	const osPath = Platform.OS === 'android' ? DocumentDirectoryPath : MainBundlePath;
	const targetPath = (Platform.OS === 'android' ? DocumentDirectoryPath : MainBundlePath) + '/' + projectDomain + edition.path;

	const [url, setUrl] = useState('');

	React.useLayoutEffect(() => {
		navigation.setOptions({
			title: edition.title,
			headerRight: () => (
				<EditionMenu edition={edition} projectDomain={projectDomain} navigation={navigation} route={route} onChangeFavorite={onChangeEdition} onChangeDownloaded={onChangeEdition} inNavigation={true} />
			),
		});
	}, [navigation]);

	useEffect(() => {
		H5mag.readEditionOffline(osPath, targetPath, 8086).then((result) => {
			if (result === 'success') { setUrl(targetPath); }
		});
	}, [edition.path, projectDomain, osPath, targetPath]);

	/**
	* Update edition state.
	* @param {e} edition
	*/
	const onChangeEdition = (e) => {
		navigation.setParams({
			edition: e,
		});
		if (!e.downloaded) {
			navigation.popToTop();
			navigation.navigate('Downloads', { projectDomain: projectDomain });
		}
	};

	if (url.length > 0) {
		return (<H5mag.EditionReader targetPath={url + '/index.html'} />);
	} else {
		return (<ActivityIndicator style={styles.mt5} />);
	}
}
