import TampilanProduk from "../../views/product";
import { ProductType } from "../../types/product.type";
import { retrieveProducts } from "../../utils/db/servicefirebase";

const ProdukPage = (props: { products: ProductType[] }) => {
    const { products } = props;
    return (
        <div>
            <TampilanProduk products={products} />
        </div>
    );
};
export default ProdukPage;

export async function getServerSideProps({ params }: { params: { produk: string } }) {
    // Ambil data langsung dari Firestore, bukan fetch ke API
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${params?.produk}`);
    const response = await res.json();
    //const products = await retrieveProducts("products");
    return {
        props: {
            products: response.data,
        }
    };
}