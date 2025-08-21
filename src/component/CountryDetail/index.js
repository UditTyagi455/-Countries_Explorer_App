import { View, Text, Image, StyleSheet} from 'react-native';


function CountryDetail({ route }) {
  const { country } = route.params;

  const languages = country.languages
    ? Object.values(country.languages).join(', ')
    : 'N/A';
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

export default CountryDetail;


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