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

function App() {
  const [page, setPage] = useState('one');
  return (
    <>
    <button onClick={() => setPage('one')}>One</button>
    <button onClick={() => setPage('two')}>Two</button>
    <button onClick={() => setPage('three')}>Three</button>
    {page === 'one' && <One />}
    {page === 'two' && <Two />}
    {page === 'three' && <Three />}
    </>
  );
}

export default App;