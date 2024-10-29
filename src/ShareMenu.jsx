import { useState,useRef,useEffect} from 'react';
import { collection,setDoc, getDocs,updateDoc,doc } from 'firebase/firestore';
import { db,auth } from './firebase2';

export function ShareMenu( {BoardMember,visibility,id,Board}) {
    const [boardMember,setBoardMember]=useState(BoardMember);
    const [email,setEmail]=useState("");

    const addMembers = async () => {

        try {
          if (!email) {
            console.error("Email is required.");
            return;
          }
          const usersCollection = collection(db, 'users');
          const querySnapshot = await getDocs(usersCollection);
          let foundUser = null;
          querySnapshot.forEach((doc) => {
            const userData = doc.data();
            if (userData.email === email) {
              foundUser = { id: doc.id, ...userData };
              console.log("User found: ", foundUser);
            }
          });
          if (!foundUser) {
            console.log("No user found with that email.");
          } else {

            setBoardMember([...boardMember, foundUser]);
      
            try {
                
                await updateDoc( doc(db, `users/${boardMember[0].id}/Boards/${id}`), { sharedWith:[...boardMember, foundUser] });
                const BoardDocRef = doc(db, `users/${foundUser.id}/Boards`, id);
                await setDoc(BoardDocRef, Board);
               
              } catch (error) {
                console.error("Error updating card title: ", error);
              }
          }
        } catch (error) {
          console.error("Error fetching users: ", error);
        }
      }
    return (
        
        <div className='bg-zinc-800 flex flex-col absolute  sm:top-24 top-[5.55em] z-[10000]   right-3  h-fit w-fit py-3 rounded-lg px-3.5 justify-start'>
     {visibility==="private"&&( <div className='w-[100%]  top-[-.2%]  p-1 right-[.1px]  h-[100%] absolute rounded-lg bg-zinc-950 bg-opacity-90 flex justify-center items-center'>
        <div className='flex flex-col'>
        <h1 className='text-gray-300 text-center text-lg'>This Board is private.</h1>
        <p className='text-gray-300 text-center text-sm'>To share it with others,switch it to shareable mode.</p>
        </div>
      </div>)}
      <h1 className='text-gray-300 text-lg'>Share Board</h1>
      <div > 
        <div  className='flex gap-2.5 mt-4'>
        <input onChange={(e)=>{setEmail(e.target.value)}} value={email} type='email' required={true} placeholder='Enter Email address' className='text:xl p-1.5 px-2.5 pr-12 h-fit rounded-md  border-solid border-slate-400 focus:border-solid focus:border-blue-500 focus:box-shadow border-2  focus:outline-none bg-gray-800 text-sm text-slate-300'/>
        <button onClick={addMembers} type='submit' className=' text-zinc-800 bg-blue-500 hover:bg-blue-600 h-fit p-1.5 px-2 rounded-md'>
          Share
        </button>
        </div>
      </div>
      <div className='mt-7'>
        <h3 className='text-gray-300 text-[.9rem]'>Board members <span className=' rounded-[50%] w-fit h-fit  p-.5 px-1 bg-slate-600 text-gray-300'>{boardMember.length}</span></h3>
        <hr className="w-full h-px mt-1  bg-gray-200 border-0 dark:bg-gray-500 opacity-90"/>
      </div>
      <div>
        {
            boardMember.map((member,index) =>(
              <div key={member.id} className='mt-1 flex items-center gap-2'>
      
                 <div >
                 <div className=' pointer-events-none select-none'
                  style={{
                     backgroundColor: member.avatar.color,
                     color: '#fff',
                     width: '36px',
                     height: '36px',
                     borderRadius: '50%',
                      display: 'flex',
                     alignItems: 'center',
                      justifyContent: 'center',
                     fontWeight: 'bold',
                      fontSize: '18px',
                    border: '1.5px solid #555'
                    }}
                >
                 {member.avatar.initials}
                  </div>
                </div> 
                <div>  
                <h1 className='text-gray-300 text-opacity-95'>{member.name} {index===0?"(you)":""} </h1>
                <p className='text-gray-300 text-sm -mt-1 text-opacity-85'>@{member.email} </p>
                </div>
              </div>
        
            ))

  
        }
      </div>
    </div>
  )
}


