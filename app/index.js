import React from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import styles from './styles'

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      strNewInputedText: '',
      strInputText: '',
      arrSplittedText: [],
      arrCalculatedText: [],
      numTotalResult: 0,
      numTempPrevResult: 0,
      objVariableSet: {},
      boolCalculateStatus: false,
      ruleVisible: true,
      exampleVisible: false,
      variableListVisible: true
    };
    this.fnArithmeticOperationMapper = {
      '+': (...args) => args.reduce(function(val1, val2) { return val1 + val2 }),
      '-': (...args) => args.reduce(function(val1, val2) { return val1 - val2 }),
      '*': (...args) => args.reduce(function(val1, val2) { return val1 * val2 }),
      '/': (...args) => args.reduce(function(val1, val2) { return val1 / val2 })
      // '+': (val1, val2) => val1 + val2,
      // '-': (val1, val2) => val1 - val2,
      // '*': (val1, val2) => val1 * val2,
      // '/': (val1, val2) => val1 / val2
      // '더하기': (val1, val2) => val1 + val2,
      // '빼기': (val1, val2) => val1 - val2,
      // '곱하기': (val1, val2) => val1 * val2,
      // '나누기': (val1, val2) => val1 / val2
    };
    this.fnSubmit = this.fnSubmit.bind(this);
    this.fnCalculate = this.fnCalculate.bind(this);
    this.extractNumsReg = /([0-9]+)/gm;
    this.splitReg = /([\s])/gm;
    this.matchReg = /([a-zA-Z0-9]+)|([0-9]+)|([*+\-/=])/gm;
    this.boolFirstInstruction = true;
    console.disableYellowBox = true;
  };

  fnFocus() {
    this.refs['_textarea'].focus();
  };
  fnSubmit() {
    this.state.strInputText === '' ? alert('input text please') : this.fnCalculate();
  };
  fnCalculate() {
    this.setState(prevState => {
      prevState.arrCalculatedText = [];
      prevState.objVariableSet = {};
      prevState.numTotalResult = 0;
      prevState.numTempPrevResult = 0;
      prevState.boolCalculateStatus = false;
      prevState.arrSplittedText = prevState.strInputText.match(this.matchReg);
      prevState.arrSplittedText.map((value, index) => {
        // Exception handling, continuous type error arithmetic operations.
        /([*+-/=])/.test(value) && /([*+-/=])/.test(prevState.arrSplittedText[index+1]) && (
          prevState.arrSplittedText.splice(index+1, 1)
        );
      });
      prevState.arrSplittedText.map((value, index) => {
        const prevValueFromArrSplittedText = prevState.arrSplittedText[index - 1] || null,
              nextValueFromArrSplittedText = prevState.arrSplittedText[index + 1] || null;
        let numLeftValue, numRightValue, strArithmetic;

        // Belew is for assignment.
        value === '=' && !/([*+-/])/.test(prevState.arrSplittedText[index - 2]) && nextValueFromArrSplittedText && (
          prevState.objVariableSet.hasOwnProperty(prevValueFromArrSplittedText) || (prevState.objVariableSet[prevValueFromArrSplittedText] = 0),
          prevState.objVariableSet[prevValueFromArrSplittedText] = isNaN(nextValueFromArrSplittedText) ? prevState.objVariableSet.hasOwnProperty(nextValueFromArrSplittedText) ? prevState.objVariableSet[nextValueFromArrSplittedText] : 0 : parseFloat(nextValueFromArrSplittedText.match(this.extractNumsReg) || 0),
          prevState.numTempPrevResult = 0,
          prevState.arrCalculatedText.push(prevValueFromArrSplittedText, ' = ', prevState.objVariableSet[prevValueFromArrSplittedText], '\n')
        );

        // Below is for caculation.
        if(/([*+-/])/.test(value)) {
            // Two variables for calculate.
            numLeftValue = isNaN(prevValueFromArrSplittedText)
              ? parseFloat(prevState.objVariableSet.hasOwnProperty(prevValueFromArrSplittedText) ? prevState.objVariableSet[prevValueFromArrSplittedText] : 0)
              : parseFloat(prevValueFromArrSplittedText);
            strArithmetic = value;
            numRightValue = isNaN(nextValueFromArrSplittedText)
              ? parseFloat(prevState.objVariableSet.hasOwnProperty(nextValueFromArrSplittedText) ? prevState.objVariableSet[nextValueFromArrSplittedText] : 0)
              : parseFloat(nextValueFromArrSplittedText);

            // Below is for normal add process.
            prevState.arrCalculatedText.push(prevValueFromArrSplittedText, ' ', strArithmetic, ' ', nextValueFromArrSplittedText);

            // Below is for continuous arithmetic operations.
            if(/([*+-/])/.test(prevState.arrSplittedText[index+2])) {
              // Below is for prevent duplicate push()
              prevState.arrCalculatedText.pop();
              const tempResult = this.fnArithmeticOperationMapper.hasOwnProperty(strArithmetic) ? this.fnArithmeticOperationMapper[strArithmetic](prevState.boolCalculateStatus ? prevState.numTempPrevResult : numLeftValue, numRightValue) : 0;
              prevState.numCalResult = tempResult;
              // prevState.numCalResult = this.fnArithmeticOperationMapper[strArithmetic](prevState.boolCalculateStatus ? prevState.numTempPrevResult : numLeftValue, numRightValue);
              prevState.numTempPrevResult = prevState.numCalResult;
              prevState.boolCalculateStatus = true;
            } else if(prevState.arrSplittedText[index+2] === '=') {
              const tempResult = this.fnArithmeticOperationMapper.hasOwnProperty(strArithmetic) ? this.fnArithmeticOperationMapper[strArithmetic](prevState.boolCalculateStatus ? prevState.numTempPrevResult : numLeftValue, numRightValue) : 0;
              prevState.arrCalculatedText.push(' = ', tempResult, '\n');
              // prevState.arrCalculatedText.push(' = ', this.fnArithmeticOperationMapper[strArithmetic](prevState.boolCalculateStatus ? prevState.numTempPrevResult : numLeftValue, numRightValue), '\n');
              prevState.numTempPrevResult = 0;
              prevState.boolCalculateStatus = false;
            };
        }
      });
      prevState.strInputText = '';
      prevState.arrCalculatedText.map(value => prevState.strInputText += value);
    });
    setTimeout(() => this.refs['_textarea'].setNativeProps({ text: this.state.strInputText }), 0);
    Keyboard.dismiss();
  }

  componentDidMount() {
    const fnInitializedFinished = () => {
      this.boolFirstInstruction = false;
      this.refs['_textarea'].focus();
    };
    setTimeout(() => this.setState({ ruleVisible: false }, fnInitializedFinished()), 5000);
  }
  render() {
    return(
      <View
        style={styles.container}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'center'
            }}
          >
            <Text
              style={styles.headerText}
            >
              String Calculate
            </Text>
          </View>
          <View
            style={{
              flex: 0,
              justifyContent: 'flex-end'
            }}
          >
            <Text
              style={styles.copyRightText}
            >
              by Roy
            </Text>
          </View>

        </View>

        <View
          style={styles.ruleContainer}
        >
          <TouchableOpacity
            onPress={() => this.setState({ ruleVisible: !this.state.ruleVisible })}
          >
            {this.state.ruleVisible ? (
              <View>
                <View
                  style={styles.eachHeaderContainer}
                >
                  <Text
                    style={styles.ruleHeaderText}
                  >
                    Rules
                  </Text>
                  <Text
                    style={[styles.ruleBodyText, { color: 'gray' }]}
                  >
                    (click to hide)
                  </Text>
                </View>
                <Text
                  style={styles.ruleBodyText}
                >
                  1. allow arithmetic operations : +, -, *, /
                  {'\n'}
                  2. calculate order : from left(not allowed : bracket)
                  {/* 2. calculate order : from left(not allowed : bracket, order of operations) */}
                  {'\n'}
                  3. space not allowed in the variable name.
                  {'\n'}
                  4. each expression should be end with ','.
                  {'\n'}
                  5. support language is english only.
                </Text>
              </View>
              ) : (
                <View
                  style={styles.eachHeaderContainer}
                >
                  <Text
                    style={styles.ruleHeaderText}
                  >
                    Rules
                  </Text>
                  <Text
                    style={[styles.ruleBodyText, { color: 'gray' }]}
                  >
                    (click to show)
                  </Text>
                </View>
              )}
          </TouchableOpacity>
          </View>
        <View
          style={styles.exampleViewContainer}
        >
          <TouchableOpacity
            onPress={() => this.setState({ exampleVisible: !this.state.exampleVisible })}
          >
            {this.state.exampleVisible ? (
              <View>
                <View
                  style={styles.eachHeaderContainer}
                >
                  <Text
                    style={styles.exampleHeaderText}
                  >
                    Examples
                  </Text>
                  <Text
                    style={[styles.ruleBodyText, { color: 'gray' }]}
                  >
                    (click to hide)
                  </Text>
                </View>
                <Text
                  style={styles.exampleBodyText}
                >
                  coke=100,
                  {'\n'}
                  sprite=200,
                  {'\n'}
                  coke + sprite = (press 'run Calculate')
                </Text>
              </View>
            ) : (
              <View>
                <View
                  style={styles.eachHeaderContainer}
                >
                  <Text
                    style={styles.exampleHeaderText}
                  >
                    Examples
                  </Text>
                  <Text
                    style={[styles.ruleBodyText, { color: 'gray' }]}
                  >
                    (click to show)
                  </Text>
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View
          style={styles.exampleViewContainer}
        >
          <TouchableOpacity
            onPress={() => this.setState({ variableListVisible: !this.state.variableListVisible })}
          >
            {this.state.variableListVisible ? (
              <View>
                <View
                  style={styles.eachHeaderContainer}
                  >
                  <Text
                    style={styles.exampleHeaderText}
                  >
                    Variables({Object.keys(this.state.objVariableSet).length})
                  </Text>
                  <Text
                    style={[styles.ruleBodyText, { color: 'gray' }]}
                  >
                    (click to hide)
                  </Text>
                </View>
              </View>
            ) : (
              <View
                style={styles.eachHeaderContainer}
                >
                <Text
                  style={styles.exampleHeaderText}
                >
                  Variable List
                </Text>
                <Text
                  style={[styles.ruleBodyText, { color: 'gray' }]}
                >
                  (click to show)
                </Text>
              </View>
            )}
          </TouchableOpacity>
          {this.state.variableListVisible && (
            <ScrollView
              style={{
                maxHeight: 80,
                marginTop: Object.keys(this.state.objVariableSet).length > 0 ? 5 : 0,
              }}
            >
              {Object.keys(this.state.objVariableSet).map(value => (<Text
                    key={value}
                  >
                    {value}: {this.state.objVariableSet[value]}
                  </Text>)
              )}
            </ScrollView>
          )}
        </View>
        <KeyboardAvoidingView
          behavior='padding'
        >
          <TextInput
            ref='_textarea'
            style={{
              height: 150,
              borderWidth: 1,
              borderRadius: 5,
              borderColor: 'lightgray',
              padding: 10,
              fontSize: 13,
              maxLength: 10,
            }}
            multiline={true}
            autoCapitalize={'none'}
            placeholder='input what you want to calculate'
            onChangeText={strInputText => this.setState({ strInputText })}
          />
        </KeyboardAvoidingView>
        <Button
          title='Run Calculate'
          onPress={this.fnSubmit}
        />
        <Button
          title='Clear'
          onPress={() => {
            Alert.alert(
              'Warning',
              'All data would be deleted. This can\'t be restored.',
              [
                { text: 'Cancel', onPress: () => this.fnFocus() },
                { text: 'OK', onPress: () => {
                  this.refs['_textarea'].setNativeProps({ text: '' });
                  this.setState({
                    strNewInputedText: '',
                    strInputText: '',
                    arrSplittedText: [],
                    arrCalculatedText: [],
                    numTotalResult: 0,
                    numTempPrevResult: 0,
                    objVariableSet: {},
                    boolCalculateStatus: false
                  });
                }}
              ]
            )

          }}
        />
        {this.boolFirstInstruction && <Text
          style={styles.firstInstruction}
          >
          * Rules would be hide automatically in 5 seconds.
        </Text>}
      </View>
    )
  }
}
