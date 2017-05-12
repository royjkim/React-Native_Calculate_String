import React from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
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
      boolCalculateStatus: false
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
    this.matchReg = /([a-zA-Z0-9]+)|([0-9]+)|([*+-/=])/gm;
    this.strInputText = '';
  };
  fnSubmit() {
    // this.state.strInputText === '' ? alert('input text please') : this.fnCalculate();
    this.strInputText === '' ? alert('input text please') : this.fnCalculate();

  };
  // onChangeFn(event) {
  //   this.setState({
  //     strInputText: event.target.value
  //   });
  // };
  fnCalculate() {
    this.setState(prevState => {
      prevState.arrCalculatedText = [];
      prevState.objVariableSet = {};
      prevState.numTotalResult = 0;
      prevState.numTempPrevResult = 0;
      prevState.boolCalculateStatus = false;
      // prevState.arrSplittedText = prevState.strInputText.match(this.matchReg);
      prevState.arrSplittedText = this.strInputText.match(this.matchReg);
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
              prevState.numCalResult = this.fnArithmeticOperationMapper[strArithmetic](prevState.boolCalculateStatus ? prevState.numTempPrevResult : numLeftValue, numRightValue);
              prevState.numTempPrevResult = prevState.numCalResult;
              prevState.boolCalculateStatus = true;
            } else if(prevState.arrSplittedText[index+2] === '=') {
              prevState.arrCalculatedText.push(' = ', this.fnArithmeticOperationMapper[strArithmetic](prevState.boolCalculateStatus ? prevState.numTempPrevResult : numLeftValue, numRightValue), '\n');
              prevState.numTempPrevResult = 0;
              prevState.boolCalculateStatus = false;
            };
        }
      });
      prevState.strInputText = '';
      prevState.arrCalculatedText.map(value => prevState.strInputText += value);
    });
  }
  render() {
    return(
      <View
        style={styles.container}
      >
        <Text
          style={styles.headerText}
        >
          String Calculate
        </Text>
        <View>
          <Text
            style={styles.ruleText}
          >
            Rule : allow(+, -, *, /), calculate order : from left(without arithmetic operation), space not allowed in the variable name. support only english now.
          </Text>
          <TextInput
            ref='_textarea'
            style={{
              height: 150,
              borderWidth: 1,
              borderRadius: 10,
              borderColor: 'lightgray'
            }}
            multiline={true}
            placeholder='input what you want to calculate'
            onChangeText={strInputText => {
              this.strInputText = strInputText;
              this.setState({ strInputText });
              this.fnSubmit();
            }}
            // value={this.state.strInputText}
            autoFocus={true}
          />
        </View>
        <Button
          title='Run Calculate'
          onPress={this.fnSubmit}
        />
        <View
          style={styles.exampleViewContainer}
        >
          <Text
            style={styles.exampleTextHeaderText}
          >
            Examples
          </Text>
          <Text
            style={styles.exampleBodyText}
          >
            coke=100
            {'\n'}
            sprite=200
            {'\n'}
            coke + sprite = (press 'run Calculate')
          </Text>
        </View>
        <View
        >
          {Object.keys(this.state.objVariableSet).map(value => (
              <Text
                key={value}
              >
                  {value}: {this.state.objVariableSet[value]}
              </Text>
            )
          )}
        </View>
        <Text
          style={styles.copyRightText}
        >
          Made by Roy
        </Text>
      </View>
    )
  }
}
