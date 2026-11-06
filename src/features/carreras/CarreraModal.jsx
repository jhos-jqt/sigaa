import { useState, useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCarrera, updateCarrera } from "./api";
import { LuX, LuUpload, LuImage } from "react-icons/lu";

const API_URL = import.meta.env.VITE_API_URL; // Usamos tu variable de entorno

const CarreraModal = ({ isOpen, onClose, carreraToEdit }) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  const initialState = {
    sigla: "",
    nombre: "",
    nivel: "tecnico_superior",
    sector_productivo: "industrial",
    modalidad: "presencial",
    regimen: "semestral",
    resolucion: "",
    carga_horaria_semanal: "",
    carga_horaria_mensual: "",
    carga_horaria_semestral: "",
    carga_horaria_total: "",
    logo: null,
  };

  const [formData, setFormData] = useState(initialState);
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (carreraToEdit) {
      setFormData({
        sigla: carreraToEdit.sigla || "",
        nombre: carreraToEdit.nombre || "",
        nivel: carreraToEdit.nivel || "tecnico_superior",
        sector_productivo: carreraToEdit.sector_productivo || "industrial",
        modalidad: carreraToEdit.modalidad || "presencial",
        regimen: carreraToEdit.regimen || "semestral",
        resolucion: carreraToEdit.resolucion || "",
        carga_horaria_semanal: carreraToEdit.carga_horaria_semanal || "",
        carga_horaria_mensual: carreraToEdit.carga_horaria_mensual || "",
        carga_horaria_semestral: carreraToEdit.carga_horaria_semestral || "",
        carga_horaria_total: carreraToEdit.carga_horaria_total || "",
        logo: null, // El archivo no se puede pre-cargar por seguridad del navegador
      });

      // Si la carrera ya tiene un logo guardado, lo mostramos en la vista previa
      setPreviewImage(
        carreraToEdit.logo
          ? `${API_URL}/storage/${carreraToEdit.logo.ruta}`
          : null,
      );
    } else {
      setFormData(initialState);
      setPreviewImage(null);
    }
    setError(null);
  }, [carreraToEdit, isOpen]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, logo: file });
      setPreviewImage(URL.createObjectURL(file)); // Vista previa instantánea
    }
  };

  const mutation = useMutation({
    mutationFn: carreraToEdit ? updateCarrera : createCarrera,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carreras"] });
      carreraToEdit
        ? Toast.fire({
            icon: "success",
            title: "Carrera actualizada correctamente",
          })
        : Toast.fire({
            icon: "success",
            title: "Carrera creada correctamente",
          });

      onClose();
    },
    onError: (err) => {
      console.log("STATUS:", err.response?.status);
      console.log("DATA:", err.response?.data); // Aquí verás el error real de Laravel
      console.log("ERROR COMPLETO:", err);
      setError("Revisa la consola para ver el error detallado.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("sigla", formData.sigla);
    data.append("nombre", formData.nombre);
    data.append("nivel", formData.nivel);
    data.append("sector_productivo", formData.sector_productivo);
    data.append("modalidad", formData.modalidad);
    data.append("regimen", formData.regimen);

    if (formData.resolucion) data.append("resolucion", formData.resolucion);
    if (formData.carga_horaria_semanal)
      data.append("carga_horaria_semanal", formData.carga_horaria_semanal);
    if (formData.carga_horaria_mensual)
      data.append("carga_horaria_mensual", formData.carga_horaria_mensual);
    if (formData.carga_horaria_semestral)
      data.append("carga_horaria_semestral", formData.carga_horaria_semestral);
    if (formData.carga_horaria_total)
      data.append("carga_horaria_total", formData.carga_horaria_total);
    if (formData.logo) data.append("logo", formData.logo);

    if (carreraToEdit) {
      mutation.mutate({ id: carreraToEdit.id, formData: data });
    } else {
      mutation.mutate(data);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">
            {carreraToEdit ? "Editar Carrera" : "Nueva Carrera"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-red-500 transition-colors"
          >
            <LuX className="w-6 h-6" />
          </button>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="p-5 space-y-5 overflow-y-auto custom-scrollbar"
        >
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          {/* Subida de Logo */}
          <div className="flex items-center gap-4 p-4 border border-dashed border-slate-300 rounded-xl bg-slate-50">
            <div className="w-16 h-16 rounded-lg bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Logo"
                  className="w-full h-full object-contain"
                />
              ) : (
                <LuImage className="w-8 h-8 text-slate-300" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-700 mb-1">
                Logo de la Carrera
              </p>
              <p className="text-xs text-slate-500 mb-2">
                PNG, JPG o WEBP (Max 2MB)
              </p>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageChange}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="flex items-center gap-1 text-xs font-semibold text-navy-blue bg-navy-blue/10 px-3 py-1.5 rounded-md hover:bg-navy-blue/20 transition-colors"
              >
                <LuUpload className="w-3 h-3" /> Subir Imagen
              </button>
            </div>
          </div>

          {/* Sección 1: Datos Básicos */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
              1. Datos Básicos
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Sigla *
                </label>
                <input
                  type="text"
                  required
                  value={formData.sigla || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sigla: e.target.value.toUpperCase(),
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-blue/20 focus:border-navy-blue outline-none uppercase"
                  placeholder="EJ. EMC"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nombre || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-blue/20 focus:border-navy-blue outline-none uppercase"
                  placeholder="EJ. ELECTROMECÁNICA"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nivel *
                </label>
                <select
                  value={formData.nivel || "tecnico_superior"}
                  onChange={(e) =>
                    setFormData({ ...formData, nivel: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-navy-blue/20 focus:border-navy-blue outline-none uppercase"
                >
                  <option value="tecnico_medio">Técnico Medio</option>
                  <option value="tecnico_superior">Técnico Superior</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Resolución
                </label>
                <input
                  type="text"
                  value={formData.resolucion || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, resolucion: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-blue/20 focus:border-navy-blue outline-none uppercase"
                  placeholder="EJ. RM 045/2024"
                />
              </div>
            </div>
          </div>

          {/* Sección 2: Clasificación */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
              2. Clasificación
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Sector Productivo *
                </label>
                <select
                  value={formData.sector_productivo || "industrial"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sector_productivo: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-navy-blue/20 focus:border-navy-blue outline-none uppercase"
                >
                  <option value="industrial">Industrial</option>
                  <option value="comercial">Comercial</option>
                  <option value="servicios">Servicios</option>
                  <option value="agropecuaria">Agropecuaria</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Modalidad *
                </label>
                <select
                  value={formData.modalidad || "presencial"}
                  onChange={(e) =>
                    setFormData({ ...formData, modalidad: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-navy-blue/20 focus:border-navy-blue outline-none uppercase"
                >
                  <option value="presencial">Presencial</option>
                  <option value="semipresencial">Semipresencial</option>
                  <option value="virtual">Virtual</option>
                  <option value="distancia">A Distancia</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Régimen *
                </label>
                <select
                  value={formData.regimen || "semestral"}
                  onChange={(e) =>
                    setFormData({ ...formData, regimen: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-navy-blue/20 focus:border-navy-blue outline-none uppercase"
                >
                  <option value="semestral">Semestral</option>
                  <option value="anual">Anual</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sección 3: Carga Horaria */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
              3. Carga Horaria
            </h3>
            <div className="grid grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Semanal
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.carga_horaria_semanal || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      carga_horaria_semanal: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-blue/20 focus:border-navy-blue outline-none"
                  placeholder="HRS"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Mensual
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.carga_horaria_mensual || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      carga_horaria_mensual: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-blue/20 focus:border-navy-blue outline-none"
                  placeholder="HRS"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Semestral
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.carga_horaria_semestral || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      carga_horaria_semestral: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-blue/20 focus:border-navy-blue outline-none"
                  placeholder="HRS"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Total
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.carga_horaria_total || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      carga_horaria_total: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-blue/20 focus:border-navy-blue outline-none"
                  placeholder="HRS"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-5 border-t border-slate-100">
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
              {mutation.isPending ? "Guardando..." : "Guardar Carrera"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CarreraModal;
