import Link from "next/link";
import style from "../../auth/login/login.module.scss";
import { useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";

const tampilanLogin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [eror, setEror] = useState("");

    const { push, query } = useRouter();
    const callbackUrl: any = query.callbackUrl || "/";

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setEror("");
        setIsLoading(true);

        try {
            const res = await signIn("credentials", {
                redirect: false,
                email: event.target.email.value,
                password: event.target.password.value,
                callbackUrl,
            });

            if (!res?.error) {
                setIsLoading(false);
                push(callbackUrl);
            } else {
                setIsLoading(false);
                setEror(res.error || "Login failed");
            }
        } catch (err) {
            setIsLoading(false);
            setEror("Wrong email or password");
        }
    };


    return (
        <>
            <div className={style.login}>
                    {eror && <p className={style.login_form_item_error}>{eror}</p>}
                <h1 className={style.login_title}>Halaman login</h1>
                <div className={style.login_form}>
                    <form action="" onSubmit={handleSubmit}>
                        {eror && (
                            <div style={{ color: "#d32f2f", fontSize: "14px", marginBottom: "15px", textAlign: "center", padding: "10px", backgroundColor: "#ffebee", borderRadius: "5px" }}>
                                {eror}
                            </div>
                        )}
                        {/* Form Email */}
                        <div className={style.login_form_item}>
                            <label
                                htmlFor="email"
                                className={style.login_form_item_label}
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Cindy@example.com"
                                className={style.login_form_item_input}
                                required
                            />
                        </div>

                        {/* Form Password */}
                        <div className={style.login_form_item}>
                            <label
                                htmlFor="password"
                                className={style.login_form_item_label}
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Password"
                                className={style.login_form_item_input}
                                required
                            />
                        </div>

                        <button 
                            type="submit" 
                            className={style.login_form_item_button}
                            disabled={isLoading}
                        >
                            {isLoading ? "Loading..." : "login"}
                        </button> {" "}
                        <button
                            onClick={() => signIn("google", { callbackUrl, redirect: false })}
                            className={style.login_form_item_button}
                            disabled={isLoading}
                        >
                            {isLoading ? "Loading..." : "Login with Google"}
                        </button> {" "}
                        <button
                            onClick={() => signIn("github", { callbackUrl, redirect: false })}
                            className={style.login_form_item_button}
                            disabled={isLoading}
                        >
                            {isLoading ? "Loading..." : "Login with GitHub"}
                        </button>
                    </form>
                    <p className={style.login_form_item_text}>
                        Sudah punya akun? <Link href="/auth/register">Ke Halaman Register</Link>
                    </p>
                </div>
            </div>
        </>
    );
};

export default tampilanLogin;