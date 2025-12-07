import React, { useState, useEffect } from 'react';
import api from '../api';

export default function NovellidLeht() {
  const [novellid, setNovellid] = useState([]);
  const [raamatud, setRaamatud] = useState([]);
  const [otsing, setOtsing] = useState('');
  const [raamatuFilter, setRaamatuFilter] = useState('kõik');

  const [pealkiri, setPealkiri] = useState('');
  const [sisu, setSisu] = useState('');
  const [valitudRaamat, setValitudRaamat] = useState('');

  useEffect(() => { laadiAndmed(); }, []);

  const laadiAndmed = async () => {
    const [n, r] = await Promise.all([api.get('/novellid'), api.get('/raamatud')]);
    setNovellid(n.data);
    setRaamatud(r.data);
  };

  const lisaNovell = async () => {
    if (sisu.length < 10) { alert('Sisu peab olema vähemalt 10 tähemärki!'); return; }
    await api.post('/novellid', { pealkiri, sisu, raamatId: Number(valitudRaamat) });
    setPealkiri(''); setSisu(''); setValitudRaamat('');
    laadiAndmed();
  };

  const kustutaNovell = async (id) => {
    if (window.confirm('Kas kustutada novell?')) {
      await api.delete(`/novellid/${id}`);
      laadiAndmed();
    }
  };

  const näitaPikkust = async (id) => {
    const res = await api.get(`/novellid/${id}/length`);
    alert(`Sisu pikkus: ${res.data.length} tähemärki`);
  };

  const filtreeritud = novellid.filter(n =>
    n.pealkiri.toLowerCase().includes(otsing.toLowerCase()) &&
    (raamatuFilter === 'kõik' || n.raamatId === Number(raamatuFilter))
  );

  return React.createElement('div', null,
    React.createElement('h2', null, 'Novellid'),
    React.createElement('div', { style: { marginBottom: '15px' } },
      React.createElement('input', { placeholder: 'Otsi pealkirja järgi...', value: otsing, onChange: e => setOtsing(e.target.value) }),
      React.createElement('select', { value: raamatuFilter, onChange: e => setRaamatuFilter(e.target.value), style: { marginLeft: '10px' } },
        React.createElement('option', { value: 'kõik' }, 'Kõik raamatud'),
        raamatud.map(r => React.createElement('option', { key: r.id, value: r.id }, r.nimetus))
      )
    ),
    React.createElement('div', { style: { border: '1px solid #aaa', padding: '15px', borderRadius: '8px', marginBottom: '20px' } },
      React.createElement('h3', null, 'Lisa uus novell'),
      React.createElement('input', { placeholder: 'Pealkiri', value: pealkiri, onChange: e => setPealkiri(e.target.value), style: { width: '100%', marginBottom: '8px' } }),
      React.createElement('textarea', {
        rows: 6,
        placeholder: 'Sisu (vähemalt 10 tähemärki)',
        value: sisu,
        onChange: e => setSisu(e.target.value),
        style: { width: '100%', marginBottom: '8px' }
      }),
      React.createElement('small', null, `Tähemärke: ${sisu.length}`),
      React.createElement('br'),
      React.createElement('select', { value: valitudRaamat, onChange: e => setValitudRaamat(e.target.value), style: { width: '100%', margin: '8px 0' } },
        React.createElement('option', { value: '' }, '-- Vali raamat --'),
        raamatud.map(r => React.createElement('option', { key: r.id, value: r.id }, r.nimetus))
      ),
      React.createElement('button', { onClick: lisaNovell }, 'Lisa novell')
    ),
    React.createElement('table', { style: { width: '100%', borderCollapse: 'collapse' } },
      React.createElement('thead', null,
        React.createElement('tr', null,
          React.createElement('th', { style: { border: '1px solid #ccc', padding: '8px' } }, 'ID'),
          React.createElement('th', { style: { border: '1px solid #ccc', padding: '8px' } }, 'Pealkiri'),
          React.createElement('th', { style: { border: '1px solid #ccc', padding: '8px' } }, 'Raamat ID'),
          React.createElement('th', { style: { border: '1px solid #ccc', padding: '8px' } }, 'Tegevus')
        )
      ),
      React.createElement('tbody', null,
        filtreeritud.map(n => React.createElement('tr', { key: n.id },
          React.createElement('td', { style: { border: '1px solid #ccc', padding: '8px' } }, n.id),
          React.createElement('td', { style: { border: '1px solid #ccc', padding: '8px' } }, n.pealkiri),
          React.createElement('td', { style: { border: '1px solid #ccc', padding: '8px', textAlign: 'center' } }, n.raamatId),
          React.createElement('td', { style: { border: '1px solid #ccc', padding: '8px', textAlign: 'center' } },
            React.createElement('button', { onClick: () => näitaPikkust(n.id) }, 'Pikkus'),
            ' ',
            React.createElement('button', { onClick: () => kustutaNovell(n.id), style: { background: '#d33', color: 'white' } }, 'Kustuta')
          )
        ))
      )
    )
  );
}