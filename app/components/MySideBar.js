import React from 'react';
import {
  View,
  Text,
  ListView,
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
        '4. each expression should be end with \',\'.',
        '5. support language is english only.'
      ]
      // boolListViewVisible: false
    };
    this.ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.fnRuleToggle = this.fnRuleToggle.bind(this);
  }

  componentWillMount() {
    this.setState({
      // arrDataSourceVariableSet: this.ds.cloneWithRows(this.props.objVariableSet),
      // boolListViewVisible: Object.keys(this.props.objVariableSet).length > 0 ? true : false
    });
  }
  // componentWillUpdate() {
  //   this.setState({
  //     arrDataSourceVariableSet: this.ds.cloneWithRows(this.props.objVariableSet),
  //     boolListViewVisible: Object.keys(this.props.objVariableSet).length > 0 ? true : false
  //   })
  // }
  fnRuleToggle() {
    this.setState({ boolRuleVisible: !this.state.boolRuleVisible });
  };
  render() {
    const { objVariableSet, arrDataSourceVariableSet } = this.props;
    return (
      <View
        style={{
          backgroundColor: '#EBEBEB',
          borderWidth: 1,
          flex: 1,
          // marginTop: 26
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
            {/* <Body> */}
              {/* <Left> */}
                {/* {Object.keys(objVariableSet).map(value => (<Text
                  style={styles.variableListText}
                      key={value}
                    >
                      {value}: {objVariableSet[value]}
                    </Text>)
                )} */}
                {/* {this.state.boolRuleVisible ? ( */}
                  <View>
                    <List>
                      <ListItem itemDivier>
                        <TouchableOpacity
                          onPress={this.fnRuleToggle}
                        >
                          {/* <View
                            style={styles.eachHeaderContainer}
                          > */}
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
                          {/* </View> */}
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
                {/* ) : (
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
                )} */}
                <List>
                  {/* <ListItem>
                    <Text
                      style={styles.ruleBodyText}
                    >
                      1. allow arithmetic operations : +, -, *, /
                    </Text>
                  </ListItem>
                  <ListItem>
                    <Text
                      style={styles.ruleBodyText}
                    >
                      2. calculate order : from left(not allowed : bracket)
                    </Text>
                  </ListItem>
                  <ListItem>
                    <Text
                      style={styles.ruleBodyText}
                    >
                      3. space not allowed in the variable name.
                    </Text>
                  </ListItem>
                  <ListItem>
                    <Text
                      style={styles.ruleBodyText}
                    >
                      4. each expression should be end with ','.
                    </Text>
                  </ListItem>
                  <ListItem>
                    <Text
                      style={styles.ruleBodyText}
                    >
                      5. support language is english only.
                    </Text>
                  </ListItem> */}
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
                      <Text>
                        {rowData.name} : {rowData.value}
                      </Text>
                    </ListItem>}
                  >
                  </List>
                  {/* <ListView
                    enableEmptySections={true}
                    removeClippedSubviews={false}
                    dataSource={arrDataSourceVariableSet}
                    renderRow={rowData => {
                      console.log('rowData : ', rowData)
                      return (
                        <ListItem
                          key={rowData.name}
                        >
                          <Text>
                            {rowData.name} : {rowData.value}
                          </Text>
                        </ListItem>
                      )
                    }
                    }
                  /> */}
                </List>
              {/* </Left> */}
            {/* </Body> */}
          </Content>
        </Container>
      </View>

    )
  }
}

// MySideBar.defaultProps = {
//   objVariableSet: {}
// }
