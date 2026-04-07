jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(() => ({ _key: "mock-db" })),
  collection: jest.fn((db, name) => ({ name })),
  getDocs: jest.fn(),
  getDoc: jest.fn(),
  doc: jest.fn((db, col, id) => ({ id })),
  query: jest.fn(),
  addDoc: jest.fn(),
  where: jest.fn(),
  updateDoc: jest.fn(),
}));

jest.mock("../../utils/db/firebase", () => ({
  __esModule: true,
  default: { appId: "mock-app" },
}));

jest.mock("bcrypt", () => ({
  hash: jest.fn(async (password) => `hashed_${password}`),
  compare: jest.fn(async (password, hash) => password === hash.replace("hashed_", "")),
}));

import {
  retrieveProducts,
  retrieveDataByID,
  signIn,
  signUp,
  signInWithOAuth,
} from "../../utils/db/servicefirebase";
import * as firestore from "firebase/firestore";
import bcrypt from "bcrypt";

describe("Firebase Service Functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("retrieveProducts", () => {
    it("should retrieve all products from collection", async () => {
      const mockProducts = [
        { id: "1", name: "Product 1", price: 100 },
        { id: "2", name: "Product 2", price: 200 },
      ];

      (firestore.getDocs as jest.Mock).mockResolvedValueOnce({
        docs: mockProducts.map((p) => ({
          id: p.id,
          data: () => ({ name: p.name, price: p.price }),
        })),
      });

      const result = await retrieveProducts("products");

      expect(firestore.collection).toHaveBeenCalledWith(
        expect.anything(),
        "products"
      );
      expect(firestore.getDocs).toHaveBeenCalled();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should handle empty collection", async () => {
      (firestore.getDocs as jest.Mock).mockResolvedValueOnce({
        docs: [],
      });

      const result = await retrieveProducts("products");

      expect(result).toEqual([]);
    });

    it("should convert document ids correctly", async () => {
      const mockDocs = [
        {
          id: "doc1",
          data: () => ({ name: "Test" }),
        },
      ];

      (firestore.getDocs as jest.Mock).mockResolvedValueOnce({
        docs: mockDocs,
      });

      const result = await retrieveProducts("products");

      expect(result[0].id).toBe("doc1");
    });
  });

  describe("retrieveDataByID", () => {
    it("should retrieve single document by ID", async () => {
      const mockData = { name: "Product", price: 100 };

      (firestore.getDoc as jest.Mock).mockResolvedValueOnce({
        data: () => mockData,
      });

      const result = await retrieveDataByID("products", "doc1");

      expect(firestore.doc).toHaveBeenCalled();
      expect(firestore.getDoc).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });

    it("should return undefined for non-existent document", async () => {
      (firestore.getDoc as jest.Mock).mockResolvedValueOnce({
        data: () => undefined,
      });

      const result = await retrieveDataByID("products", "nonexistent");

      expect(result).toBeUndefined();
    });
  });

  describe("signIn", () => {
    it("should find user by email", async () => {
      const mockUser = {
        id: "user1",
        data: () => ({ email: "test@example.com", fullName: "Test User" }),
      };

      (firestore.getDocs as jest.Mock).mockResolvedValueOnce({
        docs: [mockUser],
      });

      const result = await signIn("test@example.com");

      expect(firestore.query).toHaveBeenCalled();
      expect(firestore.where).toHaveBeenCalledWith("email", "==", "test@example.com");
      expect(result).toBeTruthy();
    });

    it("should return null when user not found", async () => {
      (firestore.getDocs as jest.Mock).mockResolvedValueOnce({
        docs: [],
      });

      const result = await signIn("notfound@example.com");

      expect(result).toBeUndefined();
    });
  });

  describe("signUp", () => {
    it("should register new user successfully", async () => {
      const callback = jest.fn();

      (firestore.getDocs as jest.Mock).mockResolvedValueOnce({
        docs: [],
      });

      (firestore.addDoc as jest.Mock).mockResolvedValueOnce({
        id: "newuser1",
      });

      await signUp(
        {
          email: "newuser@example.com",
          fullName: "New User",
          password: "password123",
        },
        callback
      );

      expect(firestore.addDoc).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
      expect(callback).toHaveBeenCalledWith({
        status: "success",
        message: "User registered successfully",
      });
    });

    it("should reject duplicate email", async () => {
      const callback = jest.fn();
      const existingUser = {
        id: "existing",
        data: () => ({ email: "test@example.com" }),
      };

      (firestore.getDocs as jest.Mock).mockResolvedValueOnce({
        docs: [existingUser],
      });

      await signUp(
        {
          email: "test@example.com",
          fullName: "Test",
          password: "pass123",
        },
        callback
      );

      expect(callback).toHaveBeenCalledWith({
        status: "error",
        message: "User already exists",
      });
      expect(firestore.addDoc).not.toHaveBeenCalled();
    });

    it("should handle registration errors", async () => {
      const callback = jest.fn();

      (firestore.getDocs as jest.Mock).mockRejectedValueOnce(
        new Error("Database error")
      );

      await signUp(
        {
          email: "test@example.com",
          fullName: "Test",
          password: "pass123",
        },
        callback
      );

      expect(callback).toHaveBeenCalledWith({
        status: "error",
        message: "An error occurred during registration",
      });
    });
  });

  describe("signInWithOAuth", () => {
    it("should update existing oauth user", async () => {
      const callback = jest.fn();
      const userData = {
        email: "oauth@example.com",
        fullName: "OAuth User",
      };

      const existingUser = {
        id: "user1",
        data: () => ({ role: "user" }),
      };

      (firestore.getDocs as jest.Mock).mockResolvedValueOnce({
        docs: [existingUser],
      });

      (firestore.updateDoc as jest.Mock).mockResolvedValueOnce(undefined);

      await signInWithOAuth(userData, callback);

      expect(firestore.updateDoc).toHaveBeenCalled();
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          status: true,
          message: "User registered and logged in",
        })
      );
    });

    it("should create new oauth user", async () => {
      const callback = jest.fn();
      const userData = {
        email: "newoauth@example.com",
        fullName: "New OAuth User",
      };

      (firestore.getDocs as jest.Mock).mockResolvedValueOnce({
        docs: [],
      });

      (firestore.addDoc as jest.Mock).mockResolvedValueOnce({
        id: "newoauthuser",
      });

      await signInWithOAuth(userData, callback);

      expect(firestore.addDoc).toHaveBeenCalled();
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          status: true,
          message: "User registered and logged in",
        })
      );
    });

    it("should handle oauth registration errors", async () => {
      const callback = jest.fn();

      (firestore.getDocs as jest.Mock).mockRejectedValueOnce(
        new Error("Connection error")
      );

      await signInWithOAuth(
        { email: "test@example.com" },
        callback
      );

      expect(callback).toHaveBeenCalledWith({
        status: false,
        message: "Failed to register user",
      });
    });
  });
});
