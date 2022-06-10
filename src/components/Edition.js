import Icon from 'react-native-vector-icons/Ionicons'; Icon.loadFont();
import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import styles from '../css/style';
import sv from '../css/variables';
import EditionMenu from '../components/EditionMenu';
import EditionIcon from '../components/EditionIcon';
import { goToEdition } from '../util/Editions';

export default function Editions(props) {
    const { item, projectDomain, navigation, onChangeEdition, onChangeDownloaded, onChangeFavorite, route } = props;

    const editionDescription = (edition) => {
        if (route.name === 'DownloadsTab') {
            return (
                <Pressable onPress={() => navigation.navigate('Editions', { projectDomain: edition.projectDomain })}>
                    <Text>In {edition.projectDomain} <Icon name={'chevron-forward'} size={12} color={sv.primaryColor} /></Text>
                </Pressable>
            );
        }

        if (edition?.description?.length > 0) {
            <Text>{edition.description}</Text>;
        }
    };

    return (
        <View style={styles.editionBlock}>
            <Pressable onPress={() => goToEdition(item, projectDomain, navigation)} style={[styles.flexRowContainer, styles.spaceBetween, styles.alignCenter]}>
                <Image source={{ uri: item.screenshot_src }} style={styles.editionPhotoSmall} />

                <EditionIcon item={item} />

                <View style={styles.editionBlockDescription}>
                    <Text style={styles.editionTitle}>
                        {item.title}
                    </Text>
                    {editionDescription(item)}
                </View>

                <EditionMenu edition={item} projectDomain={projectDomain} navigation={navigation} route={route} onChangeEdition={onChangeEdition} onChangeFavorite={onChangeFavorite} onChangeDownloaded={onChangeDownloaded} />
            </Pressable>
        </View>
    );
}
