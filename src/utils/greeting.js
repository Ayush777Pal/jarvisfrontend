import { getMemory } from "../services/memoryService";

export const greetUser = async () => {
    try {
        const memory = await getMemory("name");
        const name = memory.value;
        const hour = new Date().getHours();
        let greeting = "Good Evening";
        if(hour < 12){
            greeting = "Good Morning";
        }
        else if(hour<17){
            greeting = "Good AfterNoon";
        }
        return `
        Hello ${name} sir.
        ${greeting} sir,
        How may I assist you today?
        `
        
    } catch {
        return `
        Hello Sir,
        How May I assist You today?`;
    }
}