import { useState, useEffect } from "react";


function App() {
  const [blog, setBlog] = useState(null);
  
  useEffect(() => {
    fetch('https://dev.wenivops.co.kr/services/fastapi-crud/1/blog/1')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setBlog(data);
      });
  }, []);

  return (
    <>
      <h1>Blog Post</h1>
      {blog ? (
        <>
          <h2>{blog.title}</h2>
          <p>{blog.content}</p>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </>
  )
}

export default App;