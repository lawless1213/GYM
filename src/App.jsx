import { useState, useEffect } from 'react';
import './App.css';
import PageLayout from './pages';
import { Header } from './sections/Header';

function App() {
  const [dayOfWeek, setDayOfWeek] = useState("");

  useEffect(() => {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];

    const today = new Date();
    setDayOfWeek(daysOfWeek[today.getDay()]);
  }, []);

  return (
    <>
      <Header />
      <PageLayout />
    </>
  );
}

export default App;