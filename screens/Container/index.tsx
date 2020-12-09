import React, {useContext, useEffect, useState} from 'react';
import {View, Image} from 'react-native';
import {useRecoilState} from 'recoil';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import {walletsAtom} from '../../atoms/wallets';
import HomeScreen from '../Home';
import NewsScreen from '../News';
import TransactionStackScreen from '../../TransactionStack';
import {getWallets} from '../../utils/local';
import {styles} from './style';
import NoWalletStackScreen from '../../NoWalletStack';
import {createStackNavigator} from '@react-navigation/stack';
import Notification from '../Notification';
import {ThemeContext} from '../../App';
import {getBalance} from '../../services/account';
import {tokenInfoAtom} from '../../atoms/token';
import {getTokenInfo} from '../../services/token';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const Wrap = () => {
  const theme = useContext(ThemeContext);
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size}) => {
          let iconName = '';

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'News') {
            iconName = 'newspaper-o';
          } else if (route.name === 'Transaction') {
            iconName = 'exchange';
          } else if (route.name === 'DApp') {
            iconName = 'th-large';
          }

          // You can return any component that you like here!
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: theme.primaryTextColor,
        inactiveTintColor: '#7A859A',
        inactiveBackgroundColor: theme.backgroundColor,
        activeBackgroundColor: theme.backgroundColor,
        keyboardHidesTabBar: true,
        tabStyle: {
          backgroundColor: theme.backgroundFocusColor,
          borderTopColor: theme.backgroundFocusColor,
        },
        labelStyle: {
          fontWeight: 'bold',
        },
        style: {
          backgroundColor: theme.backgroundFocusColor,
          borderTopColor: theme.backgroundFocusColor,
        },
        showLabel: false,
      }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Transaction" component={TransactionStackScreen} />
      {/* <Tab.Screen name="DApp" component={DAppScreen} /> */}
      <Tab.Screen name="News" component={NewsScreen} />
    </Tab.Navigator>
  );
};

const AppContainer = () => {
  const [wallets, setWallets] = useRecoilState(walletsAtom);
  const [, setTokenInfo] = useRecoilState(tokenInfoAtom);
  const [inited, setInited] = useState(0);

  const theme = useContext(ThemeContext);

  useEffect(() => {
    (async () => {
      let localWallets = await getWallets();

      const promiseArr = localWallets.map(async (wallet) => {
        wallet.balance = await getBalance(wallet.address);
        return wallet;
      });

      localWallets = await Promise.all(promiseArr);

      setWallets(localWallets);

      // Get token info
      const info = await getTokenInfo();
      setTokenInfo(info);

      setInited(1);
    })();
  }, [setWallets, setTokenInfo]);

  if (!inited) {
    return (
      <View style={styles.splashContainer}>
        <Image
          style={styles.splashLogo}
          source={require('../../assets/kardia-logo-full-white.png')}
        />
      </View>
    );
  }

  if (wallets.length === 0) {
    return (
      <NavigationContainer>
        <NoWalletStackScreen />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{headerShown: false}}
          name="Wrap"
          component={Wrap}
        />
        <Stack.Screen
          name="Notification"
          component={Notification}
          options={{
            headerStyle: {
              backgroundColor: theme.backgroundColor,
            },
            headerTitleStyle: {
              color: theme.textColor,
            },
            headerTintColor: theme.textColor,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppContainer;
