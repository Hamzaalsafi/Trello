import React, {useState, useRef , useEffect } from 'react';
import { db } from './firebase2'; 
import { onAuthStateChanged } from 'firebase/auth'; 
import { auth } from './firebase2';
import { collection } from 'firebase/firestore'; 
import {getDocs } from 'firebase/firestore';
import {CreateBoards} from "./CreateBoards"
import {MiniBoard} from './MiniBoard';
export function YourBoards() {
  const [Board, setBoard] = useState([]);
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const fetchCards = async () => {
          const BoardRef = collection(db,`users/${user.uid}/Boards`);
          const snapshot = await getDocs(BoardRef);
          const BoardsTemp = snapshot.docs.map((doc) => ({
            id: doc.id,
              data: doc.data(),
              

          })).filter((board) => board.data.boardVisibility === 'private');;
  
          setBoard(BoardsTemp);
        };
  
        fetchCards().catch((error) => console.error('Error fetching lists:', error));
      } else {
        setBoard([]);
      }
    });
  
    return () => unsubscribeAuth();
  }, []);
  const [createBoard,setCreateBoard]=useState(false);
  return (
  <div>
{( createBoard&&<button onClick={()=>{setCreateBoard(false)}} className="  absolute  text-slate-300  py-1 px-2 left-[90%] sm:left-[70%] sm:top-[-5%] top-[-10%] rounded-xl    text-2xl hover:bg-zinc-900">
&#x2715;
</button>)}
   {!createBoard&&( <div>
      <h1 className='text-gray-300 mt-2 mb-2  p-1 rounded-md text-xl flex justify-center items-center gap-4'>Your Boards</h1>
      <div className='grid grid-cols-2 sm:grid-cols-2 px-0 sm:px-7  md:grid-cols-3 mt-7 mx-4 lg:grid-cols-4 gap-6 overflow-y-auto max-h-[65vh] shadow-sm'>
      {
        Board.map((item) => (
          <MiniBoard
          key={item.id}
          id={item.id}
          title={item.data.title}
          background={item.data.background}
          backgroundImage={item.data.backgroundImage}
          boardVisibility={item.data.boardVisibility}
          />
        ))}
       
       <div onClick={()=>{setCreateBoard(true)}} className=' bg-neutral-700 opacity-90 cursor-pointer hover:opacity-70 border-gray-200 p-5 rounded-sm'>
    <h2  className='text-gray-400 text-center text-sm '>Create new board</h2>
  </div>
</div>

    </div>)}
    {createBoard&&(<CreateBoards/>)}
  </div>
  )
}

