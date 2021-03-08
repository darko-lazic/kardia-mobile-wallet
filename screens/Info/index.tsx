import React, {useContext} from 'react';
import {Text, View} from 'react-native';
import List from '../../components/List';
import {ThemeContext} from '../../ThemeContext';
import {styles} from './style';

const INFO_DATA = [
  {
    label: 'Version',
    value: '1.0.21',
  },
];

const Info = () => {
  const theme = useContext(ThemeContext);
  return (
    <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      <List
        items={INFO_DATA}
        render={(item) => {
          return (
            <View style={styles.settingItem}>
              <Text style={[styles.settingItemTitle, {color: theme.textColor}]}>
                {item.label}
              </Text>
              <Text style={[styles.settingItemTitle, {color: theme.textColor}]}>
                {item.value}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
};

export default Info;
