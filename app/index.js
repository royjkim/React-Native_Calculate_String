import React from 'react';
import {
  View,
  Text,
  // Button,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import {
  Container,
  Header,
  Body,
  Left,
  Right,
  Title,
  Footer,
  Button,
  Content,
  // Text,
  Icon,
  Drawer,
  Fab,
  Toast,
} from 'native-base';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import { Icon } from 'native-base/Fonts';
import styles from './styles';
import MySideBar from './components/MySideBar';

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
      arrObjVariableSet: [],
      boolCalculateStatus: false,
      ruleVisible: true,
      exampleVisible: false,
      variableListVisible: true,
      boolFabActive: false,
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
    this.fnClear = this.fnClear.bind(this);
    this.fnCloseDrawer = this.fnCloseDrawer.bind(this);
    this.fnOpenDrawer = this.fnOpenDrawer.bind(this);
    this.fnToggleFab = this.fnToggleFab.bind(this);
    this.extractNumsReg = /([0-9]+)/gm;
    this.splitReg = /([\s])/gm;
    this.matchReg = /([a-zA-Z0-9]+)|([0-9]+)|([*+\-/=])/gm;
    this.boolFirstInstruction = true;
    console.disableYellowBox = true;

  };

  fnFocus() {
    // this.refs['_textarea'].focus();
    this._textarea.focus();
  };
  fnToggleFab() {
    this.setState({ boolFabActive: false });
  };
  fnSubmit() {
    this.fnToggleFab();
    this.state.strInputText === '' ? alert('input text please') : this.fnCalculate();
  };
  fnCalculate() {
    Keyboard.dismiss();
    this.setState(prevState => {
      prevState.arrCalculatedText = [];
      prevState.objVariableSet = {};
      prevState.arrObjVariableSet = [];
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
          prevState.arrObjVariableSet.push({
            name: prevValueFromArrSplittedText,
            value: prevState.objVariableSet[prevValueFromArrSplittedText]
          }),
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
    setTimeout(() => this._textarea.setNativeProps({ text: this.state.strInputText }), 0);
    Toast.show({
      supportedOrientations: ['potrait','landscape'],
      text: 'Calculate Completed!',
      position: 'bottom',
      duration: 2500,
      buttonText: 'OK'
    })
  };
  fnClear() {
    this.fnToggleFab();
    Alert.alert(
      'Warning',
      'All data would be deleted. This can\'t be restored.',
      [
        { text: 'Cancel', onPress: () => this.fnFocus() },
        { text: 'OK', onPress: () => {
          this._textarea.setNativeProps({ text: '' });
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
          this.fnFocus();
        }}
      ]
    )
  };

  componentDidMount() {
    const fnInitializedFinished = () => {
      this.boolFirstInstruction = false;
      this._textarea && this._textarea.focus();
    };
    setTimeout(() => this.setState({ ruleVisible: false }, fnInitializedFinished()), 5000);
  };

  fnCloseDrawer() {
    this._drawer._root.close();
  };
  fnOpenDrawer() {
    Keyboard.dismiss();
    this._drawer._root.open();
  };

  render() {
    // const fnCloseDrawer = () => {
    //   this._drawer._root.close();
    // };
    // const fnOpenDrawer = () => {
    //   this._drawer._root.open();
    // };
    return(
            <Drawer
              ref={_drawer => this._drawer = _drawer}
              // content={<MySideBar navigator={this.navigator} />}
              content={<MySideBar objVariableSet={this.state.objVariableSet} arrDataSourceVariableSet={this.state.arrObjVariableSet} />}
              // onClose={() => this.fnCloseDrawer()}
              // onClose={() => alert('close')}
              // onOpen={() => alert('open')}
              onClose={this.fnCloseDrawer}
            >
              <Container>
                <Header>
                  <Left>
                    <Button light
                      onPress={this.fnOpenDrawer}
                    >
                      <Icon name='menu' style={{ color: 'black' }} />
                    </Button>
                  </Left>
                  <Body>
                    <Title>
                      Calculator
                    </Title>
                  </Body>
                  <Right />
                </Header>
                <Content>
                  {/* <Body> */}
                  <Text
                    style={styles.exampleHeaderText}
                  >
                    Examples
                  </Text>
                  <Text
                    style={styles.exampleBodyText}
                  >
                    coke=100,
                    {'\n'}
                    sprite=200,
                    {'\n'}
                    coke + sprite = (press 'run Calculate')
                  </Text>
                  <Fab
                    active={this.state.boolFabActive}
                    onPress={() => this.setState({ boolFabActive: !this.state.boolFabActive })}
                    style={{ backgroundColor: '#008D14' }}
                    direction='left'
                    position='topRight'
                  >
                    <Icon name='ios-arrow-dropleft-circle-outline' />
                    <Button
                      style={{ backgroundColor: '#045591' }}
                      onPress={() => {
                        this.fnToggleFab();
                        this.fnOpenDrawer();
                      }}
                    >
                      <Icon name='md-list' />
                    </Button>
                    <Button
                      style={{ backgroundColor: '#FF2A1A' }}
                      onPress={this.fnClear}
                    >
                      <Icon
                        name='ios-close-outline'
                      />
                    </Button>
                    <Button
                      style={{ backgroundColor: '#385EFB' }}
                      onPress={this.fnSubmit}
                    >
                      <Icon
                        name='md-checkmark'
                      />
                    </Button>
                  </Fab>
                  <Text
                    style={styles.exampleHeaderText}
                  >
                    Expression
                  </Text>
                    <KeyboardAvoidingView
                      behavior='padding'
                    >
                      <TextInput
                        // ref='_textarea'
                        ref={_textarea => {
                          this._textarea = _textarea;
                          // console.log('ref')
                          // this.state.boolFabActive && this.fnToggleFab();
                        }}
                        style={{
                          height: 150,
                          borderWidth: 1,
                          borderRadius: 5,
                          borderColor: 'lightgray',
                          padding: 10,
                          fontSize: 13,
                        }}
                        multiline={true}
                        autoCapitalize={'none'}
                        placeholder='input what you want to calculate'
                        onChangeText={strInputText => {
                          this.state.boolFabActive && this.fnToggleFab();
                          this.setState({ strInputText });
                        }}
                      />
                    </KeyboardAvoidingView>
                  {/* </Body> */}
                </Content>
                {/* <Footer>
                  <View
                    style={{ justifyContent: 'center' }}
                  >
                    <Button bordered danger
                      // style={{ backgroundColor: 'white', color: 'red' }}
                    >
                      <Icon
                        name='trash'
                        style={{ color: '#FF2A1A' }}
                      />
                      <Text>
                        Clear
                      </Text>
                    </Button>
                  </View>
                </Footer> */}
              </Container>
            </Drawer>
    )
  }
}
