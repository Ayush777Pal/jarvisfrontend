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
    return false;
};