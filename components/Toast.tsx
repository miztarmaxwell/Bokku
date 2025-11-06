import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  onClose: () => void;
}

const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-300 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true);
        const timer = setTimeout(() => {
            setVisible(false);
            // Allow time for fade-out animation before calling onClose
            setTimeout(onClose, 300);
        }, 3000);

        return () => {
            clearTimeout(timer);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [message, onClose]);


    return (
        <div 
            className={`fixed bottom-5 right-5 flex items-center bg-[#002D7A] text-white py-3 px-5 rounded-lg shadow-2xl transition-all duration-300 ease-in-out transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}
        >
            <CheckCircleIcon />
            <span>{message}</span>
        </div>
    );
};