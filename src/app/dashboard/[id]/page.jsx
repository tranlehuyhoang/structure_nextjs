"use client"
import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import { useRouter } from 'next/navigation'

async function getData(slug) {
  const res = await fetch(`http://localhost:3000/api/posts/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Data not found");
  }

  return res.json();
}

async function updatePost(slug, updatedData) {
  const router = useRouter();

  const res = await fetch(`http://localhost:3000/api/posts/${slug}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  });
  router.push("/next-page");

  if (!res.ok) {
    throw new Error("Failed to update post");
  }

  return res.json();
}

const EditPost = ({ params }) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [desc, setDesc] = useState("");
  const [img, setImg] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    async function fetchPost() {
      try {
        const data = await getData(params.id);
        setPost(data);
        setTitle(data.title);
        setSlug(data.slug);
        setDesc(data.desc);
        setImg(data.img);
        setContent(data.content);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    }

    if (params.id) {
      fetchPost();
    }
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedData = {
        title,
        slug,
        desc,
        img,
        content,
      };

      await updatePost(params.id, updatedData);
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <form className={styles.new} onSubmit={handleSubmit}>
      <h1>Edit Post: {post._id}</h1>
      <input
        type="text"
        placeholder="Title"
        className={styles.input}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Slug"
        className={styles.input}
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
      />
      <input
        type="text"
        placeholder="Desc"
        className={styles.input}
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />
      <input
        type="text"
        placeholder="Image"
        className={styles.input}
        value={img}
        onChange={(e) => setImg(e.target.value)}
      />
      <textarea
        placeholder="Content"
        className={styles.textArea}
        cols="30"
        rows="10"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>
      <button type="submit" className={styles.button}>
        Send
      </button>
    </form>
  );
};

export default EditPost;