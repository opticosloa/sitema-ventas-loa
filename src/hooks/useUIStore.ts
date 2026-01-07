import { useDispatch, useSelector } from 'react-redux';
import { onItemModalHandler, onSideBarOpenHandler, setSelectedProduct } from '../store';

export const useUiStore = () => {
  
  const { isSideBarOpen, isItemModalOpen, selectedProduct } = useSelector((state: any) => state.ui);
  const dispatch = useDispatch();

  const toggleSideBar = () => {
    dispatch( onSideBarOpenHandler() );
  }

  //TODO: cambiar any por el tipo de producto
  const handlerTicketDetail = ( product: any ) => {
    dispatch( setSelectedProduct( product ) );
    dispatch( onItemModalHandler() );
  }

  return {
    toggleSideBar,
    isSideBarOpen,
    handlerTicketDetail,
    isItemModalOpen,
    selectedProduct,
  }
}