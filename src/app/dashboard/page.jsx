"use client"
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const Dashboard = () => {
    const [page, setPage] = useState(1);
    const [data, setData] = useState(null);
    const { data: session, status } = useSession();
    const router = useRouter();

    const fetchData = async () => {
        try {
            const res = await fetch(
                `/api/posts?page=${page}&username=${session?.user?.name}`,
                {
                    cache: "no-store",
                }
            );

            if (!res.ok) {
                throw new Error("Failed to fetch data");
            }

            const data = await res.json();
            setData(data);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/posts?page=${page}&username=${session?.user?.name}`,
                    {
                        cache: "no-store",
                    }
                );

                if (!res.ok) {
                    throw new Error("Failed to fetch data");
                }

                const data = await res.json();
                setData(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [page, session]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const title = e.target[0].value;
        const slug = e.target[1].value;
        const desc = e.target[2].value;
        const img = e.target[3].value;
        const content = e.target[4].value;

        try {
            await fetch("/api/posts", {
                method: "POST",
                body: JSON.stringify({
                    title,
                    slug,
                    desc,
                    img,
                    content,
                    username: session.user.name,
                }),
            });
            e.target.reset();
            fetchData();

        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`/api/posts/${id}`, {
                method: "DELETE",
            });
            // Tải lại dữ liệu sau khi xóa bài viết
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    if (status === "loading") {
        return <p>Loading...</p>;
    }

    if (status === "unauthenticated") {
        router.push("/dashboard/login");
        return null;
    }

    if (status === "authenticated") {
        return (
            <div className={styles.container}>
                <div className={styles.posts}>
                    {data?.posts.map((post) => (
                        <div className={styles.post} key={post._id}>
                            <div className={styles.imgContainer}>
                                <Image
                                    src={post.img || "https://images.pexels.com/photos/2916450/pexels-photo-2916450.jpeg"}
                                    alt=""
                                    width={200}
                                    height={100}
                                />
                            </div>
                            <h2 className={styles.postTitle}>{post.title}</h2>
                            <Link href={`./dashboard/${post.slug}`}>Edit</Link>
                            <span
                                className={styles.delete}
                                onClick={() => handleDelete(post._id)}
                            >
                                X
                            </span>
                        </div>
                    ))}
                    {Array.from({ length: data?.totalPages }, (_, index) => (
                        <button
                            onClick={() => setPage(index + 1)}
                            key={index}
                            className={styles.buttons}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>

                <form className={styles.new} onSubmit={handleSubmit}>
                    <h1>Add New Post</h1>
                    <input type="text" placeholder="Title" className={styles.input} />
                    <input type="text" placeholder="Slug" className={styles.input} />
                    <input type="text" placeholder="Desc" className={styles.input} />
                    <input type="text" placeholder="Image" className={styles.input} />
                    <textarea
                        placeholder="Content"
                        className={styles.textArea}
                        cols="30"
                        rows="10"
                    ></textarea>
                    <button className={styles.button}>Send</button>
                </form>
            </div>
        );
    }

    return null;
};

export default Dashboard;