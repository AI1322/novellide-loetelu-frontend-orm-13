import { useEffect, useState } from "react";
import { apiGet } from "../api";

export default function RaamatudPage() {
  const [raamatud, setRaamatud] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    apiGet("/raamatud").then(setRaamatud);
  }, []);

  const filtered = raamatud.filter(r =>
    r.nimetus.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h2>Raamatud</h2>

      <input
        placeholder="Otsi raamatu nime järgi..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
        style={{ marginBottom: 10 }}
      />

      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Nimetus</th>
            <th>Leheküljed</th>
            <th>Maksumus</th>
            <th>Novellid</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(r => (
            <tr key={r.id}>
              <td>{r.nimetus}</td>
              <td>{r.lehekylgedeArv}</td>
              <td>{r.maksumus}</td>
              <td>{r.novellideArv}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
