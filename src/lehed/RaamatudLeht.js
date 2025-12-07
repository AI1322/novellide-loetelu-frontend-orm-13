import React, { useState, useEffect } from 'react';
import api from '../api';

export default function RaamatudLeht() {
  const [raamatud, setRaamatud] = useState([]);
  const [omanikud, setOmanikud] = useState([]);
  const [otsing, setOtsing] = useState('');
  const [omanikuFilter, setOmanikuFilter] = useState('kõik');

  // vormi väljad
  const [nimetus, setNimetus] = useState('');
  const [lehekülgi, setLehekülgi] = useState('');
  const [maksumus, setMaksumus] = useState('');
  const [valitudOmanik, setValitudOmanik] = useState('');

  useEffect(() => { laadiAndmed(); }, []);

  const laadiAndmed = async () => {
    const [rRes, oRes] = await Promise.all([api.get('/raamatud'), api.get('/omanikud')]);
    setRaamatud(rRes.data);
    setOmanikud(oRes.data);
  };

  const lisaRaamat = async () => {
    await api.post('/raamatud', {
      nimetus,
      lehekylgedeArv: Number(lehekülgi),
      maksumus: Number(maksumus),
      omanikId: valitudOmanik ? Number(valitudOmanik) : null
    });
    laadiAndmed();
    setNimetus(''); setLehekülgi(''); setMaksumus(''); setValitudOmanik('');
  };

  const filtreeritud = raamatud.filter(r => {
    const sobibNimetus = r.nimetus.toLowerCase().includes(otsing.toLowerCase());
    const sobibOmanik = omanikuFilter === 'kõik' ||
      (omanikuFilter === 'ilma' && !r.hasOwner) ||
      (omanikuFilter === 'omanikuga' && r.hasOwner);
    return sobibNimetus && sobibOmanik;
  });

  return React.createElement('div', null,
    React.createElement('h2', null, 'Raamatud'),
    React.createElement('div', { style: { marginBottom: '15px' } },
      React.createElement('input', { placeholder: 'Otsi nimetuse järgi...', value: otsing, onChange: e => setOtsing(e.target.value) }),
      React.createElement('select', { value: omanikuFilter, onChange: e => setOmanikuFilter(e.target.value), style: { marginLeft: '10px' } },
        React.createElement('option', { value: 'kõik' }, 'Kõik'),
        React.createElement('option', { value: 'ilma' }, 'Ilma omanikuta'),
        React.createElement('option', { value: 'omanikuga' }, 'Omanikuga')
      )
    ),
    React.createElement('div', { style: { border: '1px solid #aaa', padding: '15px', borderRadius: '8px', marginBottom: '20px' } },
      React.createElement('h3', null, 'Lisa uus raamat'),
      React.createElement('input', { placeholder: 'Nimetus', value: nimetus, onChange: e => setNimetus(e.target.value), style: { width: '100%', marginBottom: '8px' } }),
      React.createElement('input', { type: 'number', placeholder: 'Lehekülgi', value: lehekülgi, onChange: e => setLehekülgi(e.target.value), style: { width: '100%', marginBottom: '8px' } }),
      React.createElement('input', { type: 'number', step: '0.01', placeholder: 'Maksumus (€)', value: maksumus, onChange: e => setMaksumus(e.target.value), style: { width: '100%', marginBottom: '8px' } }),
      React.createElement('select', { value: valitudOmanik, onChange: e => setValitudOmanik(e.target.value), style: { width: '100%', marginBottom: '8px' } },
        React.createElement('option', { value: '' }, '-- Vali omanik (valikuline) --'),
        omanikud.map(o => React.createElement('option', { key: o.id, value: o.id }, o.nimi))
      ),
      React.createElement('button', { onClick: lisaRaamat }, 'Lisa raamat')
    ),
    React.createElement('table', { style: { width: '100%', borderCollapse: 'collapse' } },
      React.createElement('thead', null,
        React.createElement('tr', null,
          React.createElement('th', { style: { border: '1px solid #ccc', padding: '8px' } }, 'ID'),
          React.createElement('th', { style: { border: '1px solid #ccc', padding: '8px' } }, 'Nimetus'),
          React.createElement('th', { style: { border: '1px solid #ccc', padding: '8px' } }, 'Lehekülgi'),
          React.createElement('th', { style: { border: '1px solid #ccc', padding: '8px' } }, 'Maksumus'),
          React.createElement('th', { style: { border: '1px solid #ccc', padding: '8px' } }, 'Novelle'),
          React.createElement('th', { style: { border: '1px solid #ccc', padding: '8px' } }, 'Omanik')
        )
      ),
      React.createElement('tbody', null,
        filtreeritud.map(r => React.createElement('tr', { key: r.id },
          React.createElement('td', { style: { border: '1px solid #ccc', padding: '8px' } }, r.id),
          React.createElement('td', { style: { border: '1px solid #ccc', padding: '8px' } }, r.nimetus),
          React.createElement('td', { style: { border: '1px solid #ccc', padding: '8px', textAlign: 'center' } }, r.lehekylgedeArv),
          React.createElement('td', { style: { border: '1px solid #ccc', padding: '8px', textAlign: 'right' } }, r.maksumus.toFixed(2) + ' €'),
          React.createElement('td', { style: { border: '1px solid #ccc', padding: '8px', textAlign: 'center' } }, r.novellideArv),
          React.createElement('td', { style: { border: '1px solid #ccc', padding: '8px', textAlign: 'center' } }, r.hasOwner ? 'Jah' : 'Ei')
        ))
      )
    )
  );
}