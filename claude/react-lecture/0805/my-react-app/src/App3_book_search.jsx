import data from './data.jsx';

function App() {
  // console.log(data);
  return (
    <>
      <h1>Book List</h1>
      {data.map((book, index) => {
        return (
          <section key={index}>
            <h2>{book.title}</h2>
            <p>{book.description}</p>
          </section>
        )
      })}
    </>
  )
}

export default App
