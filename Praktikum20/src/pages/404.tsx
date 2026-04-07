import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
import styles from "@/styles/404.module.scss";

const Custom404 = () => {
    return (
        <div className={styles.error__container}>
            <Head>
                <title>404 - Halaman Tidak Ditemukan</title>
            </Head>
            <h1 className={styles.error__title}>404</h1>
            <p className={styles.error__desc}>Halaman yang Anda cari tidak ditemukan.</p>
                <Image
                    src="/page-not-found.png"
                    alt="404"
                    width={400}
                    height={200}
                    className={styles.error__image}
                />
            <p className={styles.error__info}>Silakan periksa kembali URL atau klik tombol di bawah untuk kembali ke halaman utama.</p>
            <Link href="/" className={styles.error__button}>Kembali ke Home</Link>
        </div>
    );
};

export default Custom404;