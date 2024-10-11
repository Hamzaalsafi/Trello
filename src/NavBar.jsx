import React from 'react'

export function NavBar() {
  return (
    <nav className='bg-slate-700 p-2 text-lg'>
      <div className='flex justify-start gap-5' >
        <p className='text-zinc-50 cursor-pointer'>logo here</p>
        <p className='text-zinc-50 cursor-pointer'>Home</p>
        <p className='text-zinc-50 cursor-pointer'>Bord</p>
        <p className='text-zinc-50 cursor-pointer'>seting</p>
      </div>
  
    </nav>
  )
}


