// npm install react-router-dom
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { use, useState } from 'react';

function Home() {
  const [loaded, setLoaded] = useState(false);
  const [blogs, setBlogs] = useState([]);
  if (!loaded) {
    fetch('https://dev.wenivops.co.kr/services/fastapi-crud/1/blog')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setBlogs(data);
        setLoaded(true);
      });
  }
  return (
    <>
      {blogs.map((blog, index) => (
        <section>
          <h2>{blog.title}</h2>
          <p>{blog.author}</p>
          <p>{blog.date}</p>
          <Link to={`/blog/${index}`}>Read more</Link>
        </section>
      ))}
    </>
  );
}

function About() {
  return <h2>About Page</h2>;
}

function Contact() {
  return <h2>Contact Page</h2>;
}

function BlogDetail() {
  // const { id } = useParams();
  const location = useLocation();
  const id = location.pathname.split('/').pop();
  const [blog, setBlog] = useState(null);
  const [loaded, setLoaded] = useState(false);

  if (!loaded) {
    fetch(`https://dev.wenivops.co.kr/services/fastapi-crud/1/blog/${id}`)
      .then(response => response.json())
      .then(data => {
        setBlog(data);
        setLoaded(true);
      });
  }
  return (
    <div>
      {blog ? (
        <>
          <h2>{blog.title}</h2>
          <p>{blog.author}</p>
          <p>{blog.date}</p>
          <p>{blog.content}</p>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}


function App() {
  return (
    <>
      <BrowserRouter>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/about" element={<About/>} />
          <Route path="/blog/:id" element={<BlogDetail/>} />
          <Route path="/contact" element={<Contact/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
