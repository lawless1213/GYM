import { useState, useEffect } from 'react';
import './App.css';
import PageLayout from './pages';
import { Header } from './components/Header';

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
  }, []); // Порожній масив означає, що цей ефект виконається тільки при першому рендері

  return (
    <>
      <Header />
      <PageLayout />
    </>
  );
}

export default App;