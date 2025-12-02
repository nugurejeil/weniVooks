// npm install react-router-dom
import { BrowserRouter, Routes, Route, Link, useParams, useLocation } from 'react-router-dom';
import { useState } from 'react';

// 홈 페이지 - 블로그 목록
function Home() {
  const [blogs, setBlogs] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // 데이터 한 번만 가져오기
  if (!loaded) {
    fetch("https://dev.wenivops.co.kr/services/fastapi-crud/1/blog")
      .then((response) => response.json())
      .then((data) => {
        setBlogs(data);
        setLoaded(true);
      })
      .catch((error) => console.error(error));
  }

  return (
    <div>
      <h1>블로그 목록</h1>
      {blogs.map((blog) => (
        <div key={blog._id} style={{ border: '1px solid gray', margin: '10px', padding: '10px' }}>
          <h3>{blog.title}</h3>
          <p>작성자: {blog.author}</p>
          <p>날짜: {blog.date}</p>
          <Link to={`/blog/${blog._id}`}>읽기</Link>
        </div>
      ))}
    </div>
  );
}

// 블로그 상세 페이지
function BlogDetail() {
  // const { id } = useParams();
  const location = useLocation();
  console.log(location);
  const id = location.pathname.split('/').pop();
  const [blog, setBlog] = useState(null);
  const [loaded, setLoaded] = useState(false);

  // 데이터 한 번만 가져오기
  if (!loaded) {
    fetch("https://dev.wenivops.co.kr/services/fastapi-crud/1/blog")
      .then((response) => response.json())
      .then((data) => {
        const foundBlog = data.find(b => b._id === id);
        setBlog(foundBlog);
        setLoaded(true);
      })
      .catch((error) => console.error(error));
  }

  if (!blog) {
    return <div>로딩중...</div>;
  }

  return (
    <div>
      <Link to="/">← 목록으로</Link>
      <h1>{blog.title}</h1>
      <p>작성자: {blog.author}</p>
      <p>이메일: {blog.email}</p>
      <p>날짜: {blog.date} {blog.time}</p>
      <p>조회수: {blog.views_count}</p>
      <hr />
      <p>{blog.content}</p>
    </div>
  );
}

// About 페이지
function About() {
  return (
    <div>
      <h2>About Page</h2>
      <p>이것은 블로그 사이트입니다.</p>
    </div>
  );
}

// Contact 페이지
function Contact() {
  return (
    <div>
      <h2>Contact Page</h2>
      <p>연락처: blog@example.com</p>
    </div>
  );
}

// 메인 App
function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">홈</Link> | 
        <Link to="/about">소개</Link> | 
        <Link to="/contact">연락처</Link>
      </nav>
      <hr />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;