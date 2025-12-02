// npm install react-router-dom
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';

function Home() {
  return <h2>Home Page</h2>;
}

function About() {
  return <h2>About Page</h2>;
}

function Contact() {
  return <h2>Contact Page</h2>;
}

function Product(){
  const location = useLocation();
  console.log(location);
  const id = location.pathname.split('/').pop();
  return <h2>Product Page for Product ID: {id}</h2>;
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
        <Link to="/product/4">Product 4</Link>
        <Link to="/product/5">Product 5</Link>
        <Link to="/contact">Contact</Link>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/about" element={<About/>} />
          <Route path="/product/:id" element={<Product/>} />
          <Route path="/contact" element={<Contact/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
