import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

// Country List Screen (your existing screen)
function CountryListScreen({ navigation }) {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCountries = () => {
    setLoading(true);
    fetch('https://restcountries.com/v3.1/all?fields=name,flags,region,population,languages,currencies,timezones')
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
    const query = searchQuery.toLowerCase();
    const filtered = countries.filter(c => {
      const matchName = c.name.common.toLowerCase().includes(query);
      const matchRegion = selectedRegion === 'All' || c.region === selectedRegion;
      return matchName && matchRegion;
    });
    setFilteredCountries(filtered);
  }, [searchQuery, selectedRegion]);

  if (loading) return <ActivityIndicator size="large" style={styles.loader} />;
  if (error) return (
    <View style={styles.errorContainer}>
      <Text>{error}</Text>
      <Text onPress={fetchCountries} style={styles.retry}>Tap to retry</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Region filter buttons */}
      <View style={styles.filters}>
        {['All', 'Africa', 'Americas', 'Asia', 'Europe', 'Oceania'].map(region => (
          <Text
            key={region}
            onPress={() => setSelectedRegion(region)}
            style={[
              styles.filterButton,
              selectedRegion === region && styles.activeFilterButton
            ]}
          >
            {region}
          </Text>
        ))}
      </View>

      <TextInput
        placeholder="Search country"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.input}
      />

      <FlatList
        data={filteredCountries}
        keyExtractor={item => item.name.common}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.countryCard}
            onPress={() => navigation.navigate('Details', { country: item })}
          >
            <Image source={{ uri: item.flags.png }} style={styles.flag} />
            <View>
              <Text style={styles.name}>{item.name.common}</Text>
              <Text style={styles.region}>{item.region}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

// Details Screen
function DetailsScreen({ route }) {
  const { country } = route.params;

  // Convert languages and currencies objects to readable strings
  const languages = country.languages ? Object.values(country.languages).join(', ') : 'N/A';
  const currencies = country.currencies
    ? Object.values(country.currencies)
        .map(c => c.name + ` (${c.symbol || ''})`)
        .join(', ')
    : 'N/A';

  return (
    <View style={styles.detailsContainer}>
      <Text style={styles.detailsTitle}>{country.name.common}</Text>
      <Image source={{ uri: country.flags.png }} style={styles.detailsFlag} />
      <Text>Region: {country.region}</Text>
      <Text>Population: {country.population.toLocaleString()}</Text>
      <Text>Languages: {languages}</Text>
      <Text>Currencies: {currencies}</Text>
      <Text>Timezones:</Text>
      {country.timezones.map(tz => (
        <Text key={tz}>- {tz}</Text>
      ))}
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Countries" component={CountryListScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Styles (add all your previous styles here + new ones)
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
});
