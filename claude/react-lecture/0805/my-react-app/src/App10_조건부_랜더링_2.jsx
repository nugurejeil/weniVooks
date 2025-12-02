import { useState } from 'react';

function One(){
  return <p>one</p>
}

function Two(){
  return <p>two</p>
}

function Three(){
  return <p>three</p>
}

function Contents({ page }) {
  if (page === 'one') {
    return <One />;
  } else if (page === 'two') {
    return <Two />;
  } else if (page === 'three') {
    return <Three />;
  }
  return <One />;
}

function App() {
  const [page, setPage] = useState('one');
  return (
    <>
      <button onClick={() => setPage('one')}>One</button>
      <button onClick={() => setPage('two')}>Two</button>
      <button onClick={() => setPage('three')}>Three</button>
      <Contents page={page} />
    </>
  )
}

export default App;