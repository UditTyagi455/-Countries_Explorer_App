import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { ThemeContext } from '../../../App';

function CountryList({ navigation }) {
  const [countries, setCountries] = useState([]);
  const [favCountries, setFavCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  function useTheme() {
    return useContext(ThemeContext);
  }

  const { theme, toggleTheme, isDark } = useTheme();

  const fetchCountries = () => {
    setLoading(true);
    fetch(
      'https://restcountries.com/v3.1/all?fields=name,flags,region,population,languages,currencies,timezones',
    )
      .then(res => res.json())
      .then(data => {
        setCountries(data);
        setFilteredCountries(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch countries.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCountries();
  }, []);
  useEffect(() => {
    async function fetchFavCountry() {
      const favCountry = await AsyncStorage.getItem('favCountry');
      console.log(`Favorite country: ${favCountry}`);
      if (favCountry) {
        const parsedFavCountries = JSON.parse(favCountry);
        setFavCountries([...parsedFavCountries]);
      }
    }

    fetchFavCountry();
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = countries.filter(c => {
      const matchName = c.name.common.toLowerCase().includes(query);
      const matchRegion =
        selectedRegion === 'All' || c.region === selectedRegion;
      return matchName && matchRegion;
    });
    setFilteredCountries(filtered);
  }, [searchQuery, selectedRegion]);

  async function clickOnFav(countryName) {
    console.log(`Clicked on favorite for ${countryName}`);
    let arr = [];
    // const favCountry = await AsyncStorage.getItem('favCountry');
    const favCountry = favCountries;
    console.log('Current favorite countries:', favCountry);

    if (favCountry) {
      arr = favCountry;
      if (arr.includes(countryName)) {
        arr = arr.filter(item => item !== countryName);
      } else {
        arr.push(countryName);
      }
    } else {
      arr.push(countryName);
    }

    const storeValue = JSON.stringify(arr);
    setFavCountries([...arr]);
    console.log(`Storing favorite countries: ${storeValue}`);
    AsyncStorage.setItem('favCountry', storeValue);
  }

  if (loading) return <ActivityIndicator size="large" style={styles.loader} />;
  if (error)
    return (
      <View style={styles.errorContainer}>
        <Text>{error}</Text>
        <Text onPress={fetchCountries} style={styles.retry}>
          Tap to retry
        </Text>
      </View>
    );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <TouchableOpacity onPress={toggleTheme} style={styles.toggleBtn}>
        <Text style={{ color: theme.text }}>
          {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </Text>
      </TouchableOpacity>
      <View style={styles.filters}>
        {['All', 'Africa', 'Americas', 'Asia', 'Europe', 'Oceania'].map(
          region => (
            <Text
              key={region}
              onPress={() => setSelectedRegion(region)}
              style={[
                styles.filterButton,
                {
                  backgroundColor:
                    selectedRegion === region
                      ? theme.activeButtonBg
                      : theme.buttonBg,
                  color:
                    selectedRegion === region
                      ? theme.activeButtonText
                      : theme.buttonText,
                },
              ]}
            >
              {region}
            </Text>
          ),
        )}
      </View>

      <TextInput
        placeholder="Search country..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={[
          styles.input,
          {
            backgroundColor: theme.inputBg,
            borderColor: theme.borderColor,
            color: theme.text,
          },
        ]}
      />

      <FlatList
        data={filteredCountries}
        keyExtractor={item => item.name.common}
        renderItem={({ item }) => (
          <View style={styles.countryCard}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Details', { country: item })}
              style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
            >
              <Image source={{ uri: item.flags.png }} style={styles.flag} />
              <View>
                <Text style={[styles.name, { color: theme.text }]}>
                  {item.name.common}
                </Text>
                <Text style={[styles.region, { color: theme.text }]}>
                  {item.region}
                </Text>
              </View>
            </TouchableOpacity>
            <View>
              {!favCountries.includes(item.name.common) ? (
                <TouchableOpacity onPress={() => clickOnFav(item.name.common)}>
                   <Image
                    source={{
                      uri: 'https://cdn-icons-png.flaticon.com/512/18/18611.png',
                    }}
                    style={{ width: 20, height: 20, backgroundColor: "white" }}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => clickOnFav(item.name.common)}>
                  <Image
                    source={{
                      uri: 'https://cdn-icons-png.flaticon.com/512/17/17015.png',
                    }}
                    style={{ width: 20, height: 20, backgroundColor: "white" }}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
}

export default CountryList;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  retry: {
    marginTop: 10,
    color: 'blue',
    textDecorationLine: 'underline',
  },
  countryCard: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  flag: {
    width: 50,
    height: 30,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  region: {
    fontSize: 14,
    color: 'gray',
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  filterButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#eee',
    borderRadius: 16,
    fontSize: 14,
    marginRight: 6,
  },
  activeFilterButton: {
    backgroundColor: '#007AFF',
    color: 'white',
  },
  detailsContainer: {
    flex: 1,
    padding: 16,
  },
  detailsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  detailsFlag: {
    width: 200,
    height: 120,
    marginBottom: 16,
  },
  toggleBtn: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
});
