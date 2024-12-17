import { Button, createTheme } from '@mantine/core';

const myColor = [
  '#fdfce4', //1
  '#f8f6d3', //2
  '#f0ecaa', //3
  '#e7e17c', //4
  '#e0d856', //5
  '#dbd33e', //6
  '#d9d02f', //7
  '#c0b820', //8
  '#aaa317', //9
  '#928d03'  //10
];

export const theme = createTheme({
  colors: {
    myColor,
  },
  primaryColor: "myColor"
});