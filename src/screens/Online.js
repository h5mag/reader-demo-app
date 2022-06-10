import Icon from 'react-native-vector-icons/Ionicons'; Icon.loadFont();
import React from 'react';
import EditionMenu from '../components/EditionMenu';
import H5mag from '@h5mag/react-native-h5mag';
import { useQueryClient } from 'react-query';

export default function Online({ route, navigation }) {
	const { edition, projectDomain } = route.params;

	const queryClient = useQueryClient();

	/**
	 * Update global edition favorite and downloaded state.
	* @param {e} edition
	*/
	const onChangeEdition = (e) => {
		navigation.setParams({
			edition: e,
		});

		queryClient.setQueryData(['editions.favorite', e.href], () => { return e.favorite; });
		queryClient.setQueryData(['editions.status', e.href], () => { return e.status; });
	};

	React.useLayoutEffect(() => {
		navigation.setOptions({
			title: edition.title,
			headerRight: () => (
				<EditionMenu edition={edition} projectDomain={projectDomain} navigation={navigation} route={route} onChangeFavorite={onChangeEdition} onChangeDownloaded={onChangeEdition} inNavigation={true} />
			),
		});
	}, [edition, navigation, projectDomain, route]);

	return (
		<H5mag.EditionReader targetPath={edition.href} />
	);
}
