
import {List} from './List';
import { useState,useRef,useEffect} from 'react';
import { collection, onSnapshot,deleteDoc } from 'firebase/firestore'; 
import { onAuthStateChanged } from 'firebase/auth'; 
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth } from './firebase2'; 
import { db } from './firebase2';

export function Bord() {
  const [createList,setcreateList]=useState(false);
  const AddingListRef=useRef(null);
  const AddingAnotherListRef=useRef(null);
  const [title,settitle]=useState('');
  const [lists, setlists] = useState([]);
  const AddAnotherList=(event)=>{
    event.stopPropagation();
    setcreateList(true);
  }
  const ExitFromAddingList=()=>{
    setcreateList(false);
  }
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const ListsRef = collection(db, `users/${user.uid}/Lists`);

        const unsubscribeSnapshot = onSnapshot(
          ListsRef,
          (snapshot) => {
            const ListsRefTemp = snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }));

            setlists(ListsRefTemp);

           
          },
          (error) => {
            console.error('Error fetching lists: ', error);
          }
        );

        return () => unsubscribeSnapshot(); 
      } else {
       
        setlists([]);
      
      }
    });

    return () => unsubscribeAuth(); 
  }, []);
  useEffect(()=>{
    if(!createList){
     return;
    }
       document.addEventListener("click", handleClickOutside);
   return()=>{
     document.removeEventListener("click", handleClickOutside);
 
   };
  },[createList]);
  const AddLists = async () => {
  
    const user = auth.currentUser;
    
    if (user) {
      try {
        const id = new Date().getTime().toString(); 
        const listDocRef = doc(db, `users/${user.uid}/Lists`, id); 
        await setDoc(listDocRef, {
          title: title,  
          id: id,        
     
        });
        console.log('List added successfully');
        ExitFromAddingList();
      } catch (error) {
        console.error('Error adding to Firestore: ', error);
      }
    } else {
      console.error('User is not authenticated');
    }
  };
  const handleClickOutside = (event) => {
    
    if (
      AddingListRef.current &&
      !AddingListRef.current.contains(event.target) 
     
    ) {
      console.log('Click was outside, closing input');
      ExitFromAddingList();
    }
  };
  
  return (
   <div className= ' bg-indigo-600 h-screen flex flex-col overflow-x-auto '>
    <nav className=' bg-gray-800 bg-opacity-50 p-3 text-lg fixed w-screen top-12 '>
      <div className='flex justify-start gap-5' >
        <p className='text-zinc-50  cursor-pointer'>Poject name</p>
        <p className='text-zinc-50 cursor-pointer'>Home</p>
        <p className='text-zinc-50 cursor-pointer'>Bord</p>
        <p className='text-zinc-50 cursor-pointer'>seting</p>
      </div>
  
    </nav>
 
    <div className='BordContainer m-5 flex gap-5 mt-32'>
 
    {lists.map((item)=>(
      
      <List 
      
      key={item.id}
      id={item.id}
      title={item.data.title}
      />))}
      
     {!createList&& (<button ref={AddingAnotherListRef} onClick={AddAnotherList} className='btn w-fit min-w-60 p-4 text-md  py-2.5 rounded-lg bg-slate-200 bg-opacity-35 text-left text-zinc-50 self-start mt-1'>
        + Add another list
      </button>)}
      {createList&&(<div ref={AddingListRef} className='bg-black ListCssCustom p-4 px-2 pt-2.5 rounded-xl h-fit'>
      <div className='mt-1'><input onChange={(e)=>{settitle(e.target.value)}} type='text' placeholder='Enter List name...' className='text:xl p-1.5 px-2.5 rounded-md w-full border-solid border-slate-400 focus:border-solid focus:border-blue-500 focus:box-shadow border-2  focus:outline-none bg-gray-800 text-sm text-slate-300' />
      <div className='mt-3 flex justify-start gap-1.5'>
      <button onClick={AddLists} className="bg-blue-500 hover:bg-blue-600 text-gray-900  py-1 px-2 rounded-md  text-m">
       Add List
</button>
<button onClick={ExitFromAddingList} className=" justify-self-end  text-slate-300  py-1 px-2  rounded-md  text-md hover:bg-gray-800">
&#x2715;
</button>
      </div>

      </div>
      </div>)}
    
    </div>

  </div>
  );
}