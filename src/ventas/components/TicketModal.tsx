import { useUiStore } from '../../hooks';


export const TicketModal = () => {
  const { isItemModalOpen, selectedProduct, handlerTicketDetail } = useUiStore();

  if (!isItemModalOpen || !selectedProduct) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
        <h2 className="text-xl font-bold mb-4">Detalle del Ticket</h2>
        
        <p><strong>ID:</strong> {selectedProduct.id}</p>
        <p><strong>Cliente:</strong> {selectedProduct.cliente}</p>
        <p><strong>Fecha:</strong> {new Date(selectedProduct.fecha).toLocaleString()}</p>
        <p><strong>Empleado:</strong> {selectedProduct.empleado}</p>
        <p><strong>Producto:</strong> {selectedProduct.producto}</p>
        <p><strong>Estado:</strong> {selectedProduct.estado}</p>
        <p><strong>Total:</strong> ${selectedProduct.total.toLocaleString()}</p>

        <button
          onClick={() => handlerTicketDetail(null)} 
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          ✕
        </button>
        <div className="flex flex-row mt-4 justify-between items-center">
          <button
            className="bg-gradient-to-r from-azul to-celeste rounded-md px-4 py-2 text-white hover:opacity-90 transition"
            onClick={() => alert("Funcionalidad de cambiar estado no implementada")}
          >
            Cambiar Estado
          </button>
        
          <button
            className="bg-gradient-to-r from-azul to-celeste rounded-md px-4 py-2 text-white hover:opacity-90 transition"
            onClick={() => alert("Funcionalidad de informar error no implementada")}
          >
            Informar Error
          </button>
        </div>

        
      </div>
    </div>
  );
};
