import React from 'react'
import {Link } from 'react-router-dom';

import {CatLogo} from './CatLogo'
import { useNavigate  } from 'react-router-dom';
export function NavBar() {
  const navigate = useNavigate();

  
  return (
    <nav className='border-b-2   border-gray-500 h-[46px] sm:h-[47.5Zpx]  bg-zinc-800 text-lg fixed w-screen  z-10'>
      <div className='flex justify-between items-center'> 
        <div className='flex items-center gap-5'>
       
          <Link to="/Home"><div className='text-zinc-50 cursor-pointer flex gap-5  cat catlogo items-center font-bold'>   <CatLogo/>KittyTask</div></Link> 
          <p className='text-zinc-50 cursor-pointer'>Boards</p>
          <p className='text-zinc-50 cursor-pointer'>Settings</p>
        </div>
        <div className='flex'> 
          
        
        </div>
      </div>
    </nav>
  );
}


