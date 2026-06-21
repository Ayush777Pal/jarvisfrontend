import { forgetMemory, processMemroy,callContact } from "../services/memoryService";
import { greetUser } from "./greeting";

export const handleCommand = async (text, actions) =>{
    const command = text.toLowerCase();

    if (command.includes("hello jarvis")) {
        const greeting = await greetUser();
        actions.speak(greeting);
        return true;
    }

    if (
        command.includes("take selfie") ||
        command.includes("take a selfie")
    ) {
        actions.setAutoCapture(true);
        actions.setShowCamera(true);

        actions.speak(
            "Capturing selfie in three seconds sir"
        )
        return true;
    }

    if (command.startsWith(
        "remember"
    )) {
        await processMemroy(
            text
        );

        actions.speak(
            "I will rember that sir. "
        );

        return true;
    }

    if(command.startsWith("forget")){
        await forgetMemory(text);
        actions.speak(
            "Memory destroyed sir. "
        );
        return true;
    }
    if(command.startsWith(
        "call "
        ))
    {

        const data = await callContact(text);
        
        window.location.href =`tel:${data.phone_number}`;

        actions.speak(
        "Opening dialer sir"
        );
        return true;
    }
    return false;
};