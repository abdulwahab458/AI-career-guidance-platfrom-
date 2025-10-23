
import {
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from './ui/button'
import { ChevronDown, FileText, GraduationCap, LayoutDashboard, Pen, PenBox, Stars } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { checkUser } from '@/lib/checkUser'


const Header = async() => {
    await checkUser();
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
            <div className="flex justify-center items-center p-4 gap-4 h-16">
                <div className='flex gap-x-3'>
                    <SignedIn>
                        <Link href={"/dashboard"}>
                            <Button variant="outline">
                                <LayoutDashboard className='h-4 w-4' />
                                <span className='hidden md:block'>
                                    Explore Dashboard

                                </span>
                            </Button>
                        </Link>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button>
                                    <Stars className='h-4 w-4' />
                                    <span className='hidden md:block'>Tools</span>
                                    <ChevronDown />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>
                                    <Link href={"/resume"} className='flex items-center gap-2'>
                                        <FileText className='h-4 w-4' />
                                        <span >
                                            Resume Builder</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link href={"/cover-letter"} className='flex items-center gap-2'>
                                        <PenBox className='h-4 w-4' />
                                        <span >
                                            Cover Letter</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link href={"/interprep"} className='flex items-center gap-2'>
                                        <GraduationCap className='h-4 w-4' />
                                        <span >
                                            InterView Preparation</span>
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SignedIn>
                </div>
                <SignedOut>
                    <SignInButton />
                    <SignUpButton>
                        <button className="bg-[#6c47ff] text-ceramic-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                            Sign Up
                        </button>
                    </SignUpButton>
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>
        </div>
    )
}

export default Header
