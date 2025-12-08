import React, { useState, useEffect } from 'react';
import api from '../api';
import Modal from '../components/Modal';
import { styles } from '../styles';

export default function OmanikudLeht() {
  const [omanikud, setOmanikud] = useState([]);
  const [otsing, setOtsing] = useState('');
  const [modalAvatud, setModalAvatud] = useState(false);
  const [onMuutmine, setOnMuutmine] = useState(false);
  const [praeguneId, setPraeguneId] = useState(null);
  const [nimi, setNimi] = useState('');

  useEffect(() => { laadi(); }, []);

  const laadi = async () => {
    const res = await api.get('/omanikud');
    setOmanikud(res.data);
  };

  const avaLisa = () => {
    setOnMuutmine(false);
    setPraeguneId(null);
    setNimi('');
    setModalAvatud(true);
  };

  const avaMuuda = (id, currentName) => {
    setOnMuutmine(true);
    setPraeguneId(id);
    setNimi(currentName);
    setModalAvatud(true);
  };

  const salvesta = async () => {
    const trimmitud = nimi.trim();
    if (!trimmitud) return alert('Sisesta nimi!');

    if (onMuutmine) {
      await api.put(`/omanikud/${praeguneId}`, { id: praeguneId, nimi: trimmitud });
    } else {
      await api.post('/omanikud', { nimi: trimmitud });
    }
    laadi();
    setModalAvatud(false);
  };

  const kustuta = async (id) => {
    if (!window.confirm('Kustutada omanik ja kõik tema raamatud?')) return;
    await api.delete(`/omanikud/${id}`);
    laadi();
  };

  const filtreeritud = omanikud.filter(o =>
    o.nimi.toLowerCase().includes(otsing.toLowerCase())
  );

  return React.createElement('div', { style: styles.container },

    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' } },
      React.createElement('h2', { style: { margin: 0 } }, 'Omanikud'),
      React.createElement('button', {
        onClick: avaLisa,
        style: { ...styles.button, ...styles.btnSuccess, padding: '10px 24px' }
      }, 'Lisa omanik')
    ),

    React.createElement('div', { style: { display: 'flex', gap: '15px', marginBottom: '30px' } },
      React.createElement('input', {
        type: 'text',
        placeholder: 'Otsi nime järgi...',
        value: otsing,
        onChange: e => setOtsing(e.target.value),
        style: { ...styles.input, width: '380px', minWidth: '250px' }
      })
    ),

    React.createElement('table', { style: styles.table },
      React.createElement('thead', null,
        React.createElement('tr', null,
          React.createElement('th', { style: styles.th }, 'ID'),
          React.createElement('th', { style: styles.th }, 'Nimi'),
          React.createElement('th', { style: { ...styles.th, textAlign: 'center' } }, 'Raamatuid'),
          React.createElement('th', { style: { ...styles.th, textAlign: 'center' } }, 'Novelle'),
          React.createElement('th', { style: { ...styles.th, textAlign: 'right' } }, 'Kogumaksumus'),
          React.createElement('th', { 
            style: { 
              ...styles.th, 
              width: '180px', 
              textAlign: 'center',
              paddingRight: '24px'
            } 
          }, 'Tegevus')
        )
      ),
      React.createElement('tbody', null,
        filtreeritud.map(o => {
          const raamatuid = o.raamatud?.length || 0;
          const novelle = o.raamatud?.reduce((s, r) => s + (r.novellid?.length || 0), 0) || 0;
          const maksumus = o.raamatud?.reduce((s, r) => s + Number(r.maksumus || 0), 0) || 0;

          return React.createElement('tr', { key: o.id },
            React.createElement('td', { style: styles.td }, o.id),
            React.createElement('td', { style: styles.td }, o.nimi),
            React.createElement('td', { style: { ...styles.td, textAlign: 'center' } }, raamatuid),
            React.createElement('td', { style: { ...styles.td, textAlign: 'center' } }, novelle),
            React.createElement('td', { style: { ...styles.td, textAlign: 'right' } }, maksumus.toFixed(2) + ' €'),
            React.createElement('td', { 
              style: { ...styles.td, textAlign: 'right', padding: '10px 24px' } 
            },
              React.createElement('div', { style: { display: 'inline-flex', gap: '10px' } },
                React.createElement('button', {
                  onClick: () => avaMuuda(o.id, o.nimi),
                  style: { ...styles.button, ...styles.btnPrimary, padding: '7px 14px', fontSize: '0.9rem' }
                }, 'Muuda'),
                React.createElement('button', {
                  onClick: () => kustuta(o.id),
                  style: { ...styles.button, ...styles.btnDanger, padding: '7px 14px', fontSize: '0.9rem' }
                }, 'Kustuta')
              )
            )
          );
        })
      )
    ),

    React.createElement(Modal, {
      isOpen: modalAvatud,
      onClose: () => setModalAvatud(false),
      title: onMuutmine ? 'Muuda omanikku' : 'Lisa uus omanik'
    },
      React.createElement('div', null,
        React.createElement('div', { style: styles.formGroup },
          React.createElement('label', { style: styles.label }, 'Nimi'),
          React.createElement('input', {
            style: styles.input,
            value: nimi,
            onChange: e => setNimi(e.target.value)
          })
        ),
        React.createElement('div', { style: { textAlign: 'right', marginTop: '30px' } },
          React.createElement('button', {
            onClick: salvesta,
            style: { ...styles.button, ...styles.btnSuccess }
          }, 'Salvesta'),
          React.createElement('button', {
            onClick: () => setModalAvatud(false),
            style: { ...styles.button, backgroundColor: '#6c757d', marginLeft: '12px' }
          }, 'Katkesta')
        )
      )
    )
  );
}