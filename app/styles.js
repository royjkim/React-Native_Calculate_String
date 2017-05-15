import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    marginTop: 28,
    flex: 1
  },
  headerText: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center'
  },
  ruleContainer: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'lightgray',
    paddingHorizontal: 5,
    marginBottom: 5,
  },
  ruleHeaderText: {
    marginBottom: 5,
    fontSize: 18,
  },
  ruleBodyText: {
    fontSize: 14,
    marginLeft: 10
  },
  exampleViewContainer: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'lightgray',
    paddingHorizontal: 5,
    marginBottom: 5,
  },
  exampleHeaderText: {
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
  },
  eachHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  firstInstruction: {
    color: 'gray'
  },
  fabBtnStyle: {
    // backgroundColor: '#86939D'
    // backgroundColor: 'red'
    backgroundColor: 'red'
  },
  fabTwoDepthBtnStyle: {
    color: 'blue'
  },
  variableListText: {
    fontSize: 18
  },
  instructionParentViewContainer: {
    flexDirection: 'row'
  },
  instructionViewContainer: {
    flex: 1,
    // flexDirection: 'row',
    alignItems: 'center',
  }
});

export default styles;
