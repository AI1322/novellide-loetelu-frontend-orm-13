import React, { useState, useEffect } from 'react';
import api from '../api';
import Modal from '../components/Modal';
import { styles } from '../styles';

export default function RaamatudLeht() {
  const [raamatud, setRaamatud] = useState([]);
  const [omanikud, setOmanikud] = useState([]);
  const [otsing, setOtsing] = useState('');
  const [omanikuFilter, setOmanikuFilter] = useState('kõik');
  const [modalAvatud, setModalAvatud] = useState(false);
  const [onMuutmine, setOnMuutmine] = useState(false);
  const [praeguneId, setPraeguneId] = useState(null);

  const [nimetus, setNimetus] = useState('');
  const [lehekülgi, setLehekülgi] = useState('');
  const [maksumus, setMaksumus] = useState('');
  const [omanikId, setOmanikId] = useState('');

  useEffect(() => { laadi(); }, []);

  const laadi = async () => {
    const [rRes, oRes] = await Promise.all([api.get('/raamatud'), api.get('/omanikud')]);
    setRaamatud(rRes.data);
    setOmanikud(oRes.data);
  };

  const avaLisa = () => {
    setOnMuutmine(false);
    setPraeguneId(null);
    setNimetus('');
    setLehekülgi('');
    setMaksumus('');
    setOmanikId('');
    setModalAvatud(true);
  };

  const avaMuuda = (raamat) => {
    setOnMuutmine(true);
    setPraeguneId(raamat.id);
    setNimetus(raamat.nimetus);
    setLehekülgi(raamat.lehekylgedeArv);
    setMaksumus(raamat.maksumus);
    setOmanikId(raamat.omanikId || '');
    setModalAvatud(true);
  };

  const salvesta = async () => {
    if (!nimetus || !lehekülgi || !maksumus) return alert('Täida kõik väljad!');

    const payload = {
      id: onMuutmine ? praeguneId : undefined,
      nimetus,
      lehekylgedeArv: Number(lehekülgi),
      maksumus: Number(maksumus),
      omanikId: omanikId ? Number(omanikId) : null
    };

    if (onMuutmine) {
      await api.put(`/raamatud/${praeguneId}`, payload);
    } else {
      await api.post('/raamatud', payload);
    }
    laadi();
    setModalAvatud(false);
  };

  const kustuta = async (id) => {
    if (!window.confirm('Kustutada raamat?')) return;
    await api.delete(`/raamatud/${id}`);
    laadi();
  };

  const filtreeritud = raamatud.filter(r =>
    r.nimetus.toLowerCase().includes(otsing.toLowerCase()) &&
    (omanikuFilter === 'kõik' ||
      (omanikuFilter === 'omanikuga' && r.hasOwner) ||
      (omanikuFilter === 'ilma' && !r.hasOwner))
  );

  return React.createElement('div', { style: styles.container },

    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' } },
      React.createElement('h2', { style: { margin: 0 } }, 'Raamatud'),
      React.createElement('button', {
        onClick: avaLisa,
        style: { ...styles.button, ...styles.btnSuccess, padding: '10px 24px' }
      }, 'Lisa raamat')
    ),

    React.createElement('div', { style: { display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' } },
      React.createElement('input', {
        placeholder: 'Otsi nimetuse järgi...',
        value: otsing,
        onChange: e => setOtsing(e.target.value),
        style: { ...styles.input, width: '380px', minWidth: '250px' }
      }),
      React.createElement('select', {
        value: omanikuFilter,
        onChange: e => setOmanikuFilter(e.target.value),
        style: { ...styles.select, width: '220px' }
      },
        React.createElement('option', { value: 'kõik' }, 'Kõik'),
        React.createElement('option', { value: 'omanikuga' }, 'Omanikuga'),
        React.createElement('option', { value: 'ilma' }, 'Ilma omanikuta')
      )
    ),

    React.createElement('table', { style: styles.table },
      React.createElement('thead', null,
        React.createElement('tr', null,
          React.createElement('th', { style: styles.th }, 'ID'),
          React.createElement('th', { style: styles.th }, 'Nimetus'),
          React.createElement('th', { style: { ...styles.th, textAlign: 'center' } }, 'Lehekülgi'),
          React.createElement('th', { style: { ...styles.th, textAlign: 'right' } }, 'Maksumus'),
          React.createElement('th', { style: { ...styles.th, textAlign: 'center' } }, 'Novelle'),
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
        filtreeritud.map(r => React.createElement('tr', { key: r.id },
          React.createElement('td', { style: styles.td }, r.id),
          React.createElement('td', { style: styles.td }, r.nimetus),
          React.createElement('td', { style: { ...styles.td, textAlign: 'center' } }, r.lehekylgedeArv),
          React.createElement('td', { style: { ...styles.td, textAlign: 'right' } }, r.maksumus.toFixed(2) + ' €'),
          React.createElement('td', { style: { ...styles.td, textAlign: 'center' } }, r.novellideArv),
          React.createElement('td', { style: { ...styles.td, textAlign: 'right', padding: '10px 24px' } },
            React.createElement('div', { style: { display: 'inline-flex', gap: '10px' } },
              React.createElement('button', {
                onClick: () => avaMuuda(r),
                style: { ...styles.button, ...styles.btnPrimary, padding: '7px 14px', fontSize: '0.9rem' }
              }, 'Muuda'),
              React.createElement('button', {
                onClick: () => kustuta(r.id),
                style: { ...styles.button, ...styles.btnDanger, padding: '7px 14px', fontSize: '0.9rem' }
              }, 'Kustuta')
            )
          )
        ))
      )
    ),

    React.createElement(Modal, {
      isOpen: modalAvatud,
      onClose: () => setModalAvatud(false),
      title: onMuutmine ? 'Muuda raamatut' : 'Lisa uus raamat'
    },
      React.createElement('div', null,
        React.createElement('div', { style: styles.formGroup },
          React.createElement('label', { style: styles.label }, 'Nimetus'),
          React.createElement('input', { style: styles.input, value: nimetus, onChange: e => setNimetus(e.target.value) })
        ),
        React.createElement('div', { style: styles.formGroup },
          React.createElement('label', { style: styles.label }, 'Lehekülgi'),
          React.createElement('input', { type: 'number', style: styles.input, value: lehekülgi, onChange: e => setLehekülgi(e.target.value) })
        ),
        React.createElement('div', { style: styles.formGroup },
          React.createElement('label', { style: styles.label }, 'Maksumus (€)'),
          React.createElement('input', { type: 'number', step: '0.01', style: styles.input, value: maksumus, onChange: e => setMaksumus(e.target.value) })
        ),
        React.createElement('div', { style: styles.formGroup },
          React.createElement('label', { style: styles.label }, 'Omanik'),
          React.createElement('select', {
            style: styles.select,
            value: omanikId,
            onChange: e => setOmanikId(e.target.value)
          },
            React.createElement('option', { value: '' }, '-- Vali omanik --'),
            omanikud.map(o => React.createElement('option', { key: o.id, value: o.id }, o.nimi))
          )
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