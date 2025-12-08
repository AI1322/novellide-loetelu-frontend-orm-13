import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import RaamatudLeht from './lehed/RaamatudLeht';
import NovellidLeht from './lehed/NovellidLeht';
import OmanikudLeht from './lehed/OmanikudLeht';
import StatistikaLeht from './lehed/StatistikaLeht';

export default function App() {
  const linkStyle = { margin: '#e9ecef', textDecoration: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: '500' };

  return React.createElement(BrowserRouter, null,
    React.createElement('div', { style: { minHeight: '100vh', background: '#f8f9fa' } },
      React.createElement('header', { style: { background: '#212529', color: 'white', padding: '1.5rem', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' } },
        React.createElement('h1', { style: { margin: 0 } }, 'Novellide haldussüsteem'),
        React.createElement('nav', { style: { marginTop: '15px' } },
          React.createElement(Link, { to: '/raamatud', style: linkStyle }, 'Raamatud'),
          React.createElement(Link, { to: '/novellid', style: linkStyle }, 'Novellid'),
          React.createElement(Link, { to: '/omanikud', style: linkStyle }, 'Omanikud'),
          React.createElement(Link, { to: '/statistika', style: linkStyle }, 'Statistika')
        )
      ),
      React.createElement('main', null,
        React.createElement(Routes, null,
          React.createElement(Route, { path: '/', element: React.createElement(RaamatudLeht) }),
          React.createElement(Route, { path: '/raamatud', element: React.createElement(RaamatudLeht) }),
          React.createElement(Route, { path: '/novellid', element: React.createElement(NovellidLeht) }),
          React.createElement(Route, { path: '/omanikud', element: React.createElement(OmanikudLeht) }),
          React.createElement(Route, { path: '/statistika', element: React.createElement(StatistikaLeht) })
        )
      )
    )
  );
}