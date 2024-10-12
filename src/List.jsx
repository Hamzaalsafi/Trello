import React, { useState, useRef, useEffect } from 'react';
import { Card } from './Card';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore'; 
import { db } from './firebase2'; 
import { auth } from './firebase2';
import { onAuthStateChanged } from 'firebase/auth'; 

export function List({ title, id }) {
  const [createCard, setCreateCard] = useState(false);
  const AddingListRef = useRef(null);
  const [cardTitle, setCardTitle] = useState('');
  const [cards, setCards] = useState([]);

  
  const deleteList = async (listId) => {
    const user = auth.currentUser;

    if (user) {
      try {
        const listDocRef = doc(db, `users/${user.uid}/Lists`, id);
        await deleteDoc(listDocRef);
        console.log(`List with ID ${listId} has been deleted.`);
      } catch (error) {
        console.error('Error deleting list: ', error);
      }
    } else {
      console.error('User is not authenticated');
    }
  };

  // Add a new card to Firestore
  const addCard = async () => {
    const user = auth.currentUser;

    if (user) {
      try {
        setCardTitle(''); 
        const cardId = new Date().getTime().toString(); 
        const cardDocRef = doc(db, `users/${user.uid}/Lists/${id}/cards`, cardId);  

        await setDoc(cardDocRef, {
          id: cardId, 
          title: cardTitle 
        });

        console.log('Card added successfully');
        

      } catch (error) {
        console.error('Error adding card to Firestore: ', error);
      }
    } else {
      console.error('User is not authenticated');
    }
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const cardRef = collection(db, `users/${user.uid}/Lists/${id}/cards`);  

        const unsubscribeSnapshot = onSnapshot(
          cardRef,
          (snapshot) => {
            const cardsTemp = snapshot.docs.map((doc) => ({
              id: doc.id,
              title: doc.data().title, 
            }));

            setCards(cardsTemp);
          },
          (error) => {
            console.error('Error fetching cards: ', error);
          }
        );

        return () => unsubscribeSnapshot();
      } else {
        setCards([]);
      }
    });

    return () => unsubscribeAuth();
  }, [id]);


  useEffect(() => {
    if (!createCard) {
      return;
    }

    const handleClickOutside = (event) => {
      if (AddingListRef.current && !AddingListRef.current.contains(event.target)) {
        ExitFromAddingList();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [createCard]);

  const AddAnotherList = (event) => {
    event.stopPropagation();
    setCreateCard(true);
  };

  const ExitFromAddingList = () => {
    setCreateCard(false);
  };

  return (
    <div className="bg-black ListCssCustom p-4 px-3 pt-2.5 rounded-xl h-fit">
      <div className="flex justify-between items-start">
        <h3 contenteditable ='true' className="focus:border-solid focus:border-blue-500 focus:box-shadow   focus:outline-none text-slate-300 px-1 text-lg mt-1.5  w-full mr-2">{title}</h3>
        <button onClick={() => deleteList(id)} className="text-slate-300 text-xl">...</button>
      </div>
      <div className="flex flex-col justify-start my-3 items-center ">
        {cards.map((item) => (
          <Card 
            key={item.id} 
            title={item.title}  
            id={item.id} 
          />
        ))}
      </div>
      {!createCard && (
        <button onClick={AddAnotherList} className="text-slate-300 opacity-80 hover:opacity-100 hover:bg-slate-800 hover:bg-opacity-70 hover:shadow-xl w-full text-start px-1.5 py-1 text-base rounded-md">
          + Add a card
        </button>
      )}

{createCard && (
        <div className='mt-1' ref={AddingListRef}>
          <textarea
            placeholder='Enter card title...'
            className='pb-5 pt-1 h-16 text-start px-2.5 rounded-md w-full border-solid border-slate-400 border-0 focus:outline-none bg-gray-800 text-slate-300 resize-none overflow-hidden'
            onChange={(e) => setCardTitle(e.target.value)}
            value={cardTitle}
            rows='1'
            onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = `${e.target.scrollHeight + 15}px`; }}
          />
          <div className='mt-3 flex justify-start gap-1.5'>
            <button onClick={addCard} className='bg-blue-500 hover:bg-blue-600 text-gray-900 py-1 px-2 rounded-md text-m'>
              Add Card
            </button>
            <button onClick={() => setCreateCard(false)} className='text-slate-300 py-1 px-2 rounded-md text-md hover:bg-gray-800'>
              &#x2715;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
