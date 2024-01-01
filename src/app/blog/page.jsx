 
 
   import React from "react";
import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";

async function getData() {
  const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL;
  const res = await fetch(`https://ps26819-blog.vercel.app/api/posts`, {
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

  const data = await getData();

  return (
    <div className={styles.mainContainer}>

      {data.posts.map((item) => (
        <Link href={`/blog/${item.slug}`} className={styles.container} key={item.id}>
          <div className={styles.imageContainer}>
            <Image
              src={item.img}
              alt=""
              width={400}
              height={250}
              className={styles.image}
            />
          </div>
          <div className={styles.content}>
            <h1 className={styles.title}>{item.title}</h1>
            <p className={styles.desc}>{item.desc}</p>
          </div>
        </Link>
      ))}
      {Array.from({ length: data.totalPages }, (_, index) => (
        <Link href={`/blog?page=${index + 1}`} key={index}>
          <button className={styles.button}>{index + 1}</button>
        </Link>
      ))}
    </div>
  );
};

export default Blog;

