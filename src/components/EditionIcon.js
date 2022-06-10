import Icon from 'react-native-vector-icons/Ionicons'; Icon.loadFont();
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import styles from '../css/style';
import sv from '../css/variables';
import { useQuery } from 'react-query';

export default function EditionIcon(props) {
    const { item } = props;
    const { data: editionStatus } = useQuery(['editions.status', item.href], () => {});

    if (editionStatus === 'downloading') { return <ActivityIndicator />; }
    if (editionStatus === 'failed' || item.status === 'failed') { return <Icon name={'alert-circle-outline'} size={sv.m2} color={sv.primaryColor} iconStyle={styles.mr0} />; }
    if (editionStatus === 'downloaded' || item.downloaded === 1 || item.downloaded === true) { return <Icon name={'cloud-done-outline'} size={sv.m2} color={sv.primaryColor} iconStyle={styles.mr0} />; }

    return <View style={{ width: 18 }} />;
}
