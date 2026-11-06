import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAula, updateAula } from "./api";
import { LuX } from "react-icons/lu";

const AulaModal = ({ isOpen, onClose, aulaToEdit }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    codigo: "",
    nombre: "",
    tipo: "aula",
    capacidad: "",
    ubicacion: "",
  });
  const [error, setError] = useState(null);

  // Cargar datos si es edición
  useEffect(() => {
    if (aulaToEdit) {
      setFormData(aulaToEdit);
    } else {
      setFormData({
        codigo: "",
        nombre: "",
        tipo: "aula",
        capacidad: "",
        ubicacion: "",
      });
    }
    setError(null);
  }, [aulaToEdit, isOpen]);

  const mutation = useMutation({
    mutationFn: aulaToEdit ? updateAula : createAula,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aulas"] }); // Recarga la tabla automáticamente
      onClose();
    },
    onError: (err) => {
      setError(err.response?.data?.message || "Ocurrió un error al guardar.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(aulaToEdit ? { id: aulaToEdit.id, ...formData } : formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
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
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Código *
              </label>
              <input
                type="text"
                required
                value={formData.codigo}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    codigo: e.target.value.toUpperCase(),
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-blue/20 focus:border-navy-blue outline-none"
                placeholder="Ej. A-101"
              />
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
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-blue/20 focus:border-navy-blue outline-none bg-white"
              >
                <option value="aula">AULA</option>
                <option value="laboratorio">LABORATORIO</option>
                <option value="taller">TALLER</option>
                <option value="auditorio">AUDITORIO</option>
                <option value="otro">OTRO</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nombre *
            </label>
            <input
              type="text"
              required
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-blue/20 focus:border-navy-blue outline-none"
              placeholder="Ej. Aula de Electromecánica"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Capacidad
              </label>
              <input
                type="number"
                min="1"
                value={formData.capacidad}
                onChange={(e) =>
                  setFormData({ ...formData, capacidad: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-blue/20 focus:border-navy-blue outline-none"
                placeholder="Ej. 40"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Ubicación
              </label>
              <input
                type="text"
                value={formData.ubicacion}
                onChange={(e) =>
                  setFormData({ ...formData, ubicacion: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-blue/20 focus:border-navy-blue outline-none"
                placeholder="Ej. Piso 2"
              />
            </div>
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
