import { Outlet, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../hooks";


export const DashboardTaller = () => {
    const navigate = useNavigate();
    const { nombre } = useAppSelector(state => state.auth);
    return (
        <div className="w-screen h-scw-screen mx-auto bg-gradient-to-r from-azul to-celeste">
            <div className="flex flex-col w-full  px-8 py-6 shadow-lg">

                <h1 className="text-3xl text-blanco font-semibold mb-6 text-center">Bienvenido {nombre}</h1>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <button
                        className="bg-gray-100 border border-gray-300 shadow-sm rounded-lg h-28 flex items-center justify-center text-lg font-medium hover:bg-crema hover:opacity-90 transition"
                        onClick={() => navigate("/taller/lista")}
                    >
                        Tickets
                    </button>

                    <button
                        className="bg-gray-100 border border-gray-300 shadow-sm rounded-lg h-28 flex items-center justify-center text-lg font-medium hover:bg-crema hover:opacity-90 transition"
                        onClick={() => navigate("/taller/historial")}
                    >
                        Historial
                    </button>
                    <button
                        className="bg-gray-100 border border-gray-300 shadow-sm rounded-lg h-28 flex items-center justify-center text-lg font-medium hover:bg-crema hover:opacity-90 transition"
                        onClick={() => navigate("/taller/stock")}
                    >
                        Stock
                    </button>
                </div>
            </div>

            <div className="mt-8">
                <Outlet />
            </div>
        </div>
    )
}
