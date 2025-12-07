import React, { useState, useEffect } from 'react';
import api from '../api';

export default function StatistikaLeht() {
  const [stat, setStat] = useState({});

  useEffect(() => {
    const laadi = async () => {
      const [kogu, maks] = await Promise.all([
        api.get('/raamatud/totalcost'),
        api.get('/raamatud/maxpages')
      ]);
      setStat({ koguMaksumus: kogu.data.totalCost, suurim: maks.data });
    };
    laadi();
  }, []);

  return React.createElement('div', null,
    React.createElement('h2', null, 'Üldstatistika'),
    React.createElement('p', null,
      React.createElement('strong', null, 'Kõigi raamatute kogumaksumus: '),
      stat.koguMaksumus ? `${stat.koguMaksumus.toFixed(2)} €` : 'Laeb...'
    ),
    React.createElement('p', null,
      React.createElement('strong', null, 'Kõige rohkem lehekülgi sisaldav raamat:'),
      stat.suurim
        ? React.createElement('div', { style: { marginLeft: '20px', marginTop: '10px', fontSize: '1.1em' } },
            `"${stat.suurim.nimetus}" – ${stat.suurim.lehekylgedeArv} lehekülge`
          )
        : ' Laeb...'
    )
  );
}