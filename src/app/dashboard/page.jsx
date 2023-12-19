"use client"

import React, { useEffect, useState } from 'react'
import useSWR from 'swr';

const Dashboard = () => {
    const fetcher = (...args) => fetch(...args).then((res) => res.json());

    const { data, error, isLoading } = useSWR("http://localhost:3000/data.json", fetcher)

    console.log(data)
    return (
        <div>Dashboard</div>
    )
}

export default Dashboard