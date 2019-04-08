import React from 'react';
import Header from './Header';
import Meta from './Meta';

export default function Page(props) {
  const { children } = props;

  return (
    <div>
      <Meta />
      <Header />
      <p>Page comp</p>
      {children}
    </div>
  );
}
