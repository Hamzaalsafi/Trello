import React, {CardsContext , useState, useRef,forwardRef , useEffect } from 'react';
import { Card } from './Card';
import { collection,updateDoc, onSnapshot,getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore'; 
import { db } from './firebase2'; 
import { auth } from './firebase2';
import { onAuthStateChanged } from 'firebase/auth'; 
import { DndContext,TouchSensor, closestCenter, useSensor, useSensors, MouseSensor } from '@dnd-kit/core';

import { useMenuContext } from './MenuProvider';
import { useSortable } from '@dnd-kit/sortable';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';

export const List = forwardRef(({item,Dragging, title, id,BoardId }, ref) => {
  const [createCard, setCreateCard] = useState(false);
  const AddingListRef = useRef(null);
  const [cardTitle, setCardTitle] = useState('');
  
  const [cards, setCards] = useState([]);
  const { menuOpen } = useMenuContext();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    disabled: menuOpen 
  });
 
  const handleTouchStart = (event) => {
    const touch = event.touches[0]; // Get the first touch point
    const element = event.target;
  
    // Check if the touch point is within the bounds of the scrollbar
    const isScrollbarArea = element.offsetWidth > 0 && touch.clientX >= element.clientWidth;
  
    if (isScrollbarArea) {
      event.stopPropagation(); // Prevent dragging if the touch is on the scrollbar
    }
  };
const handleMouseDown = (event) => {
  const element = event.target;


  const isScrollbarClick =
    element.offsetWidth > 0 && event.clientX >= element.clientWidth;

  if (isScrollbarClick) {
 
    event.stopPropagation();
  }
};



  const prevent=(event)=>{
    event.preventDefault();
  }
  // const deleteList = async (listId) => {
  //   const user = auth.currentUser;

  //   if (user) {
  //     try {
  //       const listDocRef = doc(db, `users/${user.uid}/Lists`, id);
        
  //       await deleteDoc(listDocRef);
  //       console.log(`List with ID ${listId} has been deleted.`);
  //     } catch (error) {
  //       console.error('Error deleting list: ', error);
  //     }
  //   } else {
  //     console.error('User is not authenticated');
  //   }
  // };


  const addCard = async () => {
    const user = auth.currentUser;
  
    if (user) {
      try {
        setCardTitle('');
        const cardId = new Date().getTime().toString();
        const cardDocRef = doc(db,`users/${user.uid}/Boards/${BoardId}/Lists/${id}/cards`, cardId);
        const labels = {
          label1: false,
          label2: false,
          label3: false,
          label4: false,
          label5: false,
          label6: false,
          label7: false,
          label8: false
        };
  
        const newCard = { id: cardId, title: cardTitle, labels };
  
        setCards((prevCards) => [...prevCards, newCard]);
  
        await setDoc(cardDocRef, {
          id: cardId,
          title: cardTitle,
          labels:labels,
          order:cards.length
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
        const fetchCards = async () => {
          const cardRef = collection(db,`users/${user.uid}/Boards/${BoardId}/Lists/${id}/cards`);
          const snapshot = await getDocs(cardRef);
          const cardsTemp = snapshot.docs.map((doc) => ({
            id: doc.id,
            title: doc.data().title,
            labels: doc.data().labels,
            order: doc.data().order
          })).sort((a, b) =>a.order - b.order);
  
          setCards(cardsTemp);
        };
  
        fetchCards().catch((error) => console.error('Error fetching cards:', error));
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

 
  
  const handleDragEnd = async (event) => {

    const { active, over } = event;
  
    if (active.id !== over?.id) {
      const user = auth.currentUser;
  
      if (user) {
        const oldIndex = cards.findIndex((item) => item.id === active.id);
        const newIndex = cards.findIndex((item) => item.id === over.id);
  
        if (oldIndex !== -1 && newIndex !== -1) {
          const updatedItems = arrayMove(cards, oldIndex, newIndex);
  
          try {
            setCards(updatedItems);
  
            const updatePromises = updatedItems.map((item, index) =>
              updateDoc(doc(db, `users/${user.uid}/Boards/${BoardId}/Lists/${id}/cards`, item.id), {
                order: index,
                title: item.title,
                labels: item.labels,
              })
            );
  
            await Promise.all(updatePromises);
          } catch (error) {
            console.error('Error updating cards:', error);
          }
        }
      } else {
        console.error('User is not authenticated');
      }
    }
  };
  const [isPhone, setIsPhone] = useState(window.innerWidth <= 650);

  useEffect(() => {
    const handleResize = () => {
      setIsPhone(window.innerWidth <= 650);
    };


    window.addEventListener('resize', handleResize);

  
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, 0, 20px) rotate(${isDragging ? -2 : 0}deg)` 
      : undefined,
    transition,
    backgroundColor: isDragging ? 'rgba(0, 0, 0, 0.8)' : '',
    cursor: isDragging ? 'grabbing' : 'pointer',
    zIndex: isDragging ? 10 : 'auto',
   
 
  };
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor) 
  );
  
  return (
<div style={style} className={`bg-black ListCssCustom p-4 px-3 pt-2.5 shadow-xl  rounded-xl h-fit ${Dragging&&!isDragging ? 'swing' : ''} ${!Dragging||!isDragging ? 'snap-start' : ''}  ${isDragging?'dragList': ""}`}>
    <div 
      ref={setNodeRef}
      {...attributes}
      {...listeners}
     
      onContextMenu={prevent}
   
    >
      <div className="flex overflow-x-hidden justify-between items-start">
        <h3 className="focus:border-solid focus:border-blue-500 focus:box-shadow focus:outline-none text-slate-300 px-1 text-lg mt-1.5 w-full mr-2">
          {title}
        </h3>
        <button onClick={() => deleteList(id)} className="text-slate-300 text-xl">...</button>
      </div>
    
      <div     onTouchStart={handleTouchStart}  onMouseDown={handleMouseDown}  className=" flex  pr-1.5 flex-col justify-start kkkk my-3 items-center">
    
        <DndContext sensors={sensors} collisionDetection={closestCenter}  onDragEnd={handleDragEnd}>
          <SortableContext items={cards} strategy={verticalListSortingStrategy}>
            {cards.map((item) => (
              <Card 
              BoardId={BoardId}
                key={item.id} 
                listid={id}
                title={item.title}  
                id={item.id} 
                labels={item.labels}
                item={item}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

        </div>
        <div>
      {!createCard && (
        <button 
          onClick={AddAnotherList} 
          className="text-slate-300 text-opacity-95 hover:opacity-100 hover:bg-zinc-800 hover:bg-opacity-90 hover:shadow-xl w-full text-start px-1.5 py-1  rounded-md"
        >
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
            onInput={(e) => { 
              e.target.style.height = 'auto'; 
              e.target.style.height = `${e.target.scrollHeight + 15}px`; 
            }}
            onClick={(e) => e.stopPropagation()} 
          />
          <div className='mt-3 flex justify-start gap-1.5'>
            <button 
              onClick={addCard} 
              className='bg-blue-500 hover:bg-blue-600 text-gray-900 py-1 px-2 rounded-md text-m'
            >
              Add Card
            </button>
            <button 
              onClick={() => setCreateCard(false)} 
              className='text-slate-300 py-1 px-2  rounded-md text-md hover:bg-gray-800'
            >
              &#x2715;
            </button>
          </div>
        </div>
      )}
    </div>
     </div>
  );
  
})