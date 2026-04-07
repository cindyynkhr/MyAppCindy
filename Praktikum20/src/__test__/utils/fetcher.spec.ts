import fetcher from "../../utils/swr/fetcher";

describe("SWR Fetcher Utility", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should be a function", () => {
    expect(typeof fetcher).toBe("function");
  });

  it("should fetch and parse JSON response", async () => {
    const mockData = { id: 1, name: "Test Product", price: 100 };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockData,
    });

    const result = await fetcher("http://api.test.com/products");

    expect(global.fetch).toHaveBeenCalledWith("http://api.test.com/products");
    expect(result).toEqual(mockData);
  });

  it("should handle array response", async () => {
    const mockData = [
      { id: 1, name: "Product 1" },
      { id: 2, name: "Product 2" },
    ];
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockData,
    });

    const result = await fetcher("http://api.test.com/products");

    expect(result).toEqual(mockData);
    expect(Array.isArray(result)).toBe(true);
  });

  it("should handle empty response", async () => {
    const mockData: any[] = [];
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockData,
    });

    const result = await fetcher("http://api.test.com/products");

    expect(result).toEqual([]);
    expect(Array.isArray(result)).toBe(true);
  });

  it("should propagate fetch errors", async () => {
    const error = new Error("Network error");
    (global.fetch as jest.Mock).mockRejectedValueOnce(error);

    await expect(fetcher("http://api.test.com/products")).rejects.toThrow(
      "Network error"
    );
  });

  it("should handle different URL paths", async () => {
    const mockData = { status: "ok" };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockData,
    });

    await fetcher("http://api.test.com/categories");

    expect(global.fetch).toHaveBeenCalledWith(
      "http://api.test.com/categories"
    );
  });

  it("should handle response with nested objects", async () => {
    const mockData = {
      data: {
        products: [
          { id: 1, name: "Product 1" },
          { id: 2, name: "Product 2" },
        ],
        total: 2,
      },
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockData,
    });

    const result = await fetcher("http://api.test.com/data");

    expect(result).toEqual(mockData);
    expect(result.data.products).toHaveLength(2);
  });
});
