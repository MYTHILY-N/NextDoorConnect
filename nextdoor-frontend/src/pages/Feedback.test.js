import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Feedback from "./Feedback";

describe("Feedback Component", () => {
    test("renders feedback form correctly", () => {
        render(<Feedback />);
        expect(screen.getByText(/We Value Your Feedback/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email or Phone/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Message/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Send Feedback/i })).toBeInTheDocument();
    });

    test("shows validation errors on empty submit", async () => {
        render(<Feedback />);
        const submitBtn = screen.getByRole("button", { name: /Send Feedback/i });

        fireEvent.click(submitBtn);

        expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Email or Phone is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Message is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Please select a rating/i)).toBeInTheDocument();
    });

    test("validates email/phone format", () => {
        render(<Feedback />);
        const contactInput = screen.getByLabelText(/Email or Phone/i);
        const submitBtn = screen.getByRole("button", { name: /Send Feedback/i });

        // Invalid email/phone
        fireEvent.change(contactInput, { target: { value: "invalid-contact" } });
        fireEvent.click(submitBtn);
        expect(screen.getByText(/Please enter a valid Email or Phone Number/i)).toBeInTheDocument();

        // Valid email
        fireEvent.change(contactInput, { target: { value: "test@example.com" } });
        fireEvent.click(submitBtn);
        expect(screen.queryByText(/Please enter a valid Email or Phone Number/i)).not.toBeInTheDocument();

        // Valid phone
        fireEvent.change(contactInput, { target: { value: "1234567890" } });
        fireEvent.click(submitBtn);
        expect(screen.queryByText(/Please enter a valid Email or Phone Number/i)).not.toBeInTheDocument();
    });

    test("submits form successfully", async () => {
        render(<Feedback />);

        // Fill form
        fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: "Test User" } });
        fireEvent.change(screen.getByLabelText(/Email or Phone/i), { target: { value: "test@example.com" } });
        fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: "Great service!" } });

        // Rate 5 stars
        const star5 = screen.getByLabelText(/Rate 5 stars/i);
        fireEvent.click(star5);

        // Submit
        const submitBtn = screen.getByRole("button", { name: /Send Feedback/i });
        fireEvent.click(submitBtn);

        // Check success message
        await waitFor(() => {
            expect(screen.getByText(/Thank You!/i)).toBeInTheDocument();
            expect(screen.getByText(/Your feedback has been submitted successfully/i)).toBeInTheDocument();
        });
    });
});
