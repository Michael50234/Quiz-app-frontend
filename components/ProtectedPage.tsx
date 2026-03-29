'use client';

import { useEffect, useState } from 'react'
import { useUser } from './userProvider'
import LoadingSpinner from './loadingSpinner';
import { useRouter } from 'next/navigation';
import ErrorPage from './errorPage';

// The props object contains the children and data needed to enforce permissions
type ProtectedPageProps = {
    children: React.ReactNode,
}

const ProtectedPage = ({ children }: ProtectedPageProps ) => {
    const [authLoading, setAuthLoading] = useState<boolean>(true);
    const router = useRouter();   

    const { user } = useUser();

    useEffect(() => {
        if(!user) {
            router.replace('/')
        }

        setAuthLoading(false);
    }, [])

    return (
        authLoading ? (
            <LoadingSpinner />
        ) : (
            children
        )
    )
}

export default ProtectedPage
