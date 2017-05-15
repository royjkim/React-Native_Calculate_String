import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {
  Container,
  // Text,
  Icon,
  Button,
  Header,
  Content,
  Body,
  Title,
  Left,
  List,
  ListItem
} from 'native-base';
import styles from '../styles';

export default class MySideBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      arrDataSourceVariableSet: [],
      boolRuleVisible: true,
      arrRuleText: [
        '1. allow arithmetic operations : +, -, *, /',
        '2. calculate order : from left(not allowed : bracket)',
        '3. space not allowed in the variable name.',
        '4. each expression should be end with \'enter\' or \',\'.',
        '5. support language is english only.'
      ]
    };
    this.fnRuleToggle = this.fnRuleToggle.bind(this);
  }

  fnRuleToggle() {
    this.setState({ boolRuleVisible: !this.state.boolRuleVisible });
  };
  componentDidUpdate() {
    console.log(`
      componentWillUpdate
      this.props.boolRuleVisible : ${String(this.props.boolRuleVisible)}
      this.props.arrDataSourceVariableSet.length : ${this.props.arrDataSourceVariableSet.length}
    `)
    // !this.props.boolRuleVisible && this.props.arrDataSourceVariableSet.length > 0 && this.setState({
    //   boolRuleVisible: false
    // })
  }
  render() {
    const { objVariableSet, arrDataSourceVariableSet } = this.props;
    return (
      <View
        style={{
          backgroundColor: '#EBEBEB',
          borderRightWidth: 1,
          borderColor: 'gray',
          flex: 1,
          paddingTop: 26
        }}
      >
        <Container>
          <Header>
            <Body>
              <Title>
                Instructions
              </Title>
            </Body>
          </Header>
          <Content>
            <View>
              <List>
                <ListItem>
                  <View
                    style={styles.instructionParentViewContainer}
                  >
                    <View
                      style={styles.instructionViewContainer}
                    >
                      <Icon
                        name='ios-arrow-dropleft-circle-outline'
                        style={{ color: '#008D14' }}
                      />
                      <Text>
                        Buttons
                      </Text>
                    </View>
                    <View
                      style={styles.instructionViewContainer}
                    >
                      <Icon
                        name='md-checkmark'
                        style={{ color: '#385EFB' }}
                      />
                      <Text>
                        Caculate
                      </Text>
                    </View>
                    <View
                      style={styles.instructionViewContainer}
                    >
                      <Icon
                        name='ios-close-outline'
                        style={{ color: '#FF2A1A' }}
                      />
                      <Text>
                        Clear
                      </Text>
                    </View>
                  </View>
                </ListItem>
              </List>
              <List>
                <ListItem itemDivier>
                  <TouchableOpacity
                    onPress={this.fnRuleToggle}
                  >
                      {this.state.boolRuleVisible ? (
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
                </ListItem>
              </List>
              {this.state.boolRuleVisible && <List
                dataArray={this.state.arrRuleText}
                renderRow={rowData => <ListItem
                  key={rowData}
                  >
                  <Text
                    style={styles.ruleBodyText}
                  >
                    {rowData}
                  </Text>
                </ListItem>}
              >
              </List>}
            </View>
            <List>
              <ListItem itemDivier>
                <Text
                  style={styles.ruleHeaderText}
                >
                  Variables : {arrDataSourceVariableSet.length}
                </Text>
              </ListItem>
              <List
                dataArray={arrDataSourceVariableSet}
                renderRow={rowData => <ListItem
                  key={rowData.name}
                >
                  <Text
                    style={styles.ruleBodyText}
                  >
                    {rowData.name} : {rowData.value}
                  </Text>
                </ListItem>}
              >
              </List>
            </List>
          </Content>
        </Container>
      </View>

    )
  }
}
