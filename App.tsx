import React, { useEffect, useState } from 'react';
import { PermissionsAndroid } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import MapScreen from './screens/MapScreen';
import auth from '@react-native-firebase/auth';

const Stack = createStackNavigator()

const App: React.FC = () => {
  const [initializing, setInitializing] = useState(true)
  const [user, setUser] = useState<any>()

  const requestPermissions = async () => {
    try {
      const fineLocationPermission = PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION;
      const fineLocationGranted = await PermissionsAndroid.request(fineLocationPermission);
      const coarseLocationPermission = PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION;
      const coarseLocationGranted = await PermissionsAndroid.request(coarseLocationPermission);
      const backgroundLocationPermission = PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION;
      const backgroundLocationGranted = await PermissionsAndroid.request(backgroundLocationPermission);
    
      if (
        fineLocationGranted === PermissionsAndroid.RESULTS.GRANTED &&
        coarseLocationGranted === PermissionsAndroid.RESULTS.GRANTED &&
        backgroundLocationGranted === PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('All permissions granted');
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    requestPermissions();
  }, []);

  const onAuthStateChanged = (user: any) => {
    setUser(user)
    if (initializing) setInitializing(false)
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged)
    return subscriber
  }, [])

  if (initializing) return null

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Map" component={MapScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App;
