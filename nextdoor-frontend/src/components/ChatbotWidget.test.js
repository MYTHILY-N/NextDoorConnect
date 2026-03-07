import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ChatbotWidget from "./ChatbotWidget";

describe("ChatbotWidget Component", () => {
    beforeEach(() => {
        // Mock scrollIntoView since it's not supported in JSDOM
        window.HTMLElement.prototype.scrollIntoView = jest.fn();
    });

    test("renders toggle button initially", () => {
        render(<ChatbotWidget />);
        // Check for emojis or specific class/elements if text isn't present
        // The toggle button contains a 💬 icon
        expect(screen.getByText("💬")).toBeInTheDocument();
        expect(screen.queryByText("NextDoor Assistant")).not.toBeInTheDocument();
    });

    test("opens chat window when toggled", () => {
        render(<ChatbotWidget />);
        const toggleBtn = screen.getByText("💬");
        fireEvent.click(toggleBtn);

        expect(screen.getByText("NextDoor Assistant")).toBeInTheDocument();
        expect(screen.getByText(/Hi there/i)).toBeInTheDocument();
    });

    test("sends user message and receives bot response", async () => {
        render(<ChatbotWidget />);
        fireEvent.click(screen.getByText("💬"));

        const input = screen.getByPlaceholderText(/Type a message/i);
        const sendBtn = screen.getByText("Send");

        // Type and send message
        fireEvent.change(input, { target: { value: "I need a plumber" } });
        fireEvent.click(sendBtn);

        // Check user message appeared
        expect(screen.getByText("I need a plumber")).toBeInTheDocument();

        // Check input cleared
        expect(input.value).toBe("");

        // Wait for bot response (mocked delay)
        await waitFor(() => {
            expect(screen.getByText(/It looks like you have a plumbing issue/i)).toBeInTheDocument();
        }, { timeout: 2000 });
    });
});
