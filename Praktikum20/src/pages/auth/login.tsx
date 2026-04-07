import TampilanLogin from "../../views/auth/login";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";

const halamanLogin = () => {
    return (
        <>
            <TampilanLogin />
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getServerSession(context.req, context.res, authOptions);
    
    // Jika user sudah login, redirect ke home
    if (session) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
};

export default halamanLogin; 