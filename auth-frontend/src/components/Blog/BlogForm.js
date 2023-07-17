import React, { useEffect, useState } from "react";
import api from "../services/api";

const BlogForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await api.get("http://localhost:9000/api/blogs");
        setBlogs(response.data);
      } catch (error) {
        console.log("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("http://localhost:9000/api/blogs", { title, content });

      // Clear form inputs
      setTitle("");
      setContent("");
    } catch (error) {
      console.log("Error creating blog:", error);
    }
  };

  return (
    <div>
      <h2>Create Blog</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label>Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <button type="submit">Create</button>
      </form>
      <div>
        <h2>Blogs</h2>
        {blogs.map((blog) => (
          <div key={blog._id}>
            <h3>{blog.title}</h3>
            <p>{blog.content}</p>
            <p>Author: {blog.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogForm;
