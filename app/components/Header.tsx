"use client";

import Link from 'next/link'
import React, { useRef } from 'react'

const Header = () => {
  const clickCountRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleHeaderClick = () => {
    clickCountRef.current++;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 3000);
    
    if (clickCountRef.current >= 8) {
      const isDisabled = localStorage.getItem('umami.disabled');
      
      if (isDisabled) {
        if (window.confirm('enable analytics?')) {
          localStorage.removeItem('umami.disabled');
        }
      } else {
        if (window.confirm('disable analytics?')) {
          localStorage.setItem('umami.disabled', '1');
        }
      }
      
      clickCountRef.current = 0;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  };

  return (
    <>
    <header>
        <div className='h-16 bg-neutral-100 flex items-center justify-between p-4 md:px-10 md:py-4'>
            <div className='flex items-center gap-4'>
                <Link href="/">
                <h1 className='text-2xl font-bold' onClick={handleHeaderClick}>
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