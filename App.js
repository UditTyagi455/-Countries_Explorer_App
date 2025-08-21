import React, { createContext, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CountryDetail from './src/component/CountryDetail';
import CountryList from './src/component/CountryList';

const Stack = createNativeStackNavigator();
export const ThemeContext = createContext();

const lightTheme = {
  background: '#ffffff',
  text: '#000000',
  inputBg: '#f0f0f0',
  borderColor: '#ccc',
  buttonBg: '#eee',
  buttonText: '#000',
  activeButtonBg: '#007AFF',
  activeButtonText: '#fff',
};
const darkTheme = {
  background: '#121212',
  text: '#ffffff',
  inputBg: '#1e1e1e',
  borderColor: '#555',
  buttonBg: '#333',
  buttonText: '#fff',
  activeButtonBg: '#007AFF',
  activeButtonText: '#fff',
};

function useTheme() {
  return useContext(ThemeContext);
}

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = () => setIsDark(prev => !prev);
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Countries" component={CountryList} />
          <Stack.Screen name="Details" component={CountryDetail} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeContext.Provider>
  );
}
