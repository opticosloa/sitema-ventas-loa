import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import LOAApi from '../api/LOAApi';
import type { MetodoPago, PagoParcial } from '../types/Pago';

export const FormularioDePago: React.FC = () => {
  const { ventaId: paramVentaId } = useParams<{ ventaId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  /* New States */
  const [ventaId, setVentaId] = useState<any>(paramVentaId || (location.state as any)?.ventaId || null);
  const [saleItems, setSaleItems] = useState<any[]>([]);
  const [dniSearch, setDniSearch] = useState("");
  const [currentTotal, setCurrentTotal] = useState(0);

  // Sync with location state on mount
  useEffect(() => {
    const state = (location.state as any);
    if (state?.ventaId) {
      setVentaId(state.ventaId);
      if (state.total) setCurrentTotal(state.total);
    }
  }, [location]);

  // Fetch Details
  useEffect(() => {
    if (ventaId) {
      fetchSaleDetails(ventaId);
    }
  }, [ventaId]);

  const fetchSaleDetails = async (id: any) => {
    try {
      const { data } = await LOAApi.get(`/api/sales/${id}`);
      if (data.success && data.result) {
        const sale = data.result;
        const s = Array.isArray(sale) ? sale[0] : sale;

        if (s.total) setCurrentTotal(parseFloat(s.total));
        if (s.items) setSaleItems(s.items || []);
      }
    } catch (error) {
      console.error("Error fetching sale details", error);
    }
  };

  const handleSearchDni = async () => {
    if (!dniSearch) return alert("Ingrese DNI");
    try {
      const { data } = await LOAApi.get(`/api/sales/by-client-dni/${dniSearch}`);
      if (data.success && data.result && data.result.length > 0) {
        const sales = data.result;
        const latest = sales[0];
        setVentaId(latest.venta_id);
        setCurrentTotal(parseFloat(latest.total));
        fetchSaleDetails(latest.venta_id);
        alert(`Venta encontrada: ID ${latest.venta_id} - Total $${latest.total}`);
      } else {
        alert("No se encontraron ventas pendientes para este DNI");
      }
    } catch (error) {
      console.error(error);
      alert("Error buscando ventas");
    }
  };

  const handleCancelSale = async () => {
    if (!ventaId) return;
    if (!window.confirm("¿Seguro que deseas cancelar esta venta?")) return;

    try {
      await LOAApi.put(`/api/sales/${ventaId}/cancel`);
      alert("Venta cancelada");
      navigate('/');
    } catch (error) {
      console.error(error);
      alert("Error cancelando venta");
    }
  };

  // State
  const [pagos, setPagos] = useState<PagoParcial[]>([]);
  // Removed totalVenta state, using currentTotal
  const [loading, setLoading] = useState(false);

  // Form State for new payment
  const [selectedMethod, setSelectedMethod] = useState<MetodoPago | ''>('');
  const [amountInput, setAmountInput] = useState<string>('');

  const metodos: { id: MetodoPago; label: string; icon: string }[] = [
    { id: 'EFECTIVO', label: 'Efectivo', icon: '💵' },
    { id: 'DEBITO', label: 'Débito', icon: '💳' },
    { id: 'CREDITO', label: 'Crédito', icon: '💳' },
    { id: 'TRANSFERENCIA', label: 'Transferencia', icon: '🏦' },
    { id: 'MP', label: 'Mercado Pago', icon: '📱' },
  ];



  // Calculations
  const totalPagado = pagos.reduce((acc, p) => acc + (Number(p.monto) || 0), 0);
  const restante = Math.max(0, currentTotal - totalPagado);
  const puedeConfirmar = Math.abs(totalPagado - currentTotal) < 0.01 && pagos.length > 0;

  // Handlers
  const handleAddPayment = () => {
    if (!selectedMethod) return alert("Seleccioná un método de pago");
    const amount = parseFloat(amountInput);
    if (isNaN(amount) || amount <= 0) return alert("Ingresá un monto válido");
    if (amount > restante + 0.01) return alert("El monto supera el restante");

    setPagos([...pagos, { metodo: selectedMethod, monto: amount }]);

    // Reset inputs
    setSelectedMethod('');
    setAmountInput((restante - amount).toFixed(2));
  };

  const handleRemovePayment = (index: number) => {
    const removedAmount = pagos[index].monto;
    const newPagos = pagos.filter((_, i) => i !== index);
    setPagos(newPagos);
    setAmountInput((restante + removedAmount).toFixed(2));
  };

  const onSubmit = async () => {
    if (!ventaId || !puedeConfirmar) return;
    setLoading(true);

    try {
      for (const pago of pagos) {
        // Mercado Pago → Redirect logic
        if (pago.metodo === 'MP') {
          const { data } = await LOAApi.post('/api/payments/mercadopago/preference', {
            venta_id: ventaId,
            monto: pago.monto,
            title: `Venta #${ventaId}`,
          });
          window.location.href = data.init_point;
          return; // Stop execution here, redirecting
        }

        // Manual Payment
        await LOAApi.post('/api/payments/manual', {
          venta_id: ventaId,
          metodo: pago.metodo,
          monto: pago.monto,
        });
      }

      navigate(`/ventas/${ventaId}`);
    } catch (error) {
      console.error(error);
      alert('Error procesando el pago');
    } finally {
      setLoading(false);
    }
  };

  // Auto-update amount input when nothing is selected?
  // Better logic: Update amount input whenever remaining changes, unless user modified it?
  // Simpler: Just rely on manual input or the default set on load/remove.
  useEffect(() => {
    if (restante > 0 && amountInput === '0.00') {
      setAmountInput(restante.toFixed(2));
    }
  }, [restante]);





  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 text-blanco">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-white text-2xl font-semibold">Finalizar Pago</h2>
        <div className="flex gap-2">
          <input
            className="input py-1 px-2 w-32"
            placeholder="Buscar DNI"
            value={dniSearch}
            onChange={(e) => setDniSearch(e.target.value)}
          />
          <button type="button" onClick={handleSearchDni} className="btn-secondary text-xs px-2">
            Buscar
          </button>
          {ventaId && (
            <button type="button" onClick={handleCancelSale} className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 ml-2">
              Cancelar Venta
            </button>
          )}
        </div>
      </div>

      {/* Sale Info & Items */}
      {ventaId && (
        <div className="bg-gray-800 p-4 rounded-lg mb-4 text-white">
          <div className="flex justify-between mb-2">
            <span className="font-bold">Venta #{ventaId}</span>
            <span className="text-xl font-bold text-celeste">${currentTotal.toLocaleString()}</span>
          </div>
          {saleItems.length > 0 ? (
            <div className="text-sm text-gray-300">
              <ul className="list-disc pl-5">
                {saleItems.map((item, idx) => (
                  <li key={idx}>
                    {item.cantidad}x {item.producto_nombre || 'Item'} - ${item.subtotal}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-xs text-gray-500">Sin detalles de items (o cargando...)</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT COLUMN: Summary & List */}
        <div className="lg:col-span-2 space-y-6">

          {/* SUMMARY CARD */}
          <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl border border-gray-700 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left">
              <p className="text-gray-400 text-sm">Total a Pagar</p>
              <p className="text-3xl font-bold">${currentTotal.toLocaleString()}</p>
            </div>
            <div className="flex gap-8">
              <div className="text-center">
                <p className="text-gray-400 text-sm">Pagado</p>
                <p className="text-xl text-green-400 font-medium">${totalPagado.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm">Restante</p>
                <p className={`text-xl font-medium ${restante > 0 ? 'text-red-400' : 'text-gray-500'}`}>
                  ${restante.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* PAYMENTS LIST */}
          <div className="bg-gray-900 bg-opacity-30 p-4 rounded-xl min-h-[150px]">
            <h3 className="text-lg font-medium mb-3">Pagos Agregados</h3>
            {pagos.length === 0 ? (
              <p className="text-gray-500 text-center py-6">No hay pagos registrados aún.</p>
            ) : (
              <div className="space-y-2">
                {pagos.map((pago, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-800 p-3 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{metodos.find(m => m.id === pago.metodo)?.icon}</span>
                      <div>
                        <p className="font-medium">{metodos.find(m => m.id === pago.metodo)?.label}</p>
                        <p className="text-xs text-gray-400">Parcial</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-lg">${pago.monto.toLocaleString()}</span>
                      <button
                        onClick={() => handleRemovePayment(idx)}
                        className="text-red-400 hover:text-red-300 transition p-1"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: Add Payment */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl border border-gray-700 h-full flex flex-col">
            <h3 className="text-lg font-medium mb-4">Agregar Método</h3>

            {/* Method Grid */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              {metodos.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setSelectedMethod(m.id);
                    if (restante > 0) setAmountInput(restante.toString());
                  }}
                  className={`p-3 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all ${selectedMethod === m.id
                    ? 'bg-celeste text-negro border-celeste scale-105 shadow-md'
                    : 'bg-transparent border-gray-600 hover:border-celeste hover:text-celeste'
                    }`}
                >
                  <span className="text-2xl">{m.icon}</span>
                  <span className="text-xs font-medium">{m.label}</span>
                </button>
              ))}
            </div>

            {/* Amount Input */}
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-1">Monto</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  className="input pl-8 w-full text-lg font-bold"
                  placeholder="0.00"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddPayment}
              disabled={!selectedMethod || parseFloat(amountInput) <= 0}
              className="btn-secondary w-full mb-auto"
            >
              Agregar Pago
            </button>

            {/* Divider */}
            <hr className="border-gray-700 my-6" />

            {/* Confirm Button */}
            <button
              onClick={onSubmit}
              disabled={!puedeConfirmar || loading}
              className={`w-full py-3 rounded-lg font-bold text-lg transition-all ${puedeConfirmar
                ? 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/50'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
            >
              {loading ? 'Procesando...' : 'Confirmar y Finalizar'}
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};
