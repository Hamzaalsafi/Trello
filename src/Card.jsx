import React from 'react'

export function Card({title,id}) {
  return (
    <div className="w-full">
      <p contenteditable ='true'  className='focus:border-solid focus:border-blue-500 focus:box-shadow  focus:outline-none bg-gray-800 bg- text-slate-300 text-md p-1.5 px-2.5 rounded-md w-full mx-0 my-1.5'>{title}</p>
     
    </div>
  )
}


