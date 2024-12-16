import { Button, createTheme } from '@mantine/core';

const myColor = [
  '#fdfce4',
  '#f8f6d3',
  '#f0ecaa',
  '#e7e17c',
  '#e0d856',
  '#dbd33e',
  '#d9d02f',
  '#c0b820',
  '#aaa317',
  '#928d03'
];

export const theme = createTheme({
  colors: {
    myColor,
  },
  primaryColor: "myColor"
});