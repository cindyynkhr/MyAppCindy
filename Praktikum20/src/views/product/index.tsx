import Image from 'next/image';
import Link from 'next/link';
import styles from "../../pages/product/product.module.scss";
type ProductType = {
    id: string;
    name: string;
    price: number;  
    images: string;  // Sesuai dengan Firebase
    category: string;
};

const TampilanProduk = ({products}: {products: ProductType[]}) => {
    return (
        <div className={styles.produk}>
            <h1 className={styles.produk__title}>Daftar Produk</h1>
            <div className={styles.produk__content}>
                {products?.length > 0 ? (
                    <>
                    {products?.map((product: ProductType) => (
                        <Link href={`/product/${product.id}`} key={product.id} className={styles.produk__content__item}>
                        {/*<div key={product.id} className={styles.produk__content__item}>*/}
                            <div className={styles.produk__content__item__image}>
                                <Image src={product.images} alt={product.name} width={200} height={200} />
                            </div>
                            <h4 className={styles.produk__content__item__name}>
                                {product.name}
                            </h4>
                            <p className={styles.produk__content__item__category}>
                                {product.category}
                            </p>
                            <p className={styles.produk__content__item__price}>
                                Rp {product.price.toLocaleString('id-ID')}
                            </p>
                        </Link>
                    ))}
                    </>
                    ) : (
                        <div className={styles.produk__content__skeleton}>
                            <div className={styles.produk__content__skeleton__image}></div>
                            <div className={styles.produk__content__skeleton__name}></div>
                            <div className={styles.produk__content__skeleton__category}></div>
                            <div className={styles.produk__content__skeleton__price}></div>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default TampilanProduk;