import { forgetMemory, processMemroy,callContact } from "../services/memoryService";
import { greetUser } from "./greeting";
import { launcher } from "../services/jarvisService"; 

export const handleCommand = async (text, actions) =>{
    const command = text.toLowerCase();
    //command for greeting
    if (command.includes("hello jarvis")) {
        const greeting = await greetUser();
        actions.speak(greeting);
        return true;
    }

    //command to take selfie
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

    //command for remembering things
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

    //command to forget memory
    if(command.startsWith("forget")){
        await forgetMemory(text);
        actions.speak(
            "Memory destroyed sir. "
        );
        return true;
    }

    //command to call a person
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

    //command to open aap 
    if(
        command.includes("open")
    ){
        const app=await launcher(text);
        actions.speak(`opening ${app}sir`);
        return true;
    }
    return false;

};