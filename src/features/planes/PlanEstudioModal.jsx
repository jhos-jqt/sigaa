import { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import Select from "react-select";
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
    estado: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (planToEdit) {
      setFormData({
        carrera_id: planToEdit.carrera_id || "",
        numero: planToEdit.numero || "",
        resolucion: planToEdit.resolucion || "",
        total_semestres: planToEdit.total_semestres || "",
        carga_horaria_total: planToEdit.carga_horaria_total || "",
        estado: planToEdit.estado || "",
      });
    } else {
      setFormData(initialState);
    }
    setErrors({});
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
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        // Si es otro tipo de error (ej. 500), lo mostramos general
        setErrors({
          general: [
            err.response?.data?.message || "Ocurrió un error inesperado.",
          ],
        });
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    mutation.mutate(planToEdit ? { id: planToEdit.id, ...formData } : formData);
  };

  if (!isOpen) return null;

  const renderError = (field) => {
    if (errors[field]) {
      return <p className="mt-1 text-xs text-red-500">{errors[field][0]}</p>;
    }
    return null;
  };

  const carreraOptions = carreras.map((carrera) => ({
    value: carrera.id,
    label: `${carrera.nombre}`,
  }));
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

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          {errors.general && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {errors.general[0]}
            </div>
          )}

          {/* Carrera */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Carrera *
            </label>
            <Select
              options={carreraOptions}
              value={
                carreraOptions.find(
                  (opt) => opt.value === formData.carrera_id,
                ) || null
              }
              onChange={(selectedOption) =>
                setFormData({
                  ...formData,
                  carrera_id: selectedOption?.value || "",
                })
              }
              placeholder="BUSCAR Y SELECCIONAR CARRERA..."
              isDisabled={isLoadingCarreras}
              isClearable={true}
              noOptionsMessage={() => "NO SE ENCONTRARON CARRERAS"}
              styles={{
                control: (base, state) => ({
                  ...base,
                  borderColor: errors.carrera_id ? "#f87171" : "#cbd5e1",
                  borderRadius: "0.5rem",
                  padding: "2px",
                  boxShadow: state.isFocused
                    ? "0 0 0 2px rgba(11, 42, 91, 0.2)"
                    : "none",
                  "&:hover": { borderColor: "#94a3b8" },
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isSelected
                    ? "#0B2A5B"
                    : state.isFocused
                      ? "#f1f5f9"
                      : "white",
                  color: state.isSelected ? "white" : "#334155",
                  cursor: "pointer",
                }),
              }}
            />
            {renderError("carrera_id")}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                N° de Plan *
              </label>
              <input
                type="number"
                min="1"
                value={formData.numero}
                onChange={(e) =>
                  setFormData({ ...formData, numero: e.target.value })
                }
                className={`w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-blue/20 focus:border-navy-blue outline-none uppercase ${
                  errors.numero
                    ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                    : "border-slate-300"
                }`}
                placeholder="Ej. 1"
              />
              {renderError("numero")}
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
                className={`w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-navy-blue/20 focus:border-navy-blue outline-none uppercase ${
                  errors.estado
                    ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                    : "border-slate-300"
                }`}
              >
                <option value="" selected hidden>
                  -- SELECCIONAR --
                </option>
                <option value="vigente">VIGENTE</option>
                <option value="en_extincion">EN EXTINSIÓN</option>
                <option value="inactivo">INACTIVO</option>
              </select>
              {renderError("estado")}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Total Semestres *
              </label>
              <input
                type="number"
                min="1"
                value={formData.total_semestres}
                onChange={(e) =>
                  setFormData({ ...formData, total_semestres: e.target.value })
                }
                className={`w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-blue/20 focus:border-navy-blue outline-none uppercase ${
                  errors.total_semestres
                    ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                    : "border-slate-300"
                }`}
                placeholder="Ej. 6"
              />
              {renderError("total_semestres")}
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
                className={`w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-blue/20 focus:border-navy-blue outline-none uppercase ${
                  errors.carga_horaria_total
                    ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                    : "border-slate-300"
                }`}
                placeholder="Hrs"
              />
              {renderError("carga_horaria_total")}
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
              className={`w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-blue/20 focus:border-navy-blue outline-none uppercase ${
                errors.resolucion
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                  : "border-slate-300"
              }`}
              placeholder="Ej. RM 045/2024"
            />
            {renderError("resolucion")}
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
