import TampilanProduk from "../../views/product";
import { ProductType } from "../../types/product.type";

const halamanProdukServer = (props: {products: ProductType[]}) => {
    const { products } = props;
    return (
        <div>
            <h1>Halaman Produk Server</h1>
            <TampilanProduk products={products} />
        </div>
    );
};
export default halamanProdukServer;

export async function getServerSideProps() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
    const response = await res.json();
    return {
        props: {
            products: response.data,
        }
    };
}