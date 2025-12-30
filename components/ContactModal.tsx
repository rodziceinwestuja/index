import React from 'react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const email = "rodziceinwestuja@gmail.com";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col animate-fade-in relative">
        {/* Unified Close Button Style */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-primary hover:border-primary flex items-center justify-center transition-all shadow-sm"
        >
          <i className="fas fa-times"></i>
        </button>

        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-envelope text-3xl"></i>
          </div>
          
          <h3 className="text-2xl font-display font-bold text-primary mb-2">Skontaktuj się z nami</h3>
          <p className="text-gray-500 mb-8 text-sm">Masz pytania lub sugestie? Napisz do nas!</p>
          
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-6 flex items-center justify-center gap-3 group hover:border-accent transition-colors">
            <span className="font-bold text-gray-700 select-all">{email}</span>
          </div>

          <div className="flex flex-col gap-3">
            <a 
              href={`mailto:${email}`}
              className="bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-full font-bold shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <i className="fas fa-paper-plane text-sm"></i> Wyślij wiadomość
            </a>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-primary font-semibold py-2 transition"
            >
              Zamknij
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;