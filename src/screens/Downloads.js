import Icon from 'react-native-vector-icons/Ionicons'; Icon.loadFont();
import React, { useEffect, useState, useCallback } from 'react';
import { StatusBar, View, Text, ActivityIndicator } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import DbQuery from '../util/Queries';
import { useFocusEffect } from '@react-navigation/native';
import styles from '../css/style';
import sv from '../css/variables';
import Edition from '../components/Edition';
import { useQueryClient, useQuery } from 'react-query';

export default function Downloads({ navigation, route }) {
	const queryClient = useQueryClient();
	const { data: themeTextColor } = useQuery('colorScheme.textColor');
	const { data: themeBackgroundColor } = useQuery('colorScheme.backgroundColor');

	const [isLoading, setLoading] = useState(true);
	const [editions, setEditions] = useState([]);

	useFocusEffect(
		useCallback(() => {
			getDownloadedEditions();
		}, [])
	);

	useEffect(() => {
		getDownloadedEditions();
	}, []);

	/**
	 * Retrieves editions from database where download = 1.
	 */
	const getDownloadedEditions = async () => {
		try {
			DbQuery.findAllDownloadedEditionsInDb().then((result) => {
				setEditions(result);
			});
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Update edition states.
	 * @param {edition} edition
	 */
	const onChangeEdition = (edition) => {
		queryClient.setQueryData(['editions.status', edition.href], () => { return edition.status; });
		queryClient.setQueryData(['editions.favorite', edition.href], () => { return edition.favorite; });

		getDownloadedEditions();
	};

	const renderItem = ({ item, index }) => (
		<Edition item={item} index={index} fromDownloads={true} projectDomain={item.projectDomain} navigation={navigation} route={route} onChangeDownloaded={onChangeEdition} onChangeFavorite={onChangeEdition}/>
	);

	return (
		<View style={[themeBackgroundColor, styles.editionContainer]}>
			<StatusBar barStyle="light-content" backgroundColor={sv.primaryColor} />
			{isLoading ? <ActivityIndicator /> : (
				<FlatList
					ListHeaderComponent={
						<Text style={[styles.header, styles.mb2, styles.ml2, styles.mt3, themeTextColor]}>
							Downloads
						</Text>
					}
					ListEmptyComponent={<Text style={[themeTextColor, styles.ml2]}>No downloads were found...</Text>}
					data={editions}
					renderItem={renderItem}
					keyExtractor={item => item.href}
				/>
			)}
		</View>
	);
}
