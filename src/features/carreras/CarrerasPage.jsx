import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { fetchCarreras, deleteCarrera } from "./api";
import CarreraModal from "./CarreraModal";
import {
  LuPencil,
  LuTrash2,
  LuPlus,
  LuSearch,
  LuChevronLeft,
  LuChevronRight,
} from "react-icons/lu";

const API_URL = import.meta.env.VITE_API_URL;

const columnHelper = createColumnHelper();

const CarrerasPage = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [carreraToEdit, setCarreraToEdit] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["carreras", page, search],
    queryFn: () => fetchCarreras({ page, search }),
    keepPreviousData: true,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCarrera,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carreras"] });
      Swal.fire("Eliminado", "La carrera ha sido eliminada.", "success");
    },
    onError: () => {
      Swal.fire("Error", "No se pudo eliminar la carrera.", "error");
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

  const columns = [
    columnHelper.accessor("logo", {
      header: "Logo",
      cell: (info) => {
        const logo = info.row.original.logo;
        return logo ? (
          <img
            src={`${API_URL}/storage/${logo.ruta}`}
            alt="logo"
            className="w-10 h-10 object-contain rounded-md bg-slate-50 p-1"
          />
        ) : (
          <div className="w-10 h-10 bg-slate-100 rounded-md flex items-center justify-center text-slate-400 text-xs">
            N/A
          </div>
        );
      },
    }),
    columnHelper.accessor("sigla", {
      header: "Sigla",
      cell: (info) => <span className="font-semibold">{info.getValue()}</span>,
    }),
    columnHelper.accessor("nombre", { header: "Nombre" }),
    columnHelper.accessor("nivel", {
      header: "Nivel",
      cell: (info) =>
        info.getValue() === "tecnico_superior"
          ? "TÉCNICO SUPERIOR"
          : "TÉCNICO MEDIO",
    }),
    columnHelper.accessor("modalidad", {
      header: "Modalidad",
      cell: (info) => (
        <span className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-md uppercase">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("regimen", {
      header: "Régimen",
      cell: (info) => (
        <span className="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-600 rounded-md uppercase">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("resolucion", {
      header: "Resolución",
      cell: (info) => info.getValue() || "N/A",
    }),
    columnHelper.display({
      id: "acciones",
      header: "Acciones",
      cell: (info) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setCarreraToEdit(info.row.original);
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
            Gestión de Carreras
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Administra las carreras y planes del instituto.
          </p>
        </div>
        <button
          onClick={() => {
            setCarreraToEdit(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-navy-blue rounded-lg hover:bg-navy-blue-light transition-colors shadow-sm"
        >
          <LuPlus className="w-5 h-5" />
          Nueva Carrera
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Buscador */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="relative w-full max-w-sm">
            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por sigla o nombre..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-blue/20 focus:border-navy-blue outline-none text-sm"
            />
          </div>
        </div>

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
                    Cargando carreras...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-10 text-center text-red-500"
                  >
                    Error al cargar las carreras.
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-10 text-center text-slate-400"
                  >
                    No se encontraron carreras.
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

      <CarreraModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        carreraToEdit={carreraToEdit}
      />
    </div>
  );
};

export default CarrerasPage;
