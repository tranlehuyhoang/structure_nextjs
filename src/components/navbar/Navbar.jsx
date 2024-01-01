"use client";

import Link from "next/link";
import React from "react";
import styles from "./navbar.module.css";
import DarkModeToggle from "../DarkModeToggle/DarkModeToggle";
import { signOut, useSession } from "next-auth/react";

const links = [
    {
        id: 1,
        title: "Home",
        url: "/",
    },

    {
        id: 3,
        title: "Blog",
        url: "/blog",
    },


    {
        id: 6,
        title: "Dashboard",
        url: "/dashboard",
    },
];

const Navbar = () => {
    const session = useSession();
    return (
        <div className={styles.container}>
            <Link href="/" className={styles.logo}>
                lamamia
            </Link>
            <div className={styles.links}>
                <DarkModeToggle />

                {links.map((link) => (
                    <Link key={link.id} href={link.url} className={styles.link}>
                        {link.title}
                    </Link>
                ))}
                {session.status === "authenticated" && (
                    <button className={styles.logout} onClick={signOut}>
                        {session?.data?.user?.image ? (
                            <img width={'50px'} height={'50px'} src={session?.data?.user?.image} alt="" srcset="" />
                        ) : (
                            <span>hello:{session?.data?.user?.name}  Logout</span>
                        )}
                    </button>
                )}

            </div>
        </div>
    );
};

export default Navbar;
