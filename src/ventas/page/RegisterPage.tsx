import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../../hooks';
import { startLoginWithEmailPassword } from '../../store';
import type { LoginFormValues } from '../../types/LoginTypes';



const loginFormFields: LoginFormValues = {
    loginEmail: '',
    loginPassword: '',
}

export const RegisterPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { formState, onInputChange } = useForm(loginFormFields);
    const { loginEmail, loginPassword } = formState;


    const onLoginWithEmailPassword = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        dispatch(
            startLoginWithEmailPassword({
                email: loginEmail,
                password: loginPassword,
            })
        );

        navigate("/");
    };

    return (
        <div className="flex h-full w-screen items-center justify-center">
            <div className="flex place-content-center justify-self-center shadow-lg rounded-lg shadow-amber-50 p-12">
                <div >
                    <div className="flex-row">
                        <h3 className="text-White text-2xl mb-6">Nombre de la empresa</h3>
                        <form
                            onSubmit={onLoginWithEmailPassword}
                            className="flex flex-col justify-center items-center"
                        >
                            <div className="flex justify-center my-3 shadow-sm rounded-md shadow-amber-50">
                                <input
                                    type="text"
                                    className="text-gray-500 rounded-sm ml-2"
                                    placeholder="Correo"
                                    name="loginEmail"
                                    value={loginEmail}
                                    onChange={onInputChange}
                                />
                            </div>
                            <div className="flex justify-center my-3 shadow-sm rounded-md shadow-amber-50">
                                <input
                                    type="password"
                                    className="text-gray-500 rounded-sm ml-2"
                                    placeholder="Contraseña"
                                    name="loginPassword"
                                    value={loginPassword}
                                    onChange={onInputChange}
                                />
                            </div>

                            <button
                                type="submit"
                                className="flex my-4 px-4 py-2 w-48 h-12 justify-center text-lg"
                            >Ingresar</button>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
