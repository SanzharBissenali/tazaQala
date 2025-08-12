'use client';
import { useEffect, useState } from 'react';
import styles from './page.module.css';

interface Report {
  _id: string;
  name: string;
  email: string;
  text: string;
  coords: [number, number];
}

export default function DatabasePage() {
  const [data, setData] = useState<Report[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/data');
        const json = await res.json();
        console.log('Fetched reports:', json);
        setData(json);
      } catch (err) {
        console.error('Failed to fetch data', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <h1>Reports from Database</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Text</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{item.text}</td>
              <td>{item.coords[0]}, {item.coords[1]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
