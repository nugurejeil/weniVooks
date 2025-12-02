// npm install react-router-dom
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function Home() {
  return <h2>Home Page</h2>;
}

function About() {
  return <h2>About Page</h2>;
}

function Contact() {
  return <h2>Contact Page</h2>;
}

function App() {
  return (
    <>
      <BrowserRouter>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/product/1">Product 1</Link>
        <Link to="/product/2">Product 2</Link>
        <Link to="/product/3">Product 3</Link>
        <Link to="/contact">Contact</Link>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/about" element={<About/>} />
          {/* <Route path="/product/:id" element={<h2>Product Page</h2>} /> */}
          <Route path="/product/1" element={<h2>Product 1 Details</h2>} />
          <Route path="/product/2" element={<h2>Product 2 Details</h2>} />
          <Route path="/product/3" element={<h2>Product 3 Details</h2>} />
          <Route path="/contact" element={<Contact/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
