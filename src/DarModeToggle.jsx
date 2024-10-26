import React from 'react';

export const DarkModeToggle = () => {
  return (
    <div className=' cursor-pointer'>
<input  type="checkbox" className="toggle--checkbox cursor-pointer" id="toggle"/>
    <label className="toggle--label cursor-pointer" htmlFor="toggle">
        <span className="sun cursor-pointer"></span> 
        <span className="moon cursor-pointer"></span> 
        <span className="toggle--label-background cursor-pointer"></span>
    </label>
</div>
  );
};


