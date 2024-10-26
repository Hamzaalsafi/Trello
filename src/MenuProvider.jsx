import React, { createContext, useContext, useState } from 'react';


const MenuContext = createContext();


export const MenuProvider = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);

 
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <MenuContext.Provider value={{ menuOpen, setMenuOpen, toggleMenu }}>
      {children}
    </MenuContext.Provider>
  );
};


export const useMenuContext = () => {
  return useContext(MenuContext);
};