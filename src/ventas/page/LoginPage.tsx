import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, useForm } from '../../hooks';
import { startLoginWithEmailPassword } from '../../store';
import { Footer } from '../components';
import type { LoginFormValues } from '../../types/LoginTypes';
import { useEffect } from 'react';


const loginFormFields: LoginFormValues = {
    loginEmail: '',
    loginPassword: '',
}

export const LoginPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { formState, onInputChange } = useForm(loginFormFields);
    const { loginEmail, loginPassword } = formState;
    const { status, role } = useAuthStore();



    const onLoginWithEmailPassword = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const result = await dispatch(startLoginWithEmailPassword({
            email: loginEmail,
            password: loginPassword,
        }));

        return result;
    };

    useEffect(() => {
        if (status !== 'authenticated') return;

        switch (role) {
            case 'SUPERADMIN':
            case 'ADMIN':
                navigate('/admin', { replace: true });
                break;

            case 'EMPLEADO':
                navigate('/empleado', { replace: true });
                break;

            case 'TALLER':
                navigate('/taller', { replace: true });
                break;

            default:
                console.warn('Rol no reconocido:', role);
                navigate('/login', { replace: true });
        }
    }, [status, role, navigate]);

    return (
        <>
            <div className="flex h-full w-screen mt-36 items-center justify-center">
                <div className="flex place-content-center justify-self-center shadow-lg rounded-lg bg-azul p-16">
                    <div >
                        <div className="flex-row">
                            <h3 className="text-blanco text-2xl mb-6">Inicie sesión</h3>
                            <form
                                onSubmit={onLoginWithEmailPassword}
                                className="flex flex-col justify-center items-center"
                            >
                                <div className="flex justify-center my-3 shadow-sm rounded-md h-10">
                                    <input
                                        type="text"
                                        className="text-gray-500 rounded-sm pl-2 bg-crema"
                                        placeholder="Correo"
                                        name="loginEmail"
                                        value={loginEmail}
                                        onChange={onInputChange}
                                    />
                                </div>
                                <div className="flex justify-center my-3 shadow-sm rounded-md">
                                    <input
                                        type="password"
                                        className="text-gray-500 rounded-sm pl-2 bg-crema h-10"
                                        placeholder="Contraseña"
                                        name="loginPassword"
                                        value={loginPassword}
                                        onChange={onInputChange}
                                    />
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        className="flex my-4 px-4 py-2 w-48 h-12 justify-center text-blanco text-lg border-2 border-crema rounded-lg hover:bg-celeste hover:opacity-70 transition-colors duration-300"
                                    >
                                        Ingresar
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>

    )
}
