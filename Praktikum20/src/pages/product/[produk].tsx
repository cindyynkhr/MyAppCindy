import DetailProduk from "../../views/detailProduct";
import { ProductType } from "../../types/product.type";

const ProdukPage = (props: { product: ProductType }) => {
    const { product } = props;
    return (
        <div>
            <DetailProduk product={product} />
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
            product: response.data,
        }
    };
}