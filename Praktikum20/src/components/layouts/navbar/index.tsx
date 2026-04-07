import Script from "next/dist/client/script";
import styles from "./navbar.module.css";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

const Navbar = () => {
    const {data}:any = useSession();
    //const { data: sesion } = useSession();
    console.log("session", data);
    return (
        <div className={styles.navbar}>
            {/* <div className={styles.navbar_brand}>
                My App
            </div> */}
            <div className={styles.navbar_brand} id="tittle"></div>
            <Script id="tittle-script" strategy='lazyOnload'>
                {'document.getElementById("tittle").innerHTML = "My App";'}
            </Script>
            <div className={styles.navbar_right}>
                {data ? (
                    <>
                    <div className={styles.navbar_user}>
                        Welcome, {data.user.fullName}
                        {data.user.image && (
                            <Image 
                                src={data.user.image}
                                alt={data.user.fullName}
                                width={50} height={50}
                                className={styles.navbar_user_image}
                            />
                        )}
                    </div>
                    <button 
                        className={styles.navbar_button + " " + styles["navbar_button--danger"]}
                        onClick={() => signOut()}
                    >
                        Sign Out
                    </button>
                    </>
                ) : (
                    <button 
                        className={styles.navbar_button + " " + styles["navbar_button--primary"]}
                        onClick={() => signIn()}
                    >
                        Sign In
                    </button>
                )}
            </div>
        </div>
    );
};

export default Navbar;