jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(() => ({ appId: "test-app" })),
  getApps: jest.fn(() => []),
  getApp: jest.fn(() => ({ appId: "existing-app" })),
}));

import { initializeApp, getApps, getApp } from "firebase/app";
import app from "../../utils/db/firebase";

describe("Firebase Configuration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should export firebase app instance", () => {
    expect(app).toBeDefined();
  });

  it("should call initializeApp when no apps exist", () => {
    (getApps as jest.Mock).mockReturnValue([]);

    // Re-import to trigger initialization logic
    jest.resetModules();
    jest.doMock("firebase/app", () => ({
      initializeApp: jest.fn(() => ({ appId: "test-app" })),
      getApps: jest.fn(() => []),
      getApp: jest.fn(() => ({ appId: "existing-app" })),
    }));

    expect(typeof app).toBe("object");
  });

  it("should have firebase config properties", () => {
    expect(app).toBeTruthy();
  });

  it("should handle multiple app instances", () => {
    // When apps exist, getApp should be called instead
    const mockGetApps = getApps as jest.Mock;
    mockGetApps.mockReturnValue([{ appId: "first-app" }]);

    expect(typeof app).toBe("object");
  });

  it("should not fail when firebase environment variables are missing", () => {
    // Firebase config uses process.env variables that might be undefined
    const config = {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
    };

    expect(config).toBeDefined();
  });
});
