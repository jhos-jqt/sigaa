import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { fetchAulas, deleteAula } from "./api";
import AulaModal from "./AulaModal";
import {
  LuPencil,
  LuTrash2,
  LuPlus,
  LuSearch,
  LuChevronLeft,
  LuChevronRight,
} from "react-icons/lu";
import Swal from "sweetalert2";

const columnHelper = createColumnHelper();

const AulasPage = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aulaToEdit, setAulaToEdit] = useState(null);

  // 1. Fetch de datos con React Query
  const { data, isLoading, isError } = useQuery({
    queryKey: ["aulas", page, search],
    queryFn: () => fetchAulas({ page, search }),
    keepPreviousData: true, // Evita parpadeos al cambiar de página
  });

  // 2. Mutación para eliminar
  const deleteMutation = useMutation({
    mutationFn: deleteAula,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aulas"] });
      Swal.fire("Eliminado", "El aula ha sido eliminada.", "success");
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0B2A5B",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) deleteMutation.mutate(id);
    });
  };

  // 3. Columnas de TanStack Table
  const columns = [
    columnHelper.accessor("codigo", {
      header: "Código",
      cell: (info) => (
        <span className="font-semibold text-slate-700">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("nombre", { header: "Nombre" }),
    columnHelper.accessor("tipo", {
      header: "Tipo",
      cell: (info) => (
        <span className="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-600 rounded-md uppercase">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("capacidad", {
      header: "Capacidad",
      cell: (info) => info.getValue() || "N/A",
    }),
    columnHelper.accessor("ubicacion", {
      header: "Ubicación",
      cell: (info) => info.getValue() || "N/A",
    }),
    columnHelper.display({
      id: "acciones",
      header: "Acciones",
      cell: (info) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setAulaToEdit(info.row.original);
              setIsModalOpen(true);
            }}
            className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
            title="Editar"
          >
            <LuPencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(info.row.original.id)}
            className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
            title="Eliminar"
          >
            <LuTrash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header de la página */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Gestión de Aulas
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Administra los espacios físicos del instituto.
          </p>
        </div>
        <button
          onClick={() => {
            setAulaToEdit(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-navy-blue rounded-lg hover:bg-navy-blue-light transition-colors shadow-sm"
        >
          <LuPlus className="w-5 h-5" />
          Nueva Aula
        </button>
      </div>

      {/* Tarjeta principal */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Buscador */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="relative w-full max-w-sm">
            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por código o nombre..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-blue/20 focus:border-navy-blue outline-none text-sm"
            />
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-6 py-4 font-semibold">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-10 text-center text-slate-400"
                  >
                    Cargando aulas...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-10 text-center text-red-500"
                  >
                    Error al cargar las aulas.
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-10 text-center text-slate-400"
                  >
                    No se encontraron aulas.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {data && (
          <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <span>
              Mostrando {data.from || 0} a {data.to || 0} de {data.total}{" "}
              registros
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="p-1 rounded-md hover:bg-slate-100 disabled:opacity-50 transition-colors"
              >
                <LuChevronLeft className="w-5 h-5" />
              </button>

              <span className="font-medium text-slate-700">
                Página {data.current_page} de {data.last_page}
              </span>

              <button
                onClick={() => setPage((p) => Math.min(p + 1, data.last_page))}
                disabled={page === data.last_page}
                className="p-1 rounded-md hover:bg-slate-100 disabled:opacity-50 transition-colors"
              >
                <LuChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <AulaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aulaToEdit={aulaToEdit}
      />
    </div>
  );
};

export default AulasPage;
