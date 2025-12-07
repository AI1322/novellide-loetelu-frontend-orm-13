import React, { useState, useEffect } from 'react';
import api from '../api';

export default function OmanikudLeht() {
  const [omanikud, setOmanikud] = useState([]);
  const [otsing, setOtsing] = useState('');
  const [uusNimi, setUusNimi] = useState('');

  useEffect(() => { laadiOmanikud(); }, []);

  const laadiOmanikud = async () => {
    const res = await api.get('/omanikud');
    setOmanikud(res.data);
  };

  const lisaOmanik = async () => {
    if (!uusNimi.trim()) return;
    await api.post('/omanikud', { nimi: uusNimi });
    setUusNimi('');
    laadiOmanikud();
  };

  const kustutaOmanik = async (id) => {
    if (window.confirm('Kas kustutada omanik?')) {
      await api.delete(`/omanikud/${id}`);
      laadiOmanikud();
    }
  };

  const filtreeritud = omanikud.filter(o => 
    o.nimi.toLowerCase().includes(otsing.toLowerCase())
  );

  return React.createElement('div', null,
    React.createElement('h2', null, 'Omanikud'),
    React.createElement('input', {
      placeholder: 'Otsi nime järgi...',
      value: otsing,
      onChange: e => setOtsing(e.target.value),
      style: { padding: '8px', width: '300px', marginBottom: '15px' }
    }),
    React.createElement('div', { style: { marginBottom: '20px' } },
      React.createElement('input', {
        placeholder: 'Uus omanik',
        value: uusNimi,
        onChange: e => setUusNimi(e.target.value)
      }),
      React.createElement('button', { onClick: lisaOmanik, style: { marginLeft: '10px' } }, 'Lisa')
    ),
    React.createElement('table', { style: { width: '100%', borderCollapse: 'collapse' } },
      React.createElement('thead', null,
        React.createElement('tr', null,
          React.createElement('th', { style: { border: '1px solid #ccc', padding: '8px' } }, 'ID'),
          React.createElement('th', { style: { border: '1px solid #ccc', padding: '8px' } }, 'Nimi'),
          React.createElement('th', { style: { border: '1px solid #ccc', padding: '8px' } }, 'Raamatuid'),
          React.createElement('th', { style: { border: '1px solid #ccc', padding: '8px' } }, 'Novelle'),
          React.createElement('th', { style: { border: '1px solid #ccc', padding: '8px' } }, 'Kogumaksumus'),
          React.createElement('th', { style: { border: '1px solid #ccc', padding: '8px' } }, 'Tegevus')
        )
      ),
      React.createElement('tbody', null,
        filtreeritud.map(o => React.createElement('tr', { key: o.id },
          React.createElement('td', { style: { border: '1px solid #ccc', padding: '8px' } }, o.id),
          React.createElement('td', { style: { border: '1px solid #ccc', padding: '8px' } }, o.nimi),
          React.createElement('td', { style: { border: '1px solid #ccc', padding: '8px', textAlign: 'center' } }, o.raamatud.length),
          React.createElement('td', { style: { border: '1px solid #ccc', padding: '8px', textAlign: 'center' } },
            o.raamatud.reduce((sum, r) => sum + r.novellid.length, 0)
          ),
          React.createElement('td', { style: { border: '1px solid #ccc', padding: '8px', textAlign: 'right' } },
            o.raamatud.reduce((sum, r) => sum + Number(r.maksumus), 0).toFixed(2) + ' €'
          ),
          React.createElement('td', { style: { border: '1px solid #ccc', padding: '8px', textAlign: 'center' } },
            React.createElement('button', { onClick: () => kustutaOmanik(o.id) }, 'Kustuta')
          )
        ))
      )
    )
  );
}