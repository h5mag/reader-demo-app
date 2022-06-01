import Icon from 'react-native-vector-icons/Ionicons'; Icon.loadFont();
import React from 'react';
import EditionMenu from '../components/EditionMenu';
import H5mag from '@h5mag/react-native-h5mag';

export default function Online({ route, navigation }) {
	const { edition, projectDomain } = route.params;

	const onChangeEdition = (e) => {
		navigation.setParams({
			edition: e,
		});
	};

	React.useLayoutEffect(() => {
		navigation.setOptions({
			title: edition.title,
			headerRight: () => (
				<EditionMenu edition={edition} projectDomain={projectDomain} navigation={navigation} route={route} onChangeFavorite={onChangeEdition} onChangeDownloaded={onChangeEdition} inNavigation={true}/>
			),
		});
	}, [navigation]);

	return (
		<H5mag.EditionReader targetPath={edition.href} />
	);
}
