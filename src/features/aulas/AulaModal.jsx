import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAula, updateAula } from "./api";
import { LuX } from "react-icons/lu"; // <-- Importamos el Toast

const AulaModal = ({ isOpen, onClose, aulaToEdit }) => {
  const queryClient = useQueryClient();

  const initialState = {
    codigo: "",
    nombre: "",
    tipo: "",
    capacidad: "",
    ubicacion: "",
  };

  const [formData, setFormData] = useState(initialState);

  // Ahora los errores se guardan como un objeto: { codigo: ["Error..."], nombre: [...] }
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (aulaToEdit) {
      setFormData({
        codigo: aulaToEdit.codigo || "",
        nombre: aulaToEdit.nombre || "",
        tipo: aulaToEdit.tipo || "",
        capacidad: aulaToEdit.capacidad || "",
        ubicacion: aulaToEdit.ubicacion || "",
      });
    } else {
      setFormData(initialState);
    }
    setErrors({}); // Limpiar errores al abrir/cerrar
  }, [aulaToEdit, isOpen]);

  const mutation = useMutation({
    mutationFn: aulaToEdit ? updateAula : createAula,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aulas"] });
      Toast.fire({
        icon: "success",
        title: aulaToEdit
          ? "Aula actualizada correctamente"
          : "Aula creada correctamente",
      });
      onClose();
    },
    onError: (err) => {
      // Capturamos el objeto de errores que envía Laravel (422)
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
    setErrors({}); // Limpiamos errores previos antes de enviar
    mutation.mutate(aulaToEdit ? { id: aulaToEdit.id, ...formData } : formData);
  };

  if (!isOpen) return null;

  // Función auxiliar para pintar el error debajo del input
  const renderError = (field) => {
    if (errors[field]) {
      return <p className="mt-1 text-xs text-red-500">{errors[field][0]}</p>;
    }
    return null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        {/* Header Modal */}
        <div className="flex justify-between items-center p-5 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">
            {aulaToEdit ? "Editar Aula" : "Nueva Aula"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-red-500 transition-colors"
          >
            <LuX className="w-6 h-6" />
          </button>
        </div>

        {/* Body Modal */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          {/* Error General (por si falla algo en el servidor) */}
          {errors.general && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {errors.general[0]}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Código *
              </label>
              <input
                type="text"
                value={formData.codigo || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    codigo: e.target.value.toUpperCase(),
                  })
                }
                // Si hay error, el borde se vuelve rojo
                className={`w-full px-3 py-2 border rounded-lg outline-none uppercase transition-colors focus:ring-2 focus:ring-navy-blue/20 focus:border-navy-blue ${
                  errors.codigo
                    ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                    : "border-slate-300"
                }`}
                placeholder="Ej. A-101"
              />
              {renderError("codigo")}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Tipo *
              </label>
              <select
                value={formData.tipo}
                onChange={(e) =>
                  setFormData({ ...formData, tipo: e.target.value })
                }
                className={`w-full px-3 py-2 border rounded-lg outline-none bg-white transition-colors focus:ring-2 focus:ring-navy-blue/20 focus:border-navy-blue uppercase ${
                  errors.tipo
                    ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                    : "border-slate-300"
                }`}
              >
                <option value="">-- Seleccionar --</option>
                <option value="aula">AULA</option>
                <option value="laboratorio">LABORATORIO</option>
                <option value="taller">TALLER</option>
                <option value="auditorio">AUDITORIO</option>
                <option value="otro">OTRO</option>
              </select>
              {renderError("tipo")}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nombre *
            </label>
            <input
              type="text"
              value={formData.nombre || ""}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              className={`w-full px-3 py-2 border rounded-lg outline-none transition-colors focus:ring-2 focus:ring-navy-blue/20 focus:border-navy-blue uppercase ${
                errors.nombre
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                  : "border-slate-300"
              }`}
              placeholder="Ej. Aula de Electromecánica"
            />
            {renderError("nombre")}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Capacidad
              </label>
              <input
                type="number"
                min="1"
                value={formData.capacidad || ""}
                onChange={(e) =>
                  setFormData({ ...formData, capacidad: e.target.value })
                }
                className={`w-full px-3 py-2 border rounded-lg outline-none transition-colors focus:ring-2 focus:ring-navy-blue/20 focus:border-navy-blue uppercase ${
                  errors.capacidad
                    ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                    : "border-slate-300"
                }`}
                placeholder="Ej. 40"
              />
              {renderError("capacidad")}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Ubicación
            </label>
            <textarea
              type="text"
              value={formData.ubicacion || ""}
              onChange={(e) =>
                setFormData({ ...formData, ubicacion: e.target.value })
              }
              className={`w-full px-3 py-2 border rounded-lg outline-none transition-colors focus:ring-2 focus:ring-navy-blue/20 focus:border-navy-blue uppercase ${
                errors.ubicacion
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                  : "border-slate-300"
              }`}
              placeholder="Ej. Edificio A, Piso 2"
            />
            {renderError("ubicacion")}
          </div>

          {/* Footer Modal */}
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
              {mutation.isPending ? "Guardando..." : "Guardar Aula"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AulaModal;
