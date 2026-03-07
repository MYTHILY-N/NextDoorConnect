import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Dashboard from "./Dashboard";

test("simple render test", () => {
    render(
        <BrowserRouter>
            <Dashboard />
        </BrowserRouter>
    );
    expect(true).toBe(true);
});
