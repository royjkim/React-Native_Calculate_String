import React from 'react';
import {
  View,
  Text,
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
  Icon,
  Drawer,
  Fab,
  Toast,
  Card,
  CardItem,
  List,
  ListItem,
} from 'native-base';
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
      boolExampleVisible: true
    };
    this.fnArithmeticOperationMapper = {
      '+': (...args) => args.reduce(function(val1, val2) { return val1 + val2 }),
      '-': (...args) => args.reduce(function(val1, val2) { return val1 - val2 }),
      '*': (...args) => args.reduce(function(val1, val2) { return val1 * val2 }),
      '/': (...args) => args.reduce(function(val1, val2) { return val1 / val2 })
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
    this.strExamplesText = [
      'coke = 100',
      'sprite = 200',
      'coke + sprite = (press \'run Calculate\')'
    ];
    this.fnOpenDrawer();

  };

  fnFocus() {
    this._textarea.focus();
  };
  fnToggleFab() {
    this.setState({ boolFabActive: false });
  };
  fnSubmit() {
    this.fnToggleFab();
    this.state.strInputText === '' ? Alert.alert(
      'Input text please',
      null,
      [
        { text: 'OK', onPress: () => this.fnFocus() }
      ]
    ) : this.fnCalculate();
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
              prevState.numTempPrevResult = prevState.numCalResult;
              prevState.boolCalculateStatus = true;
            } else if(prevState.arrSplittedText[index+2] === '=') {
              const tempResult = this.fnArithmeticOperationMapper.hasOwnProperty(strArithmetic) ? this.fnArithmeticOperationMapper[strArithmetic](prevState.boolCalculateStatus ? prevState.numTempPrevResult : numLeftValue, numRightValue) : 0;
              prevState.arrCalculatedText.push(' = ', tempResult, '\n');
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
    const fnInitializedFinished = (boolFocus = true) => {
      this.fnCloseDrawer();
      boolFocus && this._textarea && this._textarea.focus();
    };
    setTimeout(() => this.fnOpenDrawer(), 200);
    setTimeout(() => fnInitializedFinished(false), 5000);
    setTimeout(() => this.setState({ boolExampleVisible: false }, fnInitializedFinished()), 8000);
  };

  fnCloseDrawer() {
    this._drawer && this._drawer._root.close();
  };
  fnOpenDrawer() {
    Keyboard.dismiss();
    this._drawer && this._drawer._root.open();
  };

  render() {
    return(
      <Drawer
        ref={_drawer => this._drawer = _drawer}
        content={<MySideBar objVariableSet={this.state.objVariableSet} arrDataSourceVariableSet={this.state.arrObjVariableSet} />}
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
            <Card>
              <CardItem bordered>
                <TouchableOpacity
                  onPress={() => this.setState({ boolExampleVisible: !this.state.boolExampleVisible })}
                >
                  {this.state.boolExampleVisible ? (
                    <View
                      style={styles.exampleHeaderView}
                    >
                    <Text
                      style={styles.exampleHeaderText}
                    >
                      ▽ Examples
                    </Text>
                    <Text
                      style={[styles.ruleBodyText, { color: 'gray' }]}
                    >
                      (click to hide)
                    </Text>
                  </View>) : (
                    <View
                      style={styles.exampleHeaderView}
                    >
                      <Text
                        style={styles.exampleHeaderText}
                      >
                        ▷ Examples
                      </Text>
                      <Text
                        style={[styles.ruleBodyText, { color: 'gray' }]}
                      >
                        (click to hide)
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </CardItem>
              <View
                style={{ marginHorizontal: 10 }}
              >
                {this.state.boolExampleVisible && <List
                  dataArray={this.strExamplesText}
                  renderRow={rowData => <ListItem
                    key={rowData}
                    >
                      <Text
                        style={styles.exampleBodyText}
                      >
                        {rowData}
                      </Text>
                  </ListItem>}>
                </List>}
              </View>
            </Card>
            <Card>
              <CardItem bordered>
                <Text
                  style={styles.exampleHeaderText}
                >
                  ▽ Expression
                </Text>
              </CardItem>
              <Content>
                <KeyboardAvoidingView
                  behavior='padding'
                >
                  <TextInput
                    ref={_textarea => this._textarea = _textarea}
                    style={{
                      height: 150,
                      borderWidth: 1,
                      borderRadius: 3,
                      borderColor: '#797979',
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
              </Content>
            </Card>
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
          </Content>
        </Container>
      </Drawer>
    )
  }
}
