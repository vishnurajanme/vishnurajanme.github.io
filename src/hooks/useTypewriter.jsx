import { useState, useEffect } from "react";

export default function useTypewriter(roles) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    let charIndex = 0;
    const currentRole = roles[roleIndex];
    let typingTimer;
    let backspaceTimer;

    const typeWriter = () => {
      if (charIndex < currentRole.length) {
        setDisplayedText(currentRole.substring(0, charIndex + 1));
        charIndex++;
        typingTimer = setTimeout(typeWriter, 70);
      } else {
        setIsTyping(false);
        backspaceTimer = setTimeout(backspace, 2000);
      }
    };

    const backspace = () => {
      if (charIndex > 0) {
        setDisplayedText(currentRole.substring(0, charIndex - 1));
        charIndex--;
        backspaceTimer = setTimeout(backspace, 50);
      } else {
        setIsTyping(true);
        setRoleIndex((prevIndex) => (prevIndex + 1) % roles.length);
      }
    };
    
    const initialDelay = setTimeout(typeWriter, 500);

    return () => {
      clearTimeout(initialDelay);
      clearTimeout(typingTimer);
      clearTimeout(backspaceTimer);
    };
  }, [roleIndex, roles]);

  return { displayedText, isTyping };
}