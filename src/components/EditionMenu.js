import Icon from 'react-native-vector-icons/Ionicons'; Icon.loadFont();
import React from 'react';
import { MenuView } from '@react-native-menu/menu';
import styles from '../css/style';
import sv from '../css/variables';
import { MainBundlePath, DocumentDirectoryPath } from 'react-native-fs';
import { Platform } from 'react-native';
import DbQuery from '../util/Queries';
import H5mag from '@h5mag/react-native-h5mag';
import { useQuery } from 'react-query';

export default function EditionMenu(props) {
	const { navigation, route, edition, projectDomain, onChangeFavorite, onChangeDownloaded, inNavigation } = props;

	const targetPath = (Platform.OS === 'android' ? DocumentDirectoryPath : MainBundlePath) + '/' + projectDomain + edition.path;
	const charset = 'UTF-8';

	const { data: themeTextColorInline } = useQuery('colorScheme.textColorInline');
	const { data: editionStatus } = useQuery(['editions.status', edition.href], () => { });
	const { data: editionFavorite } = useQuery(['editions.favorite', edition.href], () => { });

	// const [downloadProgress, setDownloadProgress] = useState(0);

	/**
	 * Downloads the selected edition and inserts relevant data into the database.
	 * @returns stops if already downloading.
	 */
	const startEditionDownload = () => {
		if (editionStatus === 'downloading') { return; }

		DbQuery.insertEditionDownloadInDb(edition, projectDomain, 'downloading').then((result) => {
			onChangeDownloaded(result);
		});

		H5mag.downloadEdition(targetPath, charset, edition.path, projectDomain).then((result) => {
			if (result === 'downloaded') {
				DbQuery.findOneEditionInDb(edition).then((editionFromDb) => {
					DbQuery.insertEditionDownloadInDb(editionFromDb, projectDomain, 'downloaded').then((res) => {
						onChangeDownloaded(res);
						// setDownloadProgress(100);
					});
				});
			}
		}).catch((err) => {
			console.log(err);

			DbQuery.findOneEditionInDb(edition).then((editionFromDb) => {
				if (editionFromDb) {
					DbQuery.insertEditionDownloadInDb(editionFromDb, projectDomain, 'failed').then((res) => {
						onChangeDownloaded(res);
						// setDownloadProgress(100);
					});
				}
			});
		});
	};

	/**
	 * Deletes the selected edition.
	 */
	const startEditionDelete = () => {
		H5mag.deleteEdition(targetPath).then((result) => {
			if (result === 'deleted') {
				DbQuery.insertEditionDownloadInDb(edition, projectDomain, 'deleted').then((res) => {
					onChangeDownloaded(res);
					// setDownloadProgress(0);
				});
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
		if (editionFavorite || edition.favorite) {
			DbQuery.insertEditionFavoriteInDb(edition, projectDomain, false).then((res) => {
				onChangeFavorite(res);
			});
		} else {
			DbQuery.insertEditionFavoriteInDb(edition, projectDomain, true).then((res) => {
				onChangeFavorite(res);
			});
		}
	};

	const menuActions = () => {
		let actions = [];

		if (editionStatus === 'downloaded' || edition.downloaded) {
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
					title: (edition.status === 'failed' && 'Retry download' || (editionStatus === 'downloading' ? 'Downloading...' : 'Download')),
					titleColor: themeTextColorInline,
					subtitle: 'Download',
					image: Platform.select({
						ios: 'arrow.down',
						android: 'arrow-down',
					}),
					imageColor: sv.primaryColor,
					attributes: {
						disabled: editionStatus === 'downloading',
					},
				});
			} else {
				actions.push({
					id: 'download',
					title: (edition.status === 'failed' && 'Retry download' || (editionStatus === 'downloading' ? 'Downloading...' : 'Download')),
					titleColor: themeTextColorInline,
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
			title: (editionFavorite || edition.favorite) ? 'Unfavorite' : 'Favorite',
			titleColor: themeTextColorInline,
			subtitle: 'Save to favorites',
			image: Platform.select({
				ios: (editionFavorite || edition.favorite) ? 'heart.fill' : 'heart',
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
