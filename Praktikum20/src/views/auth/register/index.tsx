import Link from 'next/link';
import style from './register.module.scss';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { error } from 'node:console';

const tampilanRegister = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { push } = useRouter();
    const [eror, setEror] = useState("");
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setEror("");
        const form = event.currentTarget;
        const formData = new FormData(event.currentTarget);
        const email = formData.get("email") as string;
        const fullName = formData.get("fullName") as string;
        const password = formData.get("password") as string;
        const response = await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, fullName, password }),
        });
        if (response.status === 200) {
            form.reset();
            setIsLoading(false);
            push("/auth/login");
        } else {
            setIsLoading(false);
            setEror(
                response.status === 400 ? "Email already exists" : "An error occurred"
            );
        }
    };

    return (
        <div className={style.register}>
                {eror && <p className={style.register_form_item_error}>{eror}</p>}
            <h1 className={style.register_title}>Halaman Register</h1>
            <div className={style.register_form}>
                <form action="" onSubmit={handleSubmit}>
                    {eror && (
                        <div style={{ color: "#d32f2f", fontSize: "14px", marginBottom: "15px", textAlign: "center", padding: "10px", backgroundColor: "#ffebee", borderRadius: "5px" }}>
                            {eror}
                        </div>
                    )}
                    {/* Form Email */}
                    <div className={style.register_form_item}>
                        <label
                            htmlFor="email"
                            className={style.register_form_item_label}
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Cindy@example.com"
                            className={style.register_form_item_input}
                            required
                        />
                    </div>

                    {/* Form Full Name */}
                    <div className={style.register_form_item}>
                        <label
                            htmlFor="fullName"
                            className={style.register_form_item_label}
                        >
                            Fullname
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            placeholder="Cindy Nur Khoiriyah"
                            className={style.register_form_item_input}
                            required
                        />
                    </div>

                    {/* Form Password */}
                    <div className={style.register_form_item}>
                        <label
                            htmlFor="password"
                            className={style.register_form_item_label}
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Password"
                            className={style.register_form_item_input}
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className={style.register_form_item_button}
                        disabled={isLoading}
                    >
                        {isLoading ? "Loading..." : "Register"}
                    </button>
                </form>
                <p className={style.register_form_item_text}>
                    Sudah punya akun? <Link href="/auth/login">Ke Halaman Login</Link>
                </p>
            </div>
        </div>
    );
};

export default tampilanRegister;