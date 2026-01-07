import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { startLogout } from '../../store';
import { Logo } from './Logo';
import { UserWidget } from './UserWidget';
import { SideBar } from '.';
import { useUiStore } from '../../hooks';


export const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { status, role } = useAppSelector((state: any) => state.auth);

  const { toggleSideBar } = useUiStore();

  const handlerUser = () => {
    if (status === 'authenticated') {
      dispatch(startLogout());
    } else {
      navigate('/login');
    }
  };

  const navigateHome = () => {
    if (!role) {
      navigate('/login');
      return;
    }

    switch (role) {
      case 'SUPERADMIN':
      case 'ADMIN':
        navigate('/admin');
        break;
      case 'EMPLEADO':
        navigate('/empleado');
        break;
      case 'TALLER':
        navigate('/taller');
        break;
      default:
        navigate('/login');
    }
  };


  return (
    <header className="block static top-0 w-full shadow-md z-50 bg-gradient-to-r from-azul to-celeste">
      <div
        className="flex items-center justify-between px-4 py-4 max-w-7xl mx-auto"
      >
        <a
          className="flex items-center"
          onClick={navigateHome}
        >
          <Logo />
        </a>

        <div className='hidden md:flex'>
          {
            <div className="flex items-center">
              <button
                className="flex items-center justify-center rounded-full hover:bg-celeste hover:opacity-70 transition-colors duration-300"
                onClick={handlerUser}
              >
                <UserWidget />
              </button>
            </div>
          }
        </div>

        <span
          className="md:hidden flex text-blanco"
          onClick={toggleSideBar}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M120-240v-80h520v80H120Zm664-40L584-480l200-200 56 56-144 144 144 144-56 56ZM120-440v-80h400v80H120Zm0-200v-80h520v80H120Z" /></svg>
        </span>
        <SideBar />

      </div>
    </header>
  )
}
