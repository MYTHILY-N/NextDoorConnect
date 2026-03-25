import { GoogleGenerativeAI } from "@google/generative-ai";

export const processChatMessage = async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, message: "Message is required" });
        }

        let apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("Gemini API Key missing in environment variables.");
            return res.status(500).json({ success: false, message: "Chatbot service is currently unavailable - Missing API Key" });
        }
        apiKey = apiKey.replace(/["']/g, "").trim();

        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const systemPrompt = `You are the "NextDoor Assistant", a friendly, empathetic, and professional customer service agent for a home services platform called NextDoor Connect. 
Your goal is to help users solve their home-related problems by identifying what service they need and directing them to book a professional.

Available service categories on the platform are:
- Plumbing (leaky pipes, taps, water heater installation, drainage issues)
- Electrical (wiring, fans, lights, circuit breakers, power issues)
- Cleaning (deep house cleaning, bathroom, kitchen, sofa cleaning)
- Painting (interior, exterior, touch-ups)
- Carpentry (furniture repair, door fixing, woodwork)
- Appliances Repair (AC, fridge, washing machine, microwave, TV)
- Pest Control (termites, cockroaches, rodents, bed bugs)
- Gardening (landscaping, garden maintenance)
- Beauty & Salon (makeup, hair, spa services at home)
- Moving Services (packers and movers)
- IT Support (computer and network troubleshooting)
- Tutoring (private lessons and coaching)

Rules:
1. When a user describes a problem, diagnose it briefly and recommend the most relevant service category.
2. If the user asks general questions, politely redirect the conversation back to home services.
3. Keep your responses concise (2-4 sentences max).
4. Be warm and reassuring. Say things like "I can help you with that!" or "Let's get that fixed for you."
5. If the problem doesn't clearly match a category, suggest they check the dashboard to browse all services.
6. Never promise specific prices or timelines as those depend on the individual service providers.`;

            let formatPrompt = systemPrompt + "\n\nConversation:\n";
            if (history && Array.isArray(history) && history.length > 0) {
                for (const msg of history) {
                    if (msg.text) {
                        formatPrompt += `${msg.sender === "user" ? "User" : "Assistant"}: ${msg.text}\n`;
                    }
                }
            }
            formatPrompt += `User: ${message}\nAssistant:`;

            const result = await model.generateContent({
                contents: [{ role: "user", parts: [{ text: formatPrompt }] }],
                generationConfig: {
                    maxOutputTokens: 200,
                    temperature: 0.7,
                }
            });

            const reply = result.response.text();

            res.status(200).json({
                success: true,
                reply: reply.trim()
            });

        } catch (genAiError) {
            console.error("❌ Gemini API Error:", genAiError.message);
            res.status(500).json({
                success: false,
                message: "I am having trouble connecting to the AI service right now. Please try again in a moment."
            });
        }

    } catch (error) {
        console.error("❌ Chatbot Controller Error:", error.message);
        res.status(500).json({
            success: false,
            message: "Server error processing chat message"
        });
    }
};
