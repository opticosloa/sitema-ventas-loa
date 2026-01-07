import React, { useMemo, useState, useEffect } from "react";
import type { Producto } from "../../types/Producto";
import LOAApi from '../../api/LOAApi';
import { useQuery } from '@tanstack/react-query';

const ITEMS_PER_PAGE = 25;

const statusBadge = (stock: number) => {
  if (stock <= 2) return "bg-red-100 text-red-800";      // crítico
  if (stock <= 10) return "bg-yellow-100 text-yellow-800"; // bajo
  return "bg-green-100 text-green-800";                  // ok
};

export const ConsultaStock: React.FC = () => {
  const { data: products = [], isSuccess } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await LOAApi.get<{ success: boolean; result: Producto[] }>('/api/products/all');
      return data.success && Array.isArray(data.result) ? data.result : [];
    }
  });

  useEffect(() => {
    if (isSuccess && products.length === 0) {
      alert("No se encontraron productos (la tabla está vacía).");
    }
  }, [isSuccess, products]);

  const [query, setQuery] = useState("");
  const [categoria, setCategoria] = useState<"" | Producto["tipo"] | "ALL">("");
  const [sortBy, setSortBy] = useState<"stock-desc" | "stock-asc" | "name-asc">("stock-desc");
  const [page, setPage] = useState(1);

  // filtro + búsqueda + orden
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products.slice();

    if (categoria && categoria !== "ALL") {
      list = list.filter((p: Producto) => p.tipo === categoria);
    }

    if (q) {
      list = list.filter(
        (p: Producto) =>
          p.nombre.toLowerCase().includes(q) ||
          (p.qr_code && p.qr_code.toLowerCase().includes(q)) ||
          p.ubicacion.toLowerCase().includes(q)
      );
    }

    if (sortBy === "stock-desc") list.sort((a, b) => b.stock - a.stock);
    if (sortBy === "stock-asc") list.sort((a, b) => a.stock - b.stock);
    if (sortBy === "name-asc") list.sort((a, b) => a.nombre.localeCompare(b.nombre));

    return list;
  }, [query, categoria, sortBy, products]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const start = (page - 1) * ITEMS_PER_PAGE;
  const pageItems = filtered.slice(start, start + ITEMS_PER_PAGE);

  // CSV export simple (client-side)
  const exportCSV = () => {
    const headers = ["ID", "QR/Código", "Nombre", "Tipo", "Stock", "Ubicación", "Marca ID"];
    const rows = filtered.map((p) => [p.producto_id, p.qr_code, p.nombre, p.tipo, p.stock, p.ubicacion, p.marca_id ?? ""]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stock_export_page${page}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // responsive helpers
  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));
  const resetPageIfNeeded = () => setPage(1);

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">Consulta de Stock</h2>
          <p className="text-sm text-crema/80">Ver y gestionar el inventario disponible</p>
        </div>

        <div className="flex gap-2 items-center">
          <button
            onClick={exportCSV}
            className="btn-primary px-3 py-2 text-sm"
            aria-label="Exportar listado a CSV"
          >
            Exportar CSV
          </button>
          <div className="text-sm text-crema/80">Resultados: <span className="font-medium text-white">{filtered.length}</span></div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-azul/10 border border-crema rounded-lg p-3 mb-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="flex gap-2 w-full md:w-2/3">
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); resetPageIfNeeded(); }}
            className="w-full input"
            placeholder="Buscar por nombre, código o ubicación..."
            aria-label="Buscar stock"
          />

          <select
            value={categoria}
            onChange={(e) => { setCategoria(e.target.value as any); resetPageIfNeeded(); }}
            className="input max-w-[160px]"
            aria-label="Filtrar por tipo"
          >
            <option value="">Todos los tipos</option>
            <option value="ALL">Todos</option>
            <option value="ARMAZON">Armazón</option>
            <option value="CRISTAL">Cristal</option>
            <option value="ACCESORIO">Accesorio</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="input max-w-[180px]"
            aria-label="Ordenar"
          >
            <option value="stock-desc">Stock (mayor primero)</option>
            <option value="stock-asc">Stock (menor primero)</option>
            <option value="name-asc">Nombre A→Z</option>
          </select>
        </div>

        <div className="flex gap-2 items-center">
          <div className="text-sm text-crema/80">Mostrando</div>
          <div className="text-sm font-medium text-white">{pageItems.length} / {filtered.length}</div>
          <div className="flex gap-2">
            <button onClick={goPrev} disabled={page === 1} className="btn-secondary px-3 py-2 disabled:opacity-50">Anterior</button>
            <button onClick={goNext} disabled={page === totalPages} className="btn-primary px-3 py-2 disabled:opacity-50">Siguiente</button>
          </div>
        </div>
      </div>

      {/* ===== Mobile: Cards ===== */}
      <div className="grid gap-1 md:hidden">
        {pageItems.map((p) => (
          <article key={p.producto_id} className="bg-white rounded-lg p-3 shadow-sm border hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm truncate">{p.nombre}</h3>
                  <span className="text-xs text-crema/70 truncate">{p.qr_code}</span>
                </div>
                <p className="text-xs text-gray-600 mt-1 truncate">{p.ubicacion} • Marca: {p.marca_id}</p>
                <p className="text-xs text-gray-500 mt-2">{p.tipo}</p>
              </div>

              <div className="flex flex-col items-end flex-shrink-0 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs rounded ${statusBadge(p.stock)}`}>{p.stock} u.</span>
                <button className="mt-2 text-sm text-azul underline" onClick={() => console.log("Ver producto", p.producto_id)}>Detalle</button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* ===== Desktop: Table ===== */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow-sm border-blanco/20">
        <table className="min-w-full table-fixed">
          <colgroup>
            <col style={{ width: "18%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "30%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "20%" }} />
          </colgroup>

          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm">Nombre</th>
              <th className="px-4 py-3 text-left text-sm">QR/Código</th>
              <th className="px-4 py-3 text-left text-sm">Ubicación / Marca</th>
              <th className="px-4 py-3 text-left text-sm">Tipo</th>
              <th className="px-4 py-3 text-left text-sm">Stock</th>
              <th className="px-4 py-3 text-left text-sm">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {pageItems.map((p) => (
              <tr key={p.producto_id} className="hover:bg-amber-50 focus-within:bg-amber-50">
                <td className="px-4 py-3 text-sm truncate max-w-xs">{p.nombre}</td>
                <td className="px-4 py-3 text-sm whitespace-nowrap">{p.qr_code}</td>
                <td className="px-4 py-3 text-sm min-w-0">
                  <div className="truncate">{p.ubicacion} • {p.marca_id}</div>
                </td>
                <td className="px-4 py-3 text-sm">{p.tipo}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${statusBadge(p.stock)}`}>
                    {p.stock} u.
                  </span>
                </td>
                <td className="px-4 py-3 text-sm whitespace-nowrap">
                  <button className="text-azul underline mr-3" onClick={() => console.log("Detalle", p.producto_id)}>Detalle</button>
                  <button className="text-celeste" onClick={() => console.log("Mover/Ubicar", p.producto_id)}>Mover</button>
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
          <button onClick={goPrev} className="btn-secondary px-3 py-2">Anterior</button>
          <button onClick={goNext} className="btn-primary px-3 py-2">Siguiente</button>
          <button onClick={() => { setPage(totalPages); }} className="btn-secondary px-3 py-2">Última</button>
        </div>
      </div>
    </div>
  );
};
