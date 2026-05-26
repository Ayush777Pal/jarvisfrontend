import api from "./api";

export async function sendMessage(message) {
    try {
        const data = await api.post(
            "api/chat/",
            {
                message:message
            }
        );
        return data.reply;
    } catch (error) {
        console.error("Jarvis Error:", error);
        return "Error connecting to Jarvis";
    }
}