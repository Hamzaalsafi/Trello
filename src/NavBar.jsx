import React from 'react'

export function NavBar() {
  return (
    <nav className='p-3  bg-slate-950 text-lg fixed w-screen top-0 z-10 '>
      <div className='flex justify-start gap-5' >
        <p className='text-zinc-50 cursor-pointer'>logo here</p>
        <p className='text-zinc-50 cursor-pointer'>Home</p>
        <p className='text-zinc-50 cursor-pointer'>Bord</p>
        <p className='text-zinc-50 cursor-pointer'>seting</p>
      </div>
  
    </nav>
  )
}


