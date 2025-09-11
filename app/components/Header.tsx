import Link from 'next/link'
import React from 'react'

const Header = () => {
  return (
    <>
    <header>
        <div className='h-16 bg-neutral-100 flex items-center justify-between p-4 md:px-10 md:py-4'>
            <div className='flex items-center gap-4'>
                <Link href="/">
                <h1 className='text-2xl font-bold'>
                    术力口 Type
                </h1>
                </Link>
            </div>
        </div>
    </header>
    </>
  )
}

export default Header