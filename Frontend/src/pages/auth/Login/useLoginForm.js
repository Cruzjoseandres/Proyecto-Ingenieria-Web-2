import { useState } from "react";
import useAuthentication from "../../../../hooks/useAuthentication";

export const useLoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const { doLogin } = useAuthentication();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const success = await doLogin({ email, password });

        if (!success) {
            setError("Error al iniciar sesión. Verifica tus credenciales.");
        }
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        error,
        handleSubmit
    };
};

