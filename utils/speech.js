export const speak = (text, onEnd = null) =>{
    speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    const trySpeak = () =>{
        const voices = speechSynthesis.getVoices();
        const preferred = voices.find(
            (v)=>
                v.name.includes("David") || 
                v.name.includes("Daniel") ||
                (name.includes("google uk english") && v.lang === "en-GB")||
                v.name.includes("Alex")
        );

        if (preferred) {
            utt.voice = preferred;
        }
        utt.pitch = 0.75;
        utt.rate = 0.88;
        utt.volume = 1;
        
        if (onEnd) {
            utt.onend = onEnd;
        }

        speechSynthesis.speak(utt);
    };
    if (speechSynthesis.getVoices().length === 0) {
        speechSynthesis.onvoiceschanged = trySpeak;
    }else{
        trySpeak();
    }
};