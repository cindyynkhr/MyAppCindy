export default function MainSection() {
  return (
    <main className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <h2 className="font-semibold text-lg">Produk 1</h2>
        <p>Deskripsi produk 1.</p>
      </div>
      <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <h2 className="font-semibold text-lg">Produk 2</h2>
        <p>Deskripsi produk 2.</p>
      </div>
      <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
        <h2 className="font-semibold text-lg">Produk 3</h2>
        <p>Deskripsi produk 3.</p>
      </div>
    </main>
  );
}