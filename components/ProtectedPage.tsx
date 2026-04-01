'use client';

import { useEffect, useState } from 'react'
import { useUser } from './userProvider'
import LoadingSpinner from './loadingSpinner';
import { useRouter } from 'next/navigation';

// The props object contains the children and data needed to enforce permissions
type ProtectedPageProps = {
    children: React.ReactNode,
}

const ProtectedPage = ({ children }: ProtectedPageProps ) => {
    const router = useRouter();   

    const { user, userLoading } = useUser();

    useEffect(() => {
        if(userLoading) return;

        if(!user) {
            router.replace('/');
        }
    }, [userLoading])

    return (
        userLoading ? (
            <LoadingSpinner />
        ) : (
            children
        )
    )
}

export default ProtectedPage
