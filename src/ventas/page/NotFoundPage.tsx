import { useNavigate } from 'react-router-dom';


export const NotFoundPage = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/admin");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-azul to-celeste text-blanco">
      <h1 className="text-9xl font-bold">404</h1>
      <h2 className="text-2xl mt-4">Página no encontrada</h2>
      <p className="mt-2 text-crema">La ruta que intentaste abrir no existe.</p>

      <button
        onClick={goHome}
        className="mt-6 px-6 py-3 bg-blanco text-azul font-semibold rounded-lg shadow-lg hover:bg-crema hover:text-azul transition duration-300"
      >
        Volver al inicio
      </button>
    </div>
  );
};
