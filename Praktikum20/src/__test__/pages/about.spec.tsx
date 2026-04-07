import { render,screen } from "@testing-library/react";
import AboutPage from "../../pages/about";

describe("About Page", () => {
    it("renders the about page correctly", () => {
        const page = render(<AboutPage />);
        //expect(screen.getByTestId("title").textContent).toBe("About Page");
        expect(page).toMatchSnapshot();
    });
});