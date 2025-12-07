import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import OmanikudLeht from './lehed/OmanikudLeht';
import RaamatudLeht from './lehed/RaamatudLeht';
import NovellidLeht from './lehed/NovellidLeht';
import StatistikaLeht from './lehed/StatistikaLeht';

export default function App() {
  const navStyle = { margin: '0 15px', textDecoration: 'none', color: '#0066cc' };

  return React.createElement(BrowserRouter, null,
    React.createElement('div', { style: { fontFamily: 'Arial, sans-serif', padding: '20px' } },
      React.createElement('header', { style: { borderBottom: '2px solid #333', paddingBottom: '10px', marginBottom: '20px' } },
        React.createElement('h1', null, 'Novellide ja raamatute haldus'),
        React.createElement('nav', null,
          React.createElement(Link, { to: '/omanikud', style: navStyle }, 'Omanikud'),
          ' | ',
          React.createElement(Link, { to: '/raamatud', style: navStyle }, 'Raamatud'),
          ' | ',
          React.createElement(Link, { to: '/novellid', style: navStyle }, 'Novellid'),
          ' | ',
          React.createElement(Link, { to: '/statistika', style: navStyle }, 'Statistika')
        )
      ),
      React.createElement('main', null,
        React.createElement(Routes, null,
          React.createElement(Route, { path: '/', element: React.createElement(RaamatudLeht) }),
          React.createElement(Route, { path: '/omanikud', element: React.createElement(OmanikudLeht) }),
          React.createElement(Route, { path: '/raamatud', element: React.createElement(RaamatudLeht) }),
          React.createElement(Route, { path: '/novellid', element: React.createElement(NovellidLeht) }),
          React.createElement(Route, { path: '/statistika', element: React.createElement(StatistikaLeht) })
        )
      )
    )
  );
}