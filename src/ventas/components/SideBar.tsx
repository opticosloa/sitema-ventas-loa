import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector, useUiStore } from "../../hooks";
import { startLogout } from "../../store";

export const SideBar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isSideBarOpen, toggleSideBar } = useUiStore();
  const { uid } = useAppSelector((state: any) => state.auth);

  const handlerUser = () => {
    if (uid) {
      dispatch(startLogout());
    } 
    toggleSideBar();
    navigate('/');
  };

  return (
    <>
      {/* Overlay */}
      {isSideBarOpen && (
        <div
          className="fixed inset-0 bg-transparent bg-opacity-40 z-40"
          onClick={toggleSideBar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 right-0 h-full w-64 bg-azul text-blanco z-50 shadow-lg transform
          transition-transform duration-300
          ${isSideBarOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-celeste">
          <h2 className="text-lg font-bold">Menú</h2>
          <button
            onClick={toggleSideBar}
            className="text-blanco hover:text-celeste"
          >
            ✕
          </button>
        </div>

        {/* Links */}
        <nav className="flex flex-col p-4 space-y-4">
          <a href="/taller" >Taller</a>
          <a href="/admin" >Admin</a>
          <a href="/empleado" >Empleado</a>
        </nav>
        <button 
          className="flex flex-col pl-4"
          onClick={ handlerUser }
        >
          Cerrar Sesión
        </button>
      </div>
    </>
  );
};
