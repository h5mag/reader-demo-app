import Icon from 'react-native-vector-icons/Ionicons'; Icon.loadFont();
import React, { useEffect, useState, useCallback } from 'react';
import { StatusBar, View, Text, Pressable, ActivityIndicator, Image } from 'react-native';
import EditionMenu from '../components/EditionMenu';
import EditionIcon from '../components/EditionIcon';
import { FlatList } from 'react-native-gesture-handler';
import DbQuery from '../util/Queries';
import { useFocusEffect } from '@react-navigation/native';
import styles from '../css/style';
import sv from '../css/variables';
import { goToEdition } from '../util/Editions';
import { useQueryClient } from 'react-query';

export default function Downloads({ navigation, route }) {
	const queryClient = useQueryClient();

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
	 * Update edition downloaded state.
	 * @param {edition} edition
	 */
	const onChangeDownloaded = (edition) => {
		queryClient.setQueryData(['editions.status', edition.href], () => { return edition.status; });
		queryClient.setQueryData(['editions.favorite', edition.href], () => { return edition.favorite; });

		getDownloadedEditions();
	};

	const renderItem = ({ item }) => (
		<View style={styles.editionBlock}>
			<Pressable onPress={() => goToEdition(item, item.projectDomain, navigation)} style={[styles.flexRowContainer, styles.spaceBetween, styles.alignCenter]}>
				<Image source={{ uri: item.screenshot_src }} style={styles.editionPhotoSmall} />

				<EditionIcon item={item} />

				<View style={styles.editionBlockDescription}>
					<Text style={styles.editionTitle}>
						{item.title}
					</Text>
					<Pressable onPress={() => navigation.navigate('Editions', { projectDomain: item.projectDomain })}>
						<Text>In {item.projectDomain} <Icon name={'chevron-forward'} size={12} color={sv.primaryColor} /></Text>
					</Pressable>
				</View>

				<EditionMenu edition={item} projectDomain={item.projectDomain} navigation={navigation} route={route} onChangeFavorite={onChangeDownloaded} onChangeDownloaded={onChangeDownloaded} />
			</Pressable>
		</View>
	);

	return (
		<View style={styles.editionContainer}>
			<StatusBar barStyle="light-content" backgroundColor={sv.primaryColor} />
			{isLoading ? <ActivityIndicator /> : (
				<FlatList
					ListHeaderComponent={
						<Text style={[styles.header, styles.mb2, styles.ml2, styles.mt3]}>
							Downloads
						</Text>
					}
					ListEmptyComponent={<Text style={[styles.black, styles.ml2]}>No downloads were found...</Text>}
					data={editions}
					renderItem={renderItem}
					keyExtractor={item => item.href}
				/>
			)}
		</View>
	);
}
