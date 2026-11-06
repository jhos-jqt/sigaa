import { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { createPlan, updatePlan, fetchCarrerasSelect } from "./api";
import { LuX } from "react-icons/lu";

const PlanEstudioModal = ({ isOpen, onClose, planToEdit }) => {
  const queryClient = useQueryClient();

  // Cargar carreras para el dropdown
  const { data: carreras = [], isLoading: isLoadingCarreras } = useQuery({
    queryKey: ["carreras-select"],
    queryFn: fetchCarrerasSelect,
    enabled: isOpen, // Solo carga cuando el modal se abre
  });

  const initialState = {
    carrera_id: "",
    numero: "",
    resolucion: "",
    total_semestres: "",
    carga_horaria_total: "",
    estado: "vigente",
  };

  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (planToEdit) {
      setFormData({
        carrera_id: planToEdit.carrera_id || "",
        numero: planToEdit.numero || "",
        resolucion: planToEdit.resolucion || "",
        total_semestres: planToEdit.total_semestres || "",
        carga_horaria_total: planToEdit.carga_horaria_total || "",
        estado: planToEdit.estado || "vigente",
      });
    } else {
      setFormData(initialState);
    }
    setError(null);
  }, [planToEdit, isOpen]);

  const mutation = useMutation({
    mutationFn: planToEdit ? updatePlan : createPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["planes"] });
      Toast.fire({
        icon: "success",
        title: planToEdit
          ? "Plan actualizado correctamente"
          : "Plan creado correctamente",
      });
      onClose();
    },
    onError: (err) => {
      const validationErrors = err.response?.data?.errors;
      if (validationErrors) {
        setError(Object.values(validationErrors)[0][0]);
      } else {
        setError(err.response?.data?.message || "Error al guardar el plan.");
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(planToEdit ? { id: planToEdit.id, ...formData } : formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-5 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">
            {planToEdit ? "Editar Plan de Estudio" : "Nuevo Plan de Estudio"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-red-500 transition-colors"
          >
            <LuX className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          {/* Carrera */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Carrera *
            </label>
            <select
              required
              value={formData.carrera_id}
              onChange={(e) =>
                setFormData({ ...formData, carrera_id: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-navy-blue/20 focus:border-navy-blue outline-none"
              disabled={isLoadingCarreras}
            >
              <option value="">Seleccione una carrera...</option>
              {carreras.map((carrera) => (
                <option key={carrera.id} value={carrera.id}>
                  {carrera.sigla} - {carrera.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                N° de Plan *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.numero}
                onChange={(e) =>
                  setFormData({ ...formData, numero: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-blue/20 focus:border-navy-blue outline-none"
                placeholder="Ej. 1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Estado *
              </label>
              <select
                value={formData.estado}
                onChange={(e) =>
                  setFormData({ ...formData, estado: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-navy-blue/20 focus:border-navy-blue outline-none"
              >
                <option value="vigente">Vigente</option>
                <option value="en_extincion">En Extinción</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Total Semestres *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.total_semestres}
                onChange={(e) =>
                  setFormData({ ...formData, total_semestres: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-blue/20 focus:border-navy-blue outline-none"
                placeholder="Ej. 6"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Carga Horaria Total
              </label>
              <input
                type="number"
                min="1"
                value={formData.carga_horaria_total}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    carga_horaria_total: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-blue/20 focus:border-navy-blue outline-none"
                placeholder="Hrs"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Resolución
            </label>
            <input
              type="text"
              value={formData.resolucion}
              onChange={(e) =>
                setFormData({ ...formData, resolucion: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-blue/20 focus:border-navy-blue outline-none"
              placeholder="Ej. RM 045/2024"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-navy-blue hover:bg-navy-blue-light rounded-lg transition-colors disabled:opacity-50"
            >
              {mutation.isPending ? "Guardando..." : "Guardar Plan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanEstudioModal;
