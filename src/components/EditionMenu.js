import Icon from 'react-native-vector-icons/Ionicons'; Icon.loadFont();
import React, { useEffect, useState } from 'react';
import { MenuView } from '@react-native-menu/menu';
import styles from '../css/style';
import sv from '../css/variables';
import RNFS from 'react-native-fs';
import { MainBundlePath, DocumentDirectoryPath } from 'react-native-fs';
import { Platform } from 'react-native';
import { insertEditionDownloadInDb, removeEditionDownloadFromDb, insertEditionFavoriteInDb, removeEditionFavoriteFromDb } from '../util/Queries';
import H5mag from '@h5mag/react-native-h5mag';

export default function EditionMenu(props) {
	const { navigation, route, edition, projectDomain, onChangeFavorite, onChangeDownloaded, inNavigation } = props;

	const targetPath = (Platform.OS === 'android' ? DocumentDirectoryPath : MainBundlePath) + '/' + projectDomain + edition.path;
	const charset = 'UTF-8';

	const [downloading, setDownloading] = useState(false);
	const [downloadProgress, setDownloadProgress] = useState(0);

	useEffect(() => {
		RNFS.exists(targetPath).then((exists) => {
			if (exists) { setDownloadProgress(100); }
		});
	}, []);

	/**
	 * Downloads the selected edition and inserts relevant data into the database.
	 * @returns stops if already downloading.
	 */
	const startEditionDownload = () => {
		if (downloading) { return; }

		setDownloading(true);

		H5mag.downloadEdition(targetPath, charset, edition.path, projectDomain).then((result) => {
			if (result === 'downloaded') {
				insertEditionDownloadInDb(edition, projectDomain).then(() => {
					onChangeDownloaded(edition);
				});

				setDownloading(false);
				setDownloadProgress(100);
			}
		}).catch((err) => {
			console.log(err);

			setDownloading(false);
			setDownloadProgress(100);
		});
	};

	/**
	 * Deletes the selected edition.
	 */
	const startEditionDelete = () => {
		H5mag.deleteEdition(targetPath).then((result) => {
			if (result === 'deleted') {
				removeEditionDownloadFromDb(edition, projectDomain).then(() => {
					onChangeDownloaded(edition);
				});
				setDownloadProgress(0);
			}
		});
	};

	/**
	 * Navigate to ../screens/Downloads
	 */
	const goToDownloads = () => {
		if (route.name !== 'Downloads') {
			navigation.navigate('DownloadsTab');
		} else {
			navigation.navigate('Downloads');
		}
	};

	/**
	 * (un)favorites the selected edition.
	 */
	const favoriteEdition = () => {
		if (edition.favorite) {
			removeEditionFavoriteFromDb(edition, projectDomain).then(() => {
				onChangeFavorite(edition);
			});
		} else {
			insertEditionFavoriteInDb(edition, projectDomain).then(() => {
				onChangeFavorite(edition);
			});
		}
	};

	const menuActions = () => {
		let actions = [];

		if (edition.downloaded) {
			actions.push({
				id: 'delete',
				title: 'Remove download',
				attributes: {
					destructive: true,
				},
				image: Platform.select({
					ios: 'trash',
					android: 'ic_menu_delete',
				}),
			});
			if (route?.name !== 'Downloads' && route?.name !== 'Offline') {
				actions.push({
					id: 'openDownloads',
					title: 'Go to downloads',
					image: Platform.select({
						ios: 'arrow.right',
						android: 'arrow-right',
					}),
				});
			}
		} else {
			if (Platform.OS === 'ios') {
				actions.push({
					id: 'download',
					title: downloading ? 'Downloading...' : 'Download',
					titleColor: sv.black,
					subtitle: 'Download',
					image: Platform.select({
						ios: 'arrow.down',
						android: 'arrow-down',
					}),
					imageColor: sv.primaryColor,
					attributes: {
						disabled: downloading,
					},
				});
			} else {
				actions.push({
					id: 'download',
					title: downloading ? 'Downloading...' : 'Download',
					titleColor: sv.black,
					subtitle: 'Download',
					image: Platform.select({
						ios: 'arrow.down',
						android: 'arrow-down',
					}),
					imageColor: sv.primaryColor,
				});
			}
		}

		actions.push({
			id: 'favorite',
			title: edition.favorite ? 'Unfavorite' : 'Favorite',
			titleColor: sv.black,
			subtitle: 'Save to favorites',
			image: Platform.select({
				ios: edition.favorite ? 'heart.fill' : 'heart',
				android: 'heart', //TODO: does not work yet
			}),
			imageColor: sv.primaryColor,
		});

		return actions;
	};

	return (
		<MenuView
			title="Options"
			onPressAction={({ nativeEvent }) => {
				switch (nativeEvent.event) {
					case 'download':
						startEditionDownload();
						break;
					case 'delete':
						startEditionDelete();
						break;
					case 'openDownloads':
						goToDownloads();
						break;
					case 'favorite':
						favoriteEdition();
						break;
					default:
						break;
				}
			}}
			actions={menuActions()}
			shouldOpenOnLongPress={false}
		>
			<Icon.Button
				name={'menu-outline'}
				color={inNavigation ? sv.white : sv.primaryColor}
				size={25}
				backgroundColor={'transparent'}
				style={styles.iconButton}
				iconStyle={styles.mr0}
			/>
		</MenuView >
	);
}
