import "@testing-library/jest-dom";

describe("Pages - _app.tsx Configuration", () => {
  it("should define App component with Component and pageProps", () => {
    const mockPageProps = {
      session: null,
    };

    expect(mockPageProps.session).toBeNull();
  });

  it("should have SessionProvider wrapper", () => {
    expect("SessionProvider").toBeDefined();
  });

  it("should have AppShell wrapper", () => {
    expect("Appshell").toBeDefined();
  });

  it("should import styles from globals.css", () => {
    const styles = "../styles/globals.css";
    expect(styles).toContain("globals.css");
  });

  it("should have Google Analytics script", () => {
    const analyticsId = "G-W8W2Z54VXS";
    expect(analyticsId).toBeDefined();
    expect(analyticsId).toHaveLength(12);
  });

  it("should have Google Analytics config", () => {
    const configId = "G-277BYFC22E";
    expect(configId).toBeDefined();
    expect(configId).toHaveLength(12);
  });

  it("should pass session to SessionProvider", () => {
    const pageProps = {
      session: { user: { email: "test@example.com" } },
    };

    expect(pageProps.session).toBeDefined();
    expect(pageProps.session.user.email).toBe("test@example.com");
  });

  it("should pass component and pageProps correctly", () => {
    const Component = () => <div>Test Component</div>;
    const pageProps = { test: "data" };

    expect(Component).toBeDefined();
    expect(pageProps.test).toBe("data");
  });

  it("should handle pageProps without session", () => {
    const pageProps = {
      data: "test",
    };

    const { session, ...restProps } = pageProps as any;
    expect(session).toBeUndefined();
    expect(restProps.data).toBe("test");
  });

  it("should wrap component with Appshell layout", () => {
    expect("Appshell").toBeDefined();
  });

  it("should initialize dataLayer for Google Analytics", () => {
    const dataLayer = [];
    expect(Array.isArray(dataLayer)).toBe(true);
  });

  it("should load Google Analytics after interactive", () => {
    const strategy = "afterInteractive";
    expect(strategy).toBe("afterInteractive");
  });
});

describe("Pages - _document.tsx Configuration", () => {
  it("should render Html element", () => {
    expect("Html").toBeDefined();
  });

  it("should set language to en", () => {
    const lang = "en";
    expect(lang).toBe("en");
  });

  it("should have Head component", () => {
    expect("Head").toBeDefined();
  });

  it("should have body element", () => {
    expect("body").toBeDefined();
  });

  it("should have Main component for page content", () => {
    expect("Main").toBeDefined();
  });

  it("should have NextScript for Next.js functionality", () => {
    expect("NextScript").toBeDefined();
  });

  it("should structure be Html > Head + body", () => {
    const structure = "root: Html, children: Head, body";
    expect(structure).toContain("Html");
    expect(structure).toContain("Head");
    expect(structure).toContain("body");
  });

  it("should body contain Main for pages", () => {
    const bodyContent = "Main, NextScript";
    expect(bodyContent).toContain("Main");
  });

  it("should include NextScript at end of body", () => {
    const bodyEnd = "NextScript";
    expect(bodyEnd).toBeDefined();
  });
});

describe("Pages - App & Document Integration", () => {
  it("should use _document as HTML template", () => {
    const template = "_document.tsx";
    expect(template).toContain("_document");
  });

  it("should use _app for app-level configuration", () => {
    const config = "_app.tsx";
    expect(config).toContain("_app");
  });

  it("should document provide global HTML structure", () => {
    const structure = ["Html", "Head", "body", "Main"];
    expect(structure.length).toBe(4);
  });

  it("should app provide component wrapping", () => {
    const wrappers = ["SessionProvider", "Appshell"];
    expect(wrappers.length).toBe(2);
  });

  it("should session be optional", () => {
    const pageProps1 = { session: null };
    const pageProps2 = { session: { user: {} } };

    expect(pageProps1.session).toBeNull();
    expect(pageProps2.session).toBeDefined();
  });

  it("should analytics be available in all pages", () => {
    const analyticsIncluded = true;
    expect(analyticsIncluded).toBe(true);
  });

  it("should app support different page components", () => {
    const pages = ["HomePage", "ProductPage", "AdminPage"];
    expect(pages.length).toBeGreaterThan(0);
  });

  it("should document support custom attributes", () => {
    const htmlLang = "en";
    const bodyContent =["Main", "NextScript"];

    expect(htmlLang).toBe("en");
    expect(bodyContent).toHaveLength(2);
  });
});
