import { useEffect, useState } from "react";
import { apiGet } from "../api";

export default function OmanikudPage() {
  const [omanikud, setOmanikud] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    apiGet("/omanikud").then(setOmanikud);
  }, []);

  const filtered = omanikud.filter(o =>
    o.nimi.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h2>Omanikud</h2>

      <input
        placeholder="Otsi nime järgi..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />

      <ul>
        {filtered.map(o => (
          <li key={o.id}>
            {o.nimi} — {o.raamatud.length} raamatut
          </li>
        ))}
      </ul>
    </div>
  );
}
