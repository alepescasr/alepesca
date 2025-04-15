"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  apellido: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  telefono: z.string().min(10, "El teléfono debe tener al menos 10 caracteres"),
  direccion: z
    .string()
    .min(10, "La dirección debe tener al menos 10 caracteres"),
  ciudad: z.string().min(2, "La ciudad debe tener al menos 2 caracteres"),
  codigoPostal: z
    .string()
    .min(4, "El código postal debe tener al menos 5 caracteres"),
});

export type FormValues = z.infer<typeof formSchema>;

interface FormClientInfoProps {
  onFormDataChange: (data: FormValues | null) => void;
}

const FormClientInfo = ({ onFormDataChange }: FormClientInfoProps) => {
  const [hasAutofilledOnce, setHasAutofilledOnce] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      direccion: "",
      ciudad: "",
      codigoPostal: "5600",
    },
    mode: "onChange",
  });

  // Mejorada: Función para verificar y aplicar valores autocompletados
  const checkAndApplyAutofill = () => {
    const inputs = document.querySelectorAll("input");
    let wasAnyFieldAutofilled = false;

    inputs.forEach((input) => {
      // Verificar múltiples indicadores de autocompletado:
      // 1. Estilo especial de webkit
      // 2. El input tiene valor pero el form no lo refleja
      // 3. El input tiene la clase de animación de autocompletado
      const hasWebkitShadow = window
        .getComputedStyle(input)
        .webkitBoxShadow.includes("inset 0 0 0 1000px");
      const hasValueNotInForm =
        input.value && !form.getValues()[input.name as keyof FormValues];
      const hasAutofillAnimation =
        input.matches(":-webkit-autofill") ||
        input.classList.contains("autofill");

      const isAutofilled =
        hasWebkitShadow || hasValueNotInForm || hasAutofillAnimation;

      if (isAutofilled && input.name && input.value) {
        wasAnyFieldAutofilled = true;
        // Actualizar el valor en el formulario
        form.setValue(input.name as keyof FormValues, input.value, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
      }
    });

    // Si algún campo fue autocompletado, validar todo el formulario
    if (wasAnyFieldAutofilled) {
      setHasAutofilledOnce(true);
      setTimeout(() => {
        form.trigger(); // Validar todo el formulario
        validateAndNotify(); // Notificar si el formulario es válido
      }, 100);
    }
  };

  // Función para validar y notificar
  const validateAndNotify = () => {
    const formValues = form.getValues();
    const formErrors = form.formState.errors;
    const hasErrors = Object.keys(formErrors).length > 0;

    if (!hasErrors && Object.values(formValues).every((value) => value)) {
      onFormDataChange(formValues);
    }
  };

  // Detectar autocompletado y actualizar el formulario
  useEffect(() => {
    // Detectar en eventos comunes después de que el navegador autocompleta
    window.addEventListener("input", checkAndApplyAutofill);
    window.addEventListener("change", checkAndApplyAutofill);
    window.addEventListener("blur", checkAndApplyAutofill);
    window.addEventListener("focus", checkAndApplyAutofill);
    window.addEventListener("animationstart", checkAndApplyAutofill);
    document.addEventListener("click", checkAndApplyAutofill);

    // Verificar periódicamente para detectar autocompletado
    const intervals = [
      setTimeout(checkAndApplyAutofill, 100),
      setTimeout(checkAndApplyAutofill, 500),
      setTimeout(checkAndApplyAutofill, 1000),
      setTimeout(checkAndApplyAutofill, 1500),
      setTimeout(checkAndApplyAutofill, 2000),
    ];

    // Verificar en cada interacción con el DOM por un tiempo corto
    const domObserver = new MutationObserver(checkAndApplyAutofill);
    domObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["value", "class"],
    });

    // Limpiar todos los listeners
    return () => {
      window.removeEventListener("input", checkAndApplyAutofill);
      window.removeEventListener("change", checkAndApplyAutofill);
      window.removeEventListener("blur", checkAndApplyAutofill);
      window.removeEventListener("focus", checkAndApplyAutofill);
      window.removeEventListener("animationstart", checkAndApplyAutofill);
      document.removeEventListener("click", checkAndApplyAutofill);
      intervals.forEach(clearTimeout);
      domObserver.disconnect();
    };
  }, [form]);

  // Observar cambios en el formulario
  useEffect(() => {
    const subscription = form.watch((value) => {
      const isValid =
        form.formState.isValid &&
        (Object.keys(form.formState.touchedFields).length > 0 ||
          hasAutofilledOnce);

      if (isValid) {
        onFormDataChange(value as FormValues);
      } else {
        onFormDataChange(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [form, onFormDataChange, hasAutofilledOnce]);

  // Estilo CSS para detectar autocompletado en navegadores
  const autofillDetectionStyle = `
    @keyframes onAutoFillStart { from {} to {} }
    @keyframes onAutoFillCancel { from {} to {} }
    input:-webkit-autofill {
      animation-name: onAutoFillStart;
      transition: background-color 50000s ease-in-out 0s;
    }
    input:not(:-webkit-autofill) {
      animation-name: onAutoFillCancel;
    }
  `;

  // Añadir manejadores de eventos a los inputs comunes
  const addInputHandlers = (fieldName: keyof FormValues) => ({
    ...form.register(fieldName),
    onAnimationStart: (e: React.AnimationEvent) => {
      if (e.animationName === "onAutoFillStart") {
        setHasAutofilledOnce(true);
        checkAndApplyAutofill();
      }
    },
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      checkAndApplyAutofill();
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
      if (e.target.value) {
        form.setValue(fieldName, e.target.value, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
        checkAndApplyAutofill();
      }
    },
  });

  return (
    <div className="space-y-6">
      <style>{autofillDetectionStyle}</style>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nombre</label>
          <Input
            {...addInputHandlers("nombre")}
            placeholder="Tu nombre"
            className="w-full"
            autoComplete="given-name"
          />
          {form.formState.errors.nombre && (
            <p className="text-sm text-red-500">
              {form.formState.errors.nombre.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Apellido</label>
          <Input
            {...addInputHandlers("apellido")}
            placeholder="Tu apellido"
            className="w-full"
            autoComplete="family-name"
          />
          {form.formState.errors.apellido && (
            <p className="text-sm text-red-500">
              {form.formState.errors.apellido.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input
            {...addInputHandlers("email")}
            type="email"
            placeholder="tu@email.com"
            className="w-full"
            autoComplete="email"
          />
          {form.formState.errors.email && (
            <p className="text-sm text-red-500">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Teléfono</label>
          <Input
            {...addInputHandlers("telefono")}
            placeholder="Tu teléfono"
            className="w-full"
            autoComplete="tel"
          />
          {form.formState.errors.telefono && (
            <p className="text-sm text-red-500">
              {form.formState.errors.telefono.message}
            </p>
          )}
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-medium">Dirección</label>
          <Input
            {...addInputHandlers("direccion")}
            placeholder="Tu dirección completa"
            className="w-full"
            autoComplete="street-address"
          />
          {form.formState.errors.direccion && (
            <p className="text-sm text-red-500">
              {form.formState.errors.direccion.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Ciudad</label>
          <Input
            {...addInputHandlers("ciudad")}
            placeholder="Tu ciudad"
            className="w-full"
            autoComplete="address-level2"
          />
          {form.formState.errors.ciudad && (
            <p className="text-sm text-red-500">
              {form.formState.errors.ciudad.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Código Postal</label>
          <Input
            {...addInputHandlers("codigoPostal")}
            placeholder="Tu código postal"
            className="w-full"
            autoComplete="postal-code"
            defaultValue="5600"
          />
          {form.formState.errors.codigoPostal && (
            <p className="text-sm text-red-500">
              {form.formState.errors.codigoPostal.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormClientInfo;
