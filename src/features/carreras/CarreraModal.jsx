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
    nivel: "",
    sector_productivo: "",
    modalidad: "",
    regimen: "",
    resolucion: "",
    logo: null,
  };

  const [formData, setFormData] = useState(initialState);
  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (carreraToEdit) {
      setFormData({
        sigla: carreraToEdit.sigla || "",
        nombre: carreraToEdit.nombre || "",
        nivel: carreraToEdit.nivel || "",
        sector_productivo: carreraToEdit.sector_productivo || "",
        modalidad: carreraToEdit.modalidad || "",
        regimen: carreraToEdit.regimen || "",
        resolucion: carreraToEdit.resolucion || "",
        logo: null,
      });

      setPreviewImage(
        carreraToEdit.logo
          ? `${API_URL}/storage/${carreraToEdit.logo.ruta}`
          : null,
      );
    } else {
      setFormData(initialState);
      setPreviewImage(null);
    }
    setErrors({});
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
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
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

    // 1. Creamos el objeto FormData
    const data = new FormData();

    // 2. Agregamos todos los campos
    data.append("sigla", formData.sigla);
    data.append("nombre", formData.nombre);
    data.append("nivel", formData.nivel);
    data.append("sector_productivo", formData.sector_productivo);
    data.append("modalidad", formData.modalidad);
    data.append("regimen", formData.regimen);

    // Agregamos la resolución solo si tiene valor (porque es opcional)
    if (formData.resolucion) {
      data.append("resolucion", formData.resolucion);
    }

    // 3. Agregamos el archivo SOLO si el usuario seleccionó uno
    if (formData.logo) {
      data.append("logo", formData.logo);
    }

    // 4. Enviamos el FormData a la mutación
    if (carreraToEdit) {
      mutation.mutate({ id: carreraToEdit.id, formData: data });
    } else {
      mutation.mutate(data);
    }
  };

  if (!isOpen) return null;

  const renderError = (field) => {
    if (errors[field]) {
      return <p className="mt-1 text-xs text-red-500">{errors[field][0]}</p>;
    }
  };

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

        <form
          onSubmit={handleSubmit}
          className="p-5 space-y-5 overflow-y-auto custom-scrollbar"
        >
          {errors.general && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {errors.general[0]}
            </div>
          )}

          <div>
            <div
              className={`flex items-center gap-4 p-4 border border-dashed rounded-xl transition-colors ${
                errors.logo
                  ? "border-red-400 bg-red-50"
                  : "border-slate-300 bg-slate-50"
              }`}
            >
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
                <p
                  className={`text-sm font-medium mb-1 ${errors.logo ? "text-red-700" : "text-slate-700"}`}
                >
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
                  className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${
                    errors.logo
                      ? "bg-red-100 text-red-700 hover:bg-red-200"
                      : "bg-navy-blue/10 text-navy-blue hover:bg-navy-blue/20"
                  }`}
                >
                  <LuUpload className="w-3 h-3" /> Subir Imagen
                </button>
              </div>
            </div>
            {renderError("logo")}
          </div>

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
                  value={formData.sigla || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sigla: e.target.value.toUpperCase(),
                    })
                  }
                  className={`w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-blue/20 focus:border-navy-blue outline-none uppercase ${errors.sigla ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : "border-slate-300"}`}
                  placeholder="EJ. EMC"
                />
                {renderError("sigla")}
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={formData.nombre || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  className={`w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-blue/20 focus:border-navy-blue outline-none uppercase ${errors.nombre ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : "border-slate-300"}`}
                  placeholder="EJ. ELECTROMECÁNICA"
                />
                {renderError("nombre")}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nivel *
                </label>
                <select
                  value={formData.nivel}
                  onChange={(e) =>
                    setFormData({ ...formData, nivel: e.target.value })
                  }
                  className={`w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-navy-blue/20 focus:border-navy-blue outline-none uppercase ${errors.nivel ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : "border-slate-300"}`}
                >
                  <option value="" selected hidden>
                    -- SELECCIONAR --
                  </option>
                  <option value="tecnico_medio">TÉCNICO MEDIO</option>
                  <option value="tecnico_superior">TÉCNICO SUPERIOR</option>
                </select>
                {renderError("nivel")}
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
                  className={`w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-blue/20 focus:border-navy-blue outline-none uppercase ${errors.resolucion ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : "border-slate-300"}`}
                  placeholder="EJ. RM 045/2024"
                />
                {renderError("resolucion")}
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
              2. Clasificación
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Sector Productivo *
                </label>
                <select
                  value={formData.sector_productivo || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sector_productivo: e.target.value,
                    })
                  }
                  className={`w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-navy-blue/20 focus:border-navy-blue outline-none uppercase ${errors.sector_productivo ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : "border-slate-300"}`}
                >
                  <option value="" selected hidden>
                    -- Seleccionar --
                  </option>
                  <option value="industrial">INDUSTRIAL</option>
                  <option value="comercial">COMERCIAL</option>
                  <option value="servicios">SERVICIOS</option>
                  <option value="agropecuaria">AGROPECUARIA</option>
                </select>
                {renderError("sector_productivo")}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Modalidad *
                </label>
                <select
                  value={formData.modalidad || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, modalidad: e.target.value })
                  }
                  className={`w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-navy-blue/20 focus:border-navy-blue outline-none uppercase ${errors.modalidad ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : "border-slate-300"}`}
                >
                  <option value="">-- Seleccionar --</option>
                  <option value="presencial">PRESENCIAL</option>
                  <option value="semipresencial">SEMIPRESENCIAL</option>
                  <option value="virtual">VIRTUAL</option>
                  <option value="distancia">A DISTANCIA</option>
                </select>
                {renderError("modalidad")}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Régimen *
                </label>
                <select
                  value={formData.regimen || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, regimen: e.target.value })
                  }
                  className={`w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-navy-blue/20 focus:border-navy-blue outline-none uppercase ${errors.regimen ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : "border-slate-300"}`}
                >
                  <option value="" selected hidden>
                    -- Seleccionar --
                  </option>
                  <option value="semestral">SEMESTRAL</option>
                  <option value="anual">ANUAL</option>
                </select>
                {renderError("regimen")}
              </div>
            </div>
          </div>

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
