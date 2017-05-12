import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    marginTop: 28,
    flex: 1
  },
  headerText: {
    fontSize: 20,
    marginBottom: 10,
  },
  ruleText: {
    marginBottom: 10
  },
  exampleViewContainer: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'lightgray',
    paddingHorizontal: 5
  },
  exampleTextHeaderText: {
    fontSize: 18
  },
  exampleBodyText: {
    marginTop: 5,
    fontSize: 13,
    borderTopWidth: 1
  },
  copyRightText: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '500',
    color: 'gray'
  }
});

export default styles;
