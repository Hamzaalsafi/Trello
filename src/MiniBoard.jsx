import React, { useEffect, useRef, useState } from 'react';
import { auth } from './firebase2';
import { useNavigate } from 'react-router-dom';

export function MiniBoard(Board) {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 } // Adjust this value as needed
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [ref]);

    const style = isVisible && Board.backgroundImage ? {
        backgroundImage: `url('${Board.backgroundImage}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "rgba(255,255,255,0)"
    } : {};

    const BoardClick = () => {
        navigate(`/Trello/Board/${Board.id}`, { state: Board });
    };

    return (
        <div ref={ref} style={style} onClick={BoardClick} className={`p-5 min-w-[130px] hover:opacity-85 cursor-pointer rounded-sm ${Board.background}`}>
            <h2 className='text-zinc-50 text-lg truncate whitespace-nowrap overflow-hidden'>{Board.title}</h2>
        </div>
    );
}
