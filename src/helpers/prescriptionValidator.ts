import type { FormValues } from "../types/ventasFormTypes";

export const validatePrescriptionForm = (formState: FormValues) => {
    const errors: Record<string, string> = {};
    let isValid = true;

    // Helper para validar campos numéricos
    const validateField = (fieldName: string, value: string | number, min: number, max: number, label: string) => {
        if (value === "" || value === null || value === undefined) return; // Permitir vacíos si no son obligatorios? 
        // Si el usuario escribió algo, validamos.

        const num = Number(value);

        if (isNaN(num)) {
            errors[fieldName] = `${label} debe ser un número`;
            isValid = false;
            return;
        }

        if (num < min || num > max) {
            errors[fieldName] = `${label} fuera de rango (${min} a ${max})`;
            isValid = false;
        }
    };

    // --- LEJOS ---
    // OD
    validateField('lejos_OD_Esf', formState.lejos_OD_Esf, -20, 20, 'Esfera');
    validateField('lejos_OD_Cil', formState.lejos_OD_Cil, -10, 0, 'Cilindro');
    validateField('lejos_OD_Eje', formState.lejos_OD_Eje, 0, 180, 'Eje');

    // OI
    validateField('lejos_OI_Esf', formState.lejos_OI_Esf, -20, 20, 'Esfera');
    validateField('lejos_OI_Cil', formState.lejos_OI_Cil, -10, 0, 'Cilindro');
    validateField('lejos_OI_Eje', formState.lejos_OI_Eje, 0, 180, 'Eje');

    // --- CERCA ---
    // OD
    validateField('cerca_OD_Esf', formState.cerca_OD_Esf, -20, 20, 'Esfera');
    validateField('cerca_OD_Cil', formState.cerca_OD_Cil, -10, 0, 'Cilindro');
    validateField('cerca_OD_Eje', formState.cerca_OD_Eje, 0, 180, 'Eje');

    // OI
    validateField('cerca_OI_Esf', formState.cerca_OI_Esf, -20, 20, 'Esfera');
    validateField('cerca_OI_Cil', formState.cerca_OI_Cil, -10, 0, 'Cilindro');
    validateField('cerca_OI_Eje', formState.cerca_OI_Eje, 0, 180, 'Eje');

    return { isValid, errors };
};
