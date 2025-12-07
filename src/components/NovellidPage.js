import { useEffect, useState } from "react";
import { apiGet } from "../api";

export default function NovellidPage() {
  const [novellid, setNovellid] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    apiGet("/novellid").then(setNovellid);
  }, []);

  const filtered = novellid.filter(n =>
    n.pealkiri.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h2>Novellid</h2>

      <input
        placeholder="Otsi pealkirja järgi..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />

      <ul>
        {filtered.map(n => (
          <li key={n.id}>
            {n.pealkiri} (raamat: {n.raamatId})
          </li>
        ))}
      </ul>
    </div>
  );
}
