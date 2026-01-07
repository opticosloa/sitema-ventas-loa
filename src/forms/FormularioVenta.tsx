import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { FormValues } from "../types/ventasFormTypes";
import { useForm, useAuthStore } from "../hooks";
import { validatePrescriptionForm } from "../helpers";
import LOAApi from "../api/LOAApi";
import type { Cliente } from "../types/Cliente";

// Components
import { ClientForm } from "./components/ClientForm";
import { DoctorForm } from "./components/DoctorForm";
import { OpticSection } from "./components/OpticSection";
import { MultifocalForm } from "./components/MultifocalForm";
import { DirectSaleForm } from "./components/DirectSaleForm";
import { FrameSection } from "./components/FrameSection";


const initialForm: FormValues = {
  clienteName: "",
  clienteApellido: "",
  clienteDomicilio: "",
  clienteFechaRecibido: new Date().toISOString().slice(0, 16), // datetime-local format
  clienteTelefono: "",
  clienteFechaEntrega: new Date().toISOString().slice(0, 10), // date format
  clienteDNI: "",
  clienteNameVendedor: "",
  clienteObraSocial: "",

  doctorMatricula: "",
  doctorNombre: "",

  lejos_OD_Esf: "",
  lejos_OD_Cil: "",
  lejos_OD_Eje: "",
  lejos_OD_Add: "",
  lejos_OI_Esf: "",
  lejos_OI_Cil: "",
  lejos_OI_Eje: "",
  lejos_OI_Add: "",
  lejos_DNP: "",
  lejos_Tipo: "",
  lejos_Color: "",
  lejos_Armazon: "",

  cerca_OD_Esf: "",
  cerca_OD_Cil: "",
  cerca_OD_Eje: "",
  cerca_OI_Esf: "",
  cerca_OI_Cil: "",
  cerca_OI_Eje: "",
  cerca_DNP: "",
  cerca_Tipo: "",
  cerca_Color: "",
  cerca_Armazon: "",

  multifocalTipo: "",
  DI_Lejos: "",
  DI_Cerca: "",
  Altura: "",
  Observacion: "",

  cantidadItems: "1",
};


export const FormularioVenta: React.FC = () => {
  const { nombre, apellido } = useAuthStore();
  const { formState, onInputChange, onResetForm, setFieldValue } = useForm(initialForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [isDirectSale, setIsDirectSale] = useState(false);


  useEffect(() => {
    if (nombre && apellido) {
      setFieldValue('clienteNameVendedor', `${nombre} ${apellido}`);
    }
  }, [nombre, apellido]);

  // Destructure for logic use
  const {
    clienteName,
    clienteApellido,
    clienteDomicilio,
    clienteFechaRecibido,
    clienteTelefono,
    clienteDNI,
    clienteObraSocial,

    doctorMatricula,

    // Lejos vars for calculation
    lejos_OD_Esf,
    lejos_OD_Cil,
    lejos_OD_Eje,
    lejos_OD_Add,

    lejos_OI_Esf,
    lejos_OI_Cil,
    lejos_OI_Eje,
    lejos_OI_Add,

    multifocalTipo,
    DI_Lejos,
    DI_Cerca,
    Altura,
    Observacion,
    cantidadItems,
  } = formState as FormValues;

  useEffect(() => {
    // OD Calculation
    if (lejos_OD_Add && lejos_OD_Esf) {
      const esf = parseFloat(lejos_OD_Esf);
      const add = parseFloat(lejos_OD_Add);
      if (!isNaN(esf) && !isNaN(add)) {
        setFieldValue('cerca_OD_Esf', (esf + add).toString());
        // Copy other fields if they exist in Lejos
        if (lejos_OD_Cil) setFieldValue('cerca_OD_Cil', lejos_OD_Cil);
        if (lejos_OD_Eje) setFieldValue('cerca_OD_Eje', lejos_OD_Eje);
      }
    }

    // OI Calculation
    if (lejos_OI_Add && lejos_OI_Esf) {
      const esf = parseFloat(lejos_OI_Esf);
      const add = parseFloat(lejos_OI_Add);
      if (!isNaN(esf) && !isNaN(add)) {
        setFieldValue('cerca_OI_Esf', (esf + add).toString());
        // Copy other fields if they exist in Lejos
        if (lejos_OI_Cil) setFieldValue('cerca_OI_Cil', lejos_OI_Cil);
        if (lejos_OI_Eje) setFieldValue('cerca_OI_Eje', lejos_OI_Eje);
      }
    }
  }, [
    lejos_OD_Esf, lejos_OD_Add, lejos_OD_Cil, lejos_OD_Eje,
    lejos_OI_Esf, lejos_OI_Add, lejos_OI_Cil, lejos_OI_Eje
  ]);

  const clientePayload = {
    nombre: clienteName,
    apellido: clienteApellido,
    dni: clienteDNI,
    telefono: clienteTelefono || null,
    direccion: clienteDomicilio || null,
  };

  const lejos = {
    OD: {
      esfera: formState.lejos_OD_Esf || null,
      cilindro: formState.lejos_OD_Cil || null,
      eje: formState.lejos_OD_Eje || null,
      add: formState.lejos_OD_Add || null,
    },
    OI: {
      esfera: formState.lejos_OI_Esf || null,
      cilindro: formState.lejos_OI_Cil || null,
      eje: formState.lejos_OI_Eje || null,
      add: formState.lejos_OI_Add || null,
    },
    dnp: formState.lejos_DNP || null,
    tipo: formState.lejos_Tipo || null,
    color: formState.lejos_Color || null,
    armazon: formState.lejos_Armazon || null,
  };

  const cerca = {
    OD: {
      esfera: formState.cerca_OD_Esf || null,
      cilindro: formState.cerca_OD_Cil || null,
      eje: formState.cerca_OD_Eje || null,
    },
    OI: {
      esfera: formState.cerca_OI_Esf || null,
      cilindro: formState.cerca_OI_Cil || null,
      eje: formState.cerca_OI_Eje || null,
    },
    dnp: formState.cerca_DNP || null,
    tipo: formState.cerca_Tipo || null,
    color: formState.cerca_Color || null,
    armazon: formState.cerca_Armazon || null,
  };

  const multifocal = {
    tipo: multifocalTipo || null,
    di_lejos: DI_Lejos || null,
    di_cerca: DI_Cerca || null,
    altura: Altura || null,
  };

  const navigate = useNavigate();

  const handleSearchClick = async () => {
    if (!clienteDNI) {
      alert('Ingresá un DNI');
      return;
    }

    setLoading(true);

    try {
      const { data } = await LOAApi.get(
        `/api/clients/by-dni/${clienteDNI}`
      );

      const cliente = data.result.rows[0];
      setCliente(cliente); // Save payload

      setFieldValue('clienteName', cliente.nombre);
      setFieldValue('clienteApellido', cliente.apellido);
      setFieldValue('clienteTelefono', cliente.telefono ?? '');
      setFieldValue('clienteDomicilio', cliente.direccion ?? '');

    } catch (error) {
      console.error('Error al buscar cliente', error);
      alert('Cliente no encontrado');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchDoctor = async () => {
    if (!doctorMatricula) {
      alert('Ingresá una matricula');
      return;
    }

    setLoading(true);

    try {
      const { data } = await LOAApi.get(`/api/doctors/by-matricula/${doctorMatricula}`);

      if (data.result && data.result.length > 0) {
        const doc = data.result[0];
        if (doc.especialidad == null) {
          setFieldValue('doctorNombre', `${doc.nombre}`);
        } else {
          setFieldValue('doctorNombre', `${doc.nombre} - ${doc.especialidad}`);
        }
      } else {
        alert('Doctor no encontrado');
        setFieldValue('doctorNombre', '');
      }

    } catch (error) {
      console.error('Error al buscar doctor', error);
      alert('Error al buscar doctor');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isDirectSale) {
      // Logica simplificada para venta directa
      if (!clienteDNI && !clienteName) {
        alert('Debe ingresar al menos un cliente (buscar por DNI o completar nombre)');
        return;
      }

      try {
        let finalClienteId = cliente?.cliente_id;

        if (!finalClienteId) {
          if (!clienteName || !clienteApellido) {
            alert("Por favor busque un cliente o complete Nombre/Apellido.");
            return;
          }

          // Create client on the fly logic
          const newClientPayload = {
            nombre: clienteName,
            apellido: clienteApellido,
            dni: clienteDNI,
            telefono: clienteTelefono,
            direccion: clienteDomicilio,
            fecha_nacimiento: null
          };

          const createClientRes = await LOAApi.post('/api/clients', newClientPayload);
          if (createClientRes.data.success) {
            finalClienteId = createClientRes.data.result.rows[0].cliente_id;
          }
        }

        // 2. Crear Venta
        const salePayload = {
          cliente_id: finalClienteId,
          urgente: false
        };

        const saleRes = await LOAApi.post('/api/sales', salePayload);
        const { venta_id } = saleRes.data;

        console.log("Venta Directa Creada:", venta_id, "Items:", cantidadItems);

        // We assume total might be 0 initially or backend didn't return it yet, 
        // passing 0 lets FormularioDePago fetch the real value.
        navigate('pago', { state: { ventaId: venta_id, total: 0 } });

      } catch (error) {
        console.error(error);
        alert("Error creando venta directa");
      }
      return;
    }

    const { isValid, errors } = validatePrescriptionForm(formState);
    setFormErrors(errors);
    if (!isValid) return;

    let imageUrl: string | null = null;

    try {
      // 1. Subir imagen
      if (file) {
        const formData = new FormData();
        formData.append('file', file);

        const uploadRes = await LOAApi.post(
          '/api/prescriptions/upload',
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );

        imageUrl = uploadRes.data.imageUrl;
      }

      // 2. Construir payload
      const payload = {
        cliente_id: cliente?.cliente_id ?? null,
        cliente: cliente ? undefined : clientePayload,

        obraSocial: clienteObraSocial || null,
        doctor_id: null,
        matricula: doctorMatricula, // New field
        fecha: clienteFechaRecibido,

        lejos,
        cerca,
        multifocal,

        observaciones: Observacion || null,
        image_url: imageUrl,
      };

      // 3. Guardar receta y venta automatica
      const res = await LOAApi.post('/api/prescriptions', payload);
      const { venta_id } = res.data;

      if (venta_id) {
        navigate('pago', { state: { ventaId: venta_id, total: 0 } });
      } else {
        console.warn("No venta_id returned from prescription creation");
        navigate('pago');
      }

    } catch (error) {
      console.error(error);
      alert('Error al guardar la receta');
    }
  };


  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-white text-2xl font-semibold">Formulario de venta</h2>

        <div className="flex gap-2 items-center">
          <button
            type="button"
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-crema text-sm hover:bg-celeste hover:opacity-85 transition"
            onClick={() => console.log("Agregar cliente")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 -960 960 960" fill="currentColor"><path d="M720-400v-120H600v-80h120v-120h80v120h120v80H800v120h-80Zm-360-80q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm80-80h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0-80Zm0 400Z" /></svg>
            <span className="hidden sm:inline">Agregar cliente</span>
          </button>

          <button
            type="button"
            onClick={() => console.log("Escanear")}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-crema text-sm hover:bg-celeste hover:opacity-85 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 -960 960 960" fill="currentColor"><path d="M80-680v-200h200v80H160v120H80Zm0 600v-200h80v120h120v80H80Zm600 0v-80h120v-120h80v200H680Zm120-600v-120H680v-80h200v200h-80ZM700-260h60v60h-60v-60Zm0-120h60v60h-60v-60Zm-60 60h60v60h-60v-60Zm-60 60h60v60h-60v-60Zm-60-60h60v60h-60v-60Zm120-120h60v60h-60v-60Zm-60 60h60v60h-60v-60Zm-60-60h60v60h-60v-60Zm240-320v240H520v-240h240ZM440-440v240H200v-240h240Zm0-320v240H200v-240h240Zm-60 500v-120H260v120h120Zm0-320v-120H260v120h120Zm320 0v-120H580v120h120Z" /></svg>
            <span className="hidden sm:inline">Escanear receta</span>
          </button>

          <button
            type="button"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition ${isDirectSale ? 'bg-celeste text-negro border-celeste' : 'border-crema hover:bg-celeste hover:opacity-85'}`}
            onClick={() => setIsDirectSale(!isDirectSale)}
          >
            <span>{isDirectSale ? "Modo: Venta Directa" : "Modo: Receta"}</span>
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="flex flex-col gap-4">

        <ClientForm
          formState={formState as FormValues}
          onInputChange={onInputChange}
          handleSearchClick={handleSearchClick}
          loading={loading}
        />

        {isDirectSale ? (
          <DirectSaleForm
            formState={formState as FormValues}
            onInputChange={onInputChange}
          />
        ) : (
          <>
            <DoctorForm
              formState={formState as FormValues}
              onInputChange={onInputChange}
              handleSearchDoctor={handleSearchDoctor}
              loading={loading}
            />

            <section className="bg-opacity-10 border border-blanco rounded-xl p-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <span className="text-lg text-blanco">Subir imagen de receta</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="input w-64"
                />
              </div>
            </section>

            <OpticSection
              title="Lejos"
              prefix="lejos"
              formState={formState as FormValues}
              formErrors={formErrors}
              onInputChange={onInputChange}
            />

            <OpticSection
              title="Cerca"
              prefix="cerca"
              formState={formState as FormValues}
              formErrors={formErrors}
              onInputChange={onInputChange}
            />

            <FrameSection
              formState={formState as FormValues}
              onInputChange={onInputChange}
            />

            <MultifocalForm
              formState={formState as FormValues}
              onInputChange={onInputChange}
            />
          </>
        )}

        {/* ACTIONS */}
        <div className="flex gap-3 mt-2">
          <button
            type="button"
            onClick={onResetForm}
            className="btn-secondary w-1/3"
          >
            Limpiar Datos
          </button>
          <button
            type="button"
            onClick={() => console.log("Repetir receta")}
            className="btn-secondary w-1/3"
          >
            Repetir Receta
          </button>
          <button
            type="submit"
            className="btn-primary w-2/3"
          >
            Guardar
          </button>
        </div>

      </form>


    </div>
  );
};
