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

export async function launcher(text) {
    const APPS = {
    youtube: "https://www.youtube.com",
    github: "https://github.com",
    gmail: "https://mail.google.com",
    chatgpt: "https://chatgpt.com",
    spotify: "https://open.spotify.com",
    linkedin: "https://linkedin.com",
    instagram: "https://instagram.com",
    reddit: "https://reddit.com",
    amazon: "https://amazon.in",
    netflix: "https://netflix.com",
    };
    try {
        const response = await api.post(
            "api/extract/",
            {
                text
            }
        )
        let app = response.app;
        if (APPS[app]) {
            window.open(APPS[app], "_blank");
        } else {
            window.open(
                `https://www.google.com/search?q=${encodeURIComponent(app)}`,
                "_blank"
            );
        }

        return app;
    } catch (error) {
        console.error("Jarvis Error:", error);
        return "Error in opening app";
    }
}