
"use client"

import {
    SignInButton,
    SignUpButton,
    UserButton,
    useUser,
} from '@clerk/nextjs'
import Link from 'next/link'


const Header = () => {
    const { isLoaded, isSignedIn } = useUser()

    return (
        <div className='flex justify-between mx-auto border-b-2 bg-gray-900/80 backdrop-blur-md w-full top-0 fixed z-50'>
            {/* logo  */}
            <div className='items-center justify-center h-16 p-4'>
                {/* <p>Mentora</p> */}
                <Link href="/">
                    <p className="font-extrabold text-3xl bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600
    bg-clip-text text-transparent
    drop-shadow-[0_2px_8px_rgba(59,130,246,0.5)]
    tracking-wide">
                        Mentora
                    </p>
                </Link>
            </div>
            <div className="flex justify-center items-center p-4 gap-3 h-16">
                {!isLoaded ? (
                    <div aria-hidden="true" className="h-10 w-24" />
                ) : !isSignedIn ? (
                    <>
                    <SignInButton />
                    <SignUpButton>
                        <button className="cursor-pointer rounded-full bg-[#6c47ff] px-4 py-2.5 text-sm font-medium text-white sm:px-5 sm:text-base">
                            Sign Up
                        </button>
                    </SignUpButton>
                    </>
                ) : null}
                {isLoaded && isSignedIn ? (
                    <UserButton />
                ) : null}
            </div>
        </div>
    )
}

export default Header
