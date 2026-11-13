import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { fetchPlanes, deletePlan } from "./api";
import PlanEstudioModal from "./PlanEstudioModal";
import {
  LuPencil,
  LuTrash2,
  LuPlus,
  LuSearch,
  LuChevronLeft,
  LuChevronRight,
  LuChevronDown,
  LuChevronUp,
} from "react-icons/lu";

const columnHelper = createColumnHelper();

const PlanesEstudioPage = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [planToEdit, setPlanToEdit] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");

  const {
    data: planes = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["planes"],
    queryFn: fetchPlanes,
  });

  const deleteMutation = useMutation({
    mutationFn: deletePlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["planes"] });
      Swal.fire(
        "Eliminado",
        "El plan de estudio ha sido eliminado.",
        "success",
      );
    },
    onError: () => {
      Swal.fire("Error", "No se pudo eliminar el plan de estudio.", "error");
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

  // Función para renderizar el Badge del Estado
  const renderEstado = (estado) => {
    const styles = {
      vigente: "bg-emerald-50 text-emerald-700 border-emerald-200",
      en_extincion: "bg-amber-50 text-amber-700 border-amber-200",
      inactivo: "bg-red-50 text-red-700 border-red-200",
    };
    const labels = {
      vigente: "VIGENTE",
      en_extincion: "EN EXTINSIÓN",
      inactivo: "INACTIVO",
    };
    return (
      <span
        className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${styles[estado]}`}
      >
        {labels[estado]}
      </span>
    );
  };

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "index",
        header: "#",
        cell: (info) => (
          <span className="text-slate-500">{info.row.index + 1}</span>
        ),
      }),
      columnHelper.accessor("carrera", {
        header: "Carrera",
        cell: (info) => {
          const carrera = info.getValue();
          return carrera ? (
            <div>
              <p className="font-semibold text-slate-700">{carrera.nombre}</p>
            </div>
          ) : (
            "N/A"
          );
        },
      }),
      columnHelper.accessor("numero", {
        header: "N° Plan",
        cell: (info) => (
          <span className="font-medium text-slate-600 uppercase">
            Plan {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("total_semestres", {
        header: "Semestres",
        cell: (info) => `${info.getValue()} SEMESTRES`,
      }),
      columnHelper.accessor("carga_horaria_total", {
        header: "Carga Horaria",
        cell: (info) => (info.getValue() ? `${info.getValue()} HRS` : "N/A"),
      }),
      columnHelper.accessor("estado", {
        header: "Estado",
        cell: (info) => (
          <span className="uppercase">{renderEstado(info.getValue())}</span>
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
                setPlanToEdit(info.row.original);
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
    ],
    [],
  );

  const table = useReactTable({
    data: planes,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const { pageSize, pageIndex } = table.getState().pagination;
  const totalData = table.getFilteredRowModel().rows.length;
  const startRange = pageIndex * pageSize + 1;
  const endRange = Math.min((pageIndex + 1) * pageSize, totalData);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Planes de Estudio
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Administra las mallas curriculares por carrera.
          </p>
        </div>
        <button
          onClick={() => {
            setPlanToEdit(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-navy-blue rounded-lg hover:bg-navy-blue-light transition-colors shadow-sm"
        >
          <LuPlus className="w-5 h-5" />
          Nuevo Plan
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="relative w-full max-w-sm">
            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar plan..."
              value={globalFilter}
              onChange={(e) => {
                setGlobalFilter(e.target.value);
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
                    <th
                      key={header.id}
                      className="px-6 py-4 font-semibold cursor-pointer select-none hover:text-slate-800 transition-colors"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-1">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {
                          {
                            asc: <LuChevronUp className="w-3 h-3" />,
                            desc: <LuChevronDown className="w-3 h-3" />,
                          }[header.column.getIsSorted() ?? null]
                        }
                      </div>
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
                    Cargando planes...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-10 text-center text-red-500"
                  >
                    Error al cargar los planes.
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-10 text-center text-slate-400"
                  >
                    No se encontraron planes de estudio.
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

        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <span>
            Mostrando {totalData === 0 ? 0 : startRange} a {endRange} de{" "}
            {totalData} registros
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-1 rounded-md hover:bg-slate-100 disabled:opacity-50 transition-colors"
            >
              <LuChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-medium text-slate-700">
              Página {pageIndex + 1} de {table.getPageCount() || 1}
            </span>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-1 rounded-md hover:bg-slate-100 disabled:opacity-50 transition-colors"
            >
              <LuChevronRight className="w-5 h-5" />
            </button>
            <select
              value={pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="ml-2 px-2 py-1 text-sm border border-slate-300 rounded-md bg-white outline-none focus:border-navy-blue"
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  Mostrar {size}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <PlanEstudioModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        planToEdit={planToEdit}
      />
    </div>
  );
};

export default PlanesEstudioPage;
