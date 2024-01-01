"use client"
import React from "react";
import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from 'next/navigation';
async function getData(page, search) {
  const res = await fetch(`http://localhost:3000/api/posts?page=${page}&search=${search}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();
  console.log(data);

  return data;
}

const Blog = async () => {
  const searchParams = useSearchParams()
  const router = useRouter();
  const page = searchParams.get('page') ?? '1';
  const per_page = searchParams.get('per_page') ?? '5';

  const handleSearch = (e) => {
    e.preventDefault();
    const search = e.target[0].value;
    router.push(`/blog?page=${page}&search=${search}`);
  }

  const fetchData = async () => {
    const data = await getData(page, search);
    // Update your component state with the fetched data
  };

  useEffect(() => {
    fetchData();
  }, [page, search]);

  return (
    <>
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="Search" />
        <button type="submit">Search</button>
      </form>
      <div className={styles.mainContainer}>
        {/* Render the blog posts */}
        {/* Render the pagination buttons */}
      </div>
    </>
  );
};

export default Blog;