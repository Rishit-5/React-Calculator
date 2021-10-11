import React from 'react';
import {StyleSheet, Text, View, Button, TouchableOpacity} from 'react-native';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputt: '',
    };
    this.mains = ['Clear', '+', '-', '*', '/', '^'];
    this.Ans = 0;
  }

  render() {
    let rows = [];
    let nums = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      ['.', 0, '='],
      ['sin(', 'cos(', 'tan('],
      ['Ans', '(', ')'],
      ['π', 'e', 'log('],
    ];
    for (let i = 0; i < 7; i++) {
      let row = [];
      for (let j = 0; j < 3; j++) {
        row.push(
          <TouchableOpacity
            onPress={() => this.doCalc(nums[i][j])}
            key={nums[i][j]}
            style={styles.btn}>
            <Text style={styles.white}>{nums[i][j]}</Text>
          </TouchableOpacity>,
        );
      }
      rows.push(
        <View key={i} style={styles.row}>
          {row}
        </View>,
      );
    }

    let ops = [];
    for (let i = 0; i < 6; i++) {
      ops.push(
        <TouchableOpacity
          key={this.mains[i]}
          style={styles.btn2}
          onPress={() => this.operate(this.mains[i])}>
          <Text style={[styles.btntext, styles.white]}>{this.mains[i]}</Text>
        </TouchableOpacity>,
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.result}>
          <Text style={styles.inputt}>{this.state.inputt}</Text>
        </View>

        <View style={styles.buttons}>
          <View style={styles.numbers}>{rows}</View>
          <View style={styles.mains}>{ops}</View>
        </View>
      </View>
    );
  }
  calc() {
    let text = this.state.inputt;
    // do magic
    while (text.includes('π')) {
      let sub = text.substring(text.indexOf('π'), text.indexOf('π') + 1);
      text = text.replace(sub, Math.PI);
    }
    while (text.includes('e')) {
      let sub = text.substring(text.indexOf('e'), text.indexOf('e') + 1);
      text = text.replace(sub, Math.E);
    }
    while (text.includes('^')) {
      if (
        text.indexOf('+') != -1 ||
        text.indexOf('-') != -1 ||
        text.indexOf('*') != -1 ||
        text.indexOf('/') != -1
      ) {
        let temp = -1; // 0 == only on left, 1 == only on right, 2 == both sides
        let indexR;
        let indexL;
        if (
          (text.indexOf('+') != -1 && text.indexOf('+') < text.indexOf('^')) ||
          (text.indexOf('-') != -1 && text.indexOf('-') < text.indexOf('^')) ||
          (text.indexOf('*') != -1 && text.indexOf('*') < text.indexOf('^')) ||
          (text.indexOf('/') != -1 && text.indexOf('/') < text.indexOf('^'))
        ) {
          temp = 0;
          let temp2 = text.substring(0, text.indexOf('^'));
          let plus = temp2.lastIndexOf('+');
          let minus = temp2.lastIndexOf('-');
          let divide = temp2.lastIndexOf('/');
          let mulit = temp2.lastIndexOf('*');
          if (plus > minus && plus > divide && plus > mulit) {
            indexR = plus;
          } else if (minus > plus && minus > divide && minus > mulit) {
            indexR = minus;
          } else if (divide > minus && divide > minus && divide > mulit) {
            indexR = divide;
          } else {
            indexR = mulit;
          }
        } //index of farthest found

        let temp2 = text.substring(text.indexOf('^') + 1, text.length); //back part of equation
        if (
          temp2.indexOf('+') != -1 ||
          temp2.indexOf('-') != -1 ||
          temp2.indexOf('*') != -1 ||
          temp2.indexOf('/') != -1
        ) {
          //if there is a operation number
          let plus = temp2.indexOf('+');
          if (plus == -1) {
            plus = 1000; //if not found make it 1000
          }
          let minus = temp2.indexOf('-');
          if (minus == -1) {
            minus = 1000;
          }
          let divide = temp2.indexOf('/');
          if (divide == -1) {
            divide = 1000;
          }
          let mulit = temp2.indexOf('*');
          if (mulit == -1) {
            mulit = 1000;
          }

          if (plus < minus && plus < divide && plus < mulit) {
            indexL = plus + text.length - temp2.length;
          } else if (minus < plus && minus < divide && minus < mulit) {
            indexL = minus + text.length - temp2.length;
          } else if (divide < plus && divide < minus && divide < mulit) {
            indexL = divide + text.length - temp2.length;
          } else {
            indexL = mulit;
          } //index of closest found

          if (temp == -1) {
            temp = 1;
          } else {
            temp = 2;
          }
        }

        if (temp == 0) {
          //doing the operation
          let q = text.substring(indexR, text.indexOf('^'));
          let q1 = text.substring(text.indexOf('^') + 1, text.length);
          let num = Math.pow(q, q1);
          let sub = text.substring(indexR + 1, text.length);
          text = text.replace(sub, num);
        } else if (temp == 1) {
          let q = text.substring(0, text.indexOf('^'));
          let q1 = text.substring(text.indexOf('^') + 1, indexL);
          let num = Math.pow(q, q1);
          let sub = text.substring(0, indexL);
          text = text.replace(sub, num);
        } else {
          let q = text.substring(indexR, text.indexOf('^'));
          let q1 = text.substring(text.indexOf('^') + 1, indexL);
          let num = Math.pow(q, q1);
          let sub = text.substring(indexR + 1, indexL);
          text = text.replace(sub, num);
        }
      } else {
        let q = text.substring(0, text.indexOf('^'));
        let q1 = text.substring(text.indexOf('^') + 1, text.length);
        let num = Math.pow(q, q1);
        let sub = text.substring(0, text.length);
        text = text.replace(sub, num);
      }

      // text = text.replace(q,"Math.pow(" + text.substring(text.indexOf("^")-1, text.indexOf("^")) + "," + text.substringtext.indexOf("^")+1 + ")")
      // alert(text)
    }
    while (text.includes('log')) {
      let q = text.substring(text.indexOf('(') + 1, text.indexOf(')'));
      q = parseInt(q);
      let num = Math.log10(q);
      let sub = text.substring(text.indexOf('l'), text.indexOf(')') + 1);
      text = text.replace(sub, num);
      // text = text.replace(q,"Math.pow(" + text.substring(text.indexOf("^")-1, text.indexOf("^")) + "," + text.substringtext.indexOf("^")+1 + ")")
      // alert(text)
    }
    while (text.includes('si')) {
      let q = text.substring(text.indexOf('(') + 1, text.indexOf(')'));
      q = parseInt(q);
      q *= Math.PI / 180;
      let num = Math.sin(q);
      let sub = text.substring(text.indexOf('s'), text.indexOf(')') + 1);
      text = text.replace(sub, num);
      // text = text.replace(q,"Math.pow(" + text.substring(text.indexOf("^")-1, text.indexOf("^")) + "," + text.substringtext.indexOf("^")+1 + ")")
      // alert(text)
    }
    if (text.includes('c')) {
      let q = text.substring(text.indexOf('(') + 1, text.indexOf(')'));
      q = parseInt(q);
      q *= Math.PI / 180;
      let num = Math.cos(q);
      let sub = text.substring(text.indexOf('c'), text.indexOf(')') + 1);
      text = text.replace(sub, num);
      // text = text.replace(q,"Math.pow(" + text.substring(text.indexOf("^")-1, text.indexOf("^")) + "," + text.substringtext.indexOf("^")+1 + ")")
      // alert(text)
    }
    while (text.includes('t')) {
      let q = text.substring(text.indexOf('(') + 1, text.indexOf(')'));
      q = parseInt(q);
      q *= Math.PI / 180;
      let num = Math.tan(q);
      let sub = text.substring(text.indexOf('t'), text.indexOf(')') + 1);
      text = text.replace(sub, num);
      // text = text.replace(q,"Math.pow(" + text.substring(text.indexOf("^")-1, text.indexOf("^")) + "," + text.substringtext.indexOf("^")+1 + ")")
      // alert(text)
    }
    // eslint-disable-next-line no-eval
    this.Ans = eval(text);
    this.setState({
      // eslint-disable-next-line no-eval
      inputt: eval(text),
    });
  }
  doThing() {
    const t1 = this.state.inputt;
    return !(
      t1.slice(-1) === '+' ||
      t1.slice(-1) === '-' ||
      t1.slice(-1) === '*' ||
      t1.slice(-1) === '/' ||
      t1.slice(-1) === '^'
    );
  }

  doCalc(text) {
    if (text === '=') {
      return this.doThing() && this.calc();
    }
    if (text === 'Ans') {
      this.setState({
        inputt: this.state.inputt + this.Ans,
      });
    } else {
      this.setState({
        inputt: this.state.inputt + text,
      });
    }
  }

  operate(main) {
    if (main === 'Clear') {
      this.setState({
        inputt: '',
      });
    } else if (
      main === '+' ||
      main === '-' ||
      main === '*' ||
      main === '/' ||
      main === '^'
    ) {
      this.setState({
        inputt: this.state.inputt + main,
      });
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  btntext: {
    fontSize: 30,
  },
  white: {
    color: 'white',
    fontSize: 30,
  },
  btn: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'center',
    borderRadius: 50,
    borderWidth: 1,
    backgroundColor: '#4f4d4b',
  },
  btn2: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'center',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#e39b14',
  },
  inputt: {
    fontSize: 24,
    color: 'white',
  },
  result: {
    flex: 2,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  buttons: {
    flex: 7,
    flexDirection: 'row',
  },
  numbers: {
    flex: 3,
    backgroundColor: '#000',
  },
  mains: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'stretch',
    backgroundColor: '#000',
  },
});
