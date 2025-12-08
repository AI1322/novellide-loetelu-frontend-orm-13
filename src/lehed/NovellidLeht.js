import React, { useState, useEffect } from 'react';
import api from '../api';
import Modal from '../components/Modal';
import { styles } from '../styles';

export default function NovellidLeht() {
  const [novellid, setNovellid] = useState([]);
  const [pikkused, setPikkused] = useState({});
  const [raamatud, setRaamatud] = useState([]);
  const [otsing, setOtsing] = useState('');
  const [raamatuFilter, setRaamatuFilter] = useState('kõik');

  // Модальное окно: создаём или редактируем?
  const [modalAvatud, setModalAvatud] = useState(false);
  const [onMuutmine, setOnMuutmine] = useState(false);
  const [praeguneId, setPraeguneId] = useState(null);

  // Форма
  const [pealkiri, setPealkiri] = useState('');
  const [sisu, setSisu] = useState('');
  const [valitudRaamat, setValitudRaamat] = useState('');

  useEffect(() => {
    laadiAndmed();
  }, []);

  const laadiAndmed = async () => {
    try {
      const [novRes, raaRes] = await Promise.all([
        api.get('/novellid'),
        api.get('/raamatud')
      ]);

      setNovellid(novRes.data);
      setRaamatud(raaRes.data);

      // Загружаем длины
      const pikkusRequests = novRes.data.map(n =>
        api.get(`/novellid/${n.id}/length`)
          .then(res => ({ id: n.id, pikkus: res.data.length }))
          .catch(() => ({ id: n.id, pikkus: 0 }))
      );

      const tulemused = await Promise.all(pikkusRequests);
      const uus = {};
      tulemused.forEach(p => { uus[p.id] = p.pikkus; });
      setPikkused(uus);
    } catch (err) {
      console.error('Andmete laadimine ebaõnnestus:', err);
    }
  };

  // Открыть модалку для создания
  const avaLisaModal = () => {
    setOnMuutmine(false);
    setPraeguneId(null);
    setPealkiri('');
    setSisu('');
    setValitudRaamat('');
    setModalAvatud(true);
  };

  // Открыть модалку для редактирования
  const avaMuudaModal = async (id) => {
    try {
      const res = await api.get(`/novellid/${id}`);
      const novell = res.data;
      setOnMuutmine(true);
      setPraeguneId(id);
      setPealkiri(novell.pealkiri);
      setSisu(novell.sisu);
      setValitudRaamat(novell.raamatId);
      setModalAvatud(true);
    } catch (err) {
      alert('Ei saanud novelli andmeid');
    }
  };

  const salvesta = async () => {
    if (sisu.trim().length < 10) {
      alert('Sisu peab olema vähemalt 10 tähemärki!');
      return;
    }
    if (!valitudRaamat) {
      alert('Vali raamat!');
      return;
    }

    const payload = {
      id: onMuutmine ? praeguneId : undefined,
      pealkiri: pealkiri.trim(),
      sisu: sisu.trim(),
      raamatId: Number(valitudRaamat)
    };

    try {
      if (onMuutmine) {
        await api.put(`/novellid/${praeguneId}`, payload);
      } else {
        await api.post('/novellid', payload);
      }
      laadiAndmed();
      setModalAvatud(false);
    } catch (err) {
      alert('Salvestamine ebaõnnestus');
    }
  };

  const sulgeModal = () => {
    setModalAvatud(false);
  };

  const kustuta = async (id) => {
    if (!window.confirm('Kas kustutada novell?')) return;
    api.delete(`/novellid/${id}`).then(() => laadiAndmed());
  };

  const filtreeritud = novellid.filter(n =>
    n.pealkiri.toLowerCase().includes(otsing.toLowerCase()) &&
    (raamatuFilter === 'kõik' || n.raamatId === Number(raamatuFilter))
  );

  return React.createElement('div', { style: styles.container },

    // Заголовок + кнопка
    React.createElement('div', {
      style: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }
    },
      React.createElement('h2', { style: { margin: 0 } }, 'Novellid'),
      React.createElement('button', {
        onClick: avaLisaModal,
        style: { ...styles.button, ...styles.btnSuccess, padding: '10px 24px' }
      }, 'Lisa novell')
    ),

    // Поиск + фильтр
    React.createElement('div', {
      style: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }
    },
      React.createElement('input', {
        type: 'text',
        placeholder: 'Otsi pealkirja järgi...',
        value: otsing,
        onChange: e => setOtsing(e.target.value),
        style: { ...styles.input, width: '380px', minWidth: '250px' }
      }),
      React.createElement('select', {
        value: raamatuFilter,
        onChange: e => setRaamatuFilter(e.target.value),
        style: { ...styles.select, width: '280px' }
      },
        React.createElement('option', { value: 'kõik' }, 'Kõik raamatud'),
        raamatud.map(r => React.createElement('option', { key: r.id, value: r.id }, r.nimetus))
      )
    ),

    // Таблица
    React.createElement('table', { style: styles.table },
      React.createElement('thead', null,
        React.createElement('tr', null,
          React.createElement('th', { style: styles.th }, 'ID'),
          React.createElement('th', { style: styles.th }, 'Pealkiri'),
          React.createElement('th', { style: styles.th }, 'Raamat'),
          React.createElement('th', { style: { ...styles.th, width: '110px', textAlign: 'center' } }, 'Pikkus'),
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
        filtreeritud.length === 0
          ? React.createElement('tr', null,
              React.createElement('td', { 
                colSpan: 5, 
                style: { ...styles.td, textAlign: 'center', padding: '60px', color: '#888' } 
              }, 'Novelle ei leitud')
            )
          : filtreeritud.map(n => React.createElement('tr', { key: n.id },
              React.createElement('td', { style: styles.td }, n.id),
              React.createElement('td', { style: styles.td }, n.pealkiri),
              React.createElement('td', { style: styles.td },
                raamatud.find(r => r.id === n.raamatId)?.nimetus || '—'
              ),
              React.createElement('td', {
                style: { 
                  ...styles.td, 
                  textAlign: 'center', 
                  fontFamily: 'monospace', 
                  fontSize: '1.15rem', 
                  fontWeight: '600',
                  color: '#2c3e50'
                }
              }, pikkused[n.id] ?? '...'),

              // Кнопки в одной строке, справа, с отступом от края
              React.createElement('td', { 
                style: { 
                  ...styles.td, 
                  textAlign: 'right',
                  padding: '10px 24px'  // красивый отступ справа
                } 
              },
                React.createElement('div', {
                  style: {
                    display: 'inline-flex',
                    gap: '10px',
                    alignItems: 'center'
                  }
                },
                  React.createElement('button', {
                    onClick: () => avaMuudaModal(n.id),
                    style: { 
                      ...styles.button, 
                      ...styles.btnPrimary,
                      padding: '7px 14px',
                      fontSize: '0.9rem'
                    }
                  }, 'Muuda'),
                  React.createElement('button', {
                    onClick: () => kustuta(n.id),
                    style: { 
                      ...styles.button, 
                      ...styles.btnDanger,
                      padding: '7px 14px',
                      fontSize: '0.9rem'
                    }
                  }, 'Kustuta')
                )
              )
            ))
      )
    ),

    // Единое модальное окно для создания и редактирования
    React.createElement(Modal, {
      isOpen: modalAvatud,
      onClose: sulgeModal,
      title: onMuutmine ? 'Muuda novelli' : 'Lisa uus novell'
    },
      React.createElement('div', null,
        React.createElement('div', { style: styles.formGroup },
          React.createElement('label', { style: styles.label }, 'Pealkiri'),
          React.createElement('input', {
            style: styles.input,
            value: pealkiri,
            onChange: e => setPealkiri(e.target.value)
          })
        ),
        React.createElement('div', { style: styles.formGroup },
          React.createElement('label', { style: styles.label }, 'Sisu'),
          React.createElement('textarea', {
            rows: 8,
            style: { ...styles.input, resize: 'vertical' },
            value: sisu,
            onChange: e => setSisu(e.target.value),
            placeholder: 'Vähemalt 10 tähemärki...'
          })
        ),
        React.createElement('div', { style: { margin: '8px 0', color: '#555' } },
          `Tähemärke: ${sisu.length}`
        ),
        React.createElement('div', { style: styles.formGroup },
          React.createElement('label', { style: styles.label }, 'Raamat'),
          React.createElement('select', {
            style: styles.select,
            value: valitudRaamat,
            onChange: e => setValitudRaamat(e.target.value)
          },
            React.createElement('option', { value: '' }, '-- Vali raamat --'),
            raamatud.map(r => React.createElement('option', { key: r.id, value: r.id }, r.nimetus))
          )
        ),
        React.createElement('div', { style: { textAlign: 'right', marginTop: '30px' } },
          React.createElement('button', {
            onClick: salvesta,
            style: { ...styles.button, ...styles.btnSuccess }
          }, onMuutmine ? 'Salvesta muudatused' : 'Lisa novell'),
          React.createElement('button', {
            onClick: sulgeModal,
            style: { ...styles.button, backgroundColor: '#6c757d', marginLeft: '12px' }
          }, 'Katkesta')
        )
      )
    )
  );
}