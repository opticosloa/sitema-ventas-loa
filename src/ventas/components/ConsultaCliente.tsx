import React, { useEffect, useMemo, useState } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import type { Cliente } from '../../types/Cliente';
import LOAApi from '../../api/LOAApi';
import { useQuery } from '@tanstack/react-query';

const ITEMS_PER_PAGE = 25;



const formatCurrency = (n?: number) =>
  n === undefined ? "-" : new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(n);

export const ConsultaCliente: React.FC = () => {
  const [query, setQuery] = useState("");
  const q = useDebounce(query, 300);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Cliente | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { data: clientes = [], isSuccess } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data } = await LOAApi.get<{ success: boolean; result: Cliente[] }>('/api/clients');
      return data.success && Array.isArray(data.result) ? data.result : [];
    }
  });

  useEffect(() => {
    if (isSuccess && clientes.length === 0) {
      alert("No se encontraron clientes (la tabla está vacía).");
    }
  }, [isSuccess, clientes]);

  // Filtrado cliente (nombre, dni, teléfono, email)
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return clientes.slice();
    return clientes.filter((c) =>
      c.nombre.toLowerCase().includes(term) ||
      (c.dni && c.dni.toString().includes(term)) ||
      (c.telefono ?? "").toLowerCase().includes(term) ||
      (c.email ?? "").toLowerCase().includes(term)
    );
  }, [q, clientes]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [totalPages, page]);

  const start = (page - 1) * ITEMS_PER_PAGE;
  const pageItems = filtered.slice(start, start + ITEMS_PER_PAGE);

  // Abrir modal y bloquear scroll; focus en close button
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
      const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setShowModal(false); };
      window.addEventListener("keydown", onKey);
      return () => {
        window.removeEventListener("keydown", onKey);
        document.body.style.overflow = "";
      };
    }
  }, [showModal]);

  const openModal = (c: Cliente) => {
    setSelected(c);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelected(null);
  };

  // CSV export
  const exportCSV = () => {
    const headers = ["ID", "Nombre", "DNI", "Teléfono", "Email", "Cuenta"];
    const rows = filtered.map((c) => [
      c.cliente_id, c.nombre, c.dni, c.telefono ?? "", c.email ?? "", c.cuenta_corriente ?? 0
    ]);
    const csv = [headers, ...rows].map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `clientes_export_page${page}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // keyboard handler for list items
  const onKeyActivate = (e: React.KeyboardEvent, c: Cliente) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openModal(c);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">Consulta de Clientes</h2>
          <p className="text-sm text-crema/80">Buscar y revisar detalles del cliente</p>
        </div>

        <div className="flex gap-2 items-center">
          <button onClick={exportCSV} className="btn-primary px-3 py-2 text-sm">Exportar CSV</button>
          <div className="text-sm text-crema/80">Resultados: <span className="font-medium text-white">{filtered.length}</span></div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-azul/10 border border-crema rounded-lg p-3 mb-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(1); }}
          placeholder="Buscar por nombre, DNI, teléfono o email..."
          className="input w-full md:w-2/3"
          aria-label="Buscar cliente"
        />

        <div className="flex gap-2 items-center">
          <div className="text-sm text-crema/80">Mostrando</div>
          <div className="text-sm font-medium text-white">{pageItems.length} / {filtered.length}</div>
          <div className="flex gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary px-3 py-2 disabled:opacity-50">Anterior</button>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-primary px-3 py-2 disabled:opacity-50">Siguiente</button>
          </div>
        </div>
      </div>

      {/* Mobile: cards */}
      <div className="grid gap-4 md:hidden">
        {pageItems.map(c => (
          <article key={c.cliente_id} role="button" tabIndex={0}
            onKeyDown={(e) => onKeyActivate(e, c)}
            onClick={() => openModal(c)}
            className="bg-white rounded-lg p-3 shadow-sm border hover:shadow-md focus:outline-none focus:ring-2 focus:ring-celeste cursor-pointer"
            aria-label={`Ver cliente ${c.nombre}`}
          >
            <div className="flex justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-semibold text-sm truncate">{c.nombre}</h3>
                <p className="text-xs text-gray-600 mt-1">DNI: {c.dni} • {c.telefono}</p>
                <p className="text-xs text-gray-500 mt-1 truncate">{c.email}</p>
              </div>

              <div className="flex flex-col items-end flex-shrink-0 whitespace-nowrap">
                <div className="text-xs text-crema/80">Cuenta</div>
                <div className="font-medium">{formatCurrency(c.cuenta_corriente)}</div>
                <button onClick={(e) => { e.stopPropagation(); openModal(c); }} className="mt-2 text-sm text-azul underline">Ver</button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow-sm border mt-2">
        <table className="min-w-full table-fixed">
          <colgroup>
            <col style={{ width: "28%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "20%" }} />
          </colgroup>

          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm">Nombre</th>
              <th className="px-4 py-3 text-left text-sm">DNI</th>
              <th className="px-4 py-3 text-left text-sm">Dirección</th>
              <th className="px-4 py-3 text-left text-sm">Contacto</th>
              <th className="px-4 py-3 text-left text-sm">Cuenta / Acciones</th>
            </tr>
          </thead>

          <tbody>
            {pageItems.map(c => (
              <tr key={c.cliente_id} className="hover:bg-amber-50 focus-within:bg-amber-50">
                <td className="px-4 py-3 text-sm truncate max-w-xs">
                  <button onClick={() => openModal(c)} className="text-left w-full text-sm">
                    <div className="font-medium truncate">{c.nombre}</div>
                    {/* <div className="text-xs text-gray-500">{c.direccion}</div> */}
                  </button>
                </td>

                <td className="px-4 py-3 text-sm whitespace-nowrap">{c.dni}</td>

                <td className="px-4 py-3 text-sm min-w-0">
                  <div className="truncate">
                    {c.direccion ?? "—"}
                  </div>
                </td>

                <td className="px-4 py-3 text-sm">
                  <div className="truncate">{c.telefono ?? "—"}</div>
                  <div className="truncate text-xs text-gray-500">{c.email ?? ""}</div>
                </td>

                <td className="px-4 py-3 text-sm whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="text-xs text-crema/80">Saldo</div>
                      <div className="font-medium">{formatCurrency(c.cuenta_corriente)}</div>
                    </div>

                    <div className="ml-auto flex gap-2">
                      <button onClick={() => openModal(c)} className="text-azul underline">Ver</button>
                      <button onClick={() => console.log("Editar", c.cliente_id)} className="text-celeste">Editar</button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination footer */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-crema/80">Página {page} de {totalPages}</div>
        <div className="flex gap-2">
          <button onClick={() => { setPage(1); }} className="btn-secondary px-3 py-2 disabled:opacity-50">Primera</button>
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary px-3 py-2 disabled:opacity-50">Anterior</button>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-primary px-3 py-2 disabled:opacity-50">Siguiente</button>
          <button onClick={() => { setPage(totalPages); }} className="btn-secondary px-3 py-2 disabled:opacity-50">Última</button>
        </div>
      </div>

      {/* Modal detalle */}
      {showModal && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40" onClick={closeModal} />
          <div role="dialog" aria-modal="true" aria-label={`Detalle cliente ${selected.nombre}`}
            className="relative bg-white rounded-lg shadow-lg w-[95%] max-w-4xl p-6 z-50">
            <button aria-label="Cerrar" onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-black">✕</button>

            <header className="mb-4">
              <h3 className="text-xl font-semibold">{selected.nombre}</h3>
              <div className="text-sm text-gray-600">{selected.dni} • {selected.telefono}</div>
              <div className="text-xs text-gray-500 mt-1">Dirección: {selected.direccion}</div>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Resumen / acciones */}
              <div>
                <h4 className="font-medium mb-2">Detalles</h4>
                <div className="border rounded p-3 space-y-2">
                  <div className="text-sm mt-2"><strong>Cuenta corriente:</strong> {formatCurrency(selected.cuenta_corriente)}</div>

                  <div className="flex gap-2 mt-3">
                    <button className="btn-primary" onClick={() => console.log("Nuevo pedido para", selected.cliente_id)}>Nuevo pedido</button>
                    <button className="btn-secondary" onClick={() => console.log("Editar cliente", selected.cliente_id)}>Editar</button>
                    <button className="btn-secondary" onClick={() => console.log("Historial", selected.cliente_id)}>Historial</button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};
