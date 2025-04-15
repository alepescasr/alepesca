"use client";

import React, { useEffect } from "react";
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

  // Detectar autocompletado y actualizar el formulario
  useEffect(() => {
    const detectAutofill = () => {
      const inputs = document.querySelectorAll("input");
      inputs.forEach((input) => {
        // -webkit-autofill es la clase que los navegadores añaden a campos autocompletados
        const isAutofilled =
          getComputedStyle(input).webkitBoxShadow.includes(
            "inset 0 0 0 1000px"
          ) ||
          (input.value && !form.getValues()[input.name as keyof FormValues]);

        if (isAutofilled && input.name) {
          // Actualizar el valor en el formulario si ha sido autocompletado
          form.setValue(input.name as keyof FormValues, input.value, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
          });
        }
      });
    };

    // Detectar en eventos comunes después de que el navegador autocompleta
    window.addEventListener("change", detectAutofill);
    window.addEventListener("input", detectAutofill);
    window.addEventListener("blur", detectAutofill);

    // Intentar detectar autofill después de que la página se carga completamente
    setTimeout(detectAutofill, 500);
    setTimeout(detectAutofill, 1000);

    return () => {
      window.removeEventListener("change", detectAutofill);
      window.removeEventListener("input", detectAutofill);
      window.removeEventListener("blur", detectAutofill);
    };
  }, [form]);

  // Observar cambios en el formulario
  React.useEffect(() => {
    const subscription = form.watch((value) => {
      const isValid =
        form.formState.isValid &&
        Object.keys(form.formState.touchedFields).length > 0;
      if (isValid) {
        onFormDataChange(value as FormValues);
      } else {
        onFormDataChange(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [form, onFormDataChange]);

  // Validar el formulario cuando se carga
  React.useEffect(() => {
    form.trigger();

    // Verificar si hay valores autocompletados al inicio
    setTimeout(() => {
      const formValues = form.getValues();
      const hasValues = Object.values(formValues).some(
        (value) => value && typeof value === "string" && value.length > 0
      );

      if (hasValues) {
        // Si hay valores, volver a validar todo el formulario
        form.trigger();
      }
    }, 1000);
  }, [form]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nombre</label>
          <Input
            {...form.register("nombre")}
            placeholder="Tu nombre"
            className="w-full"
            autoComplete="given-name"
            onBlur={(e) => {
              // Asegurarnos que el valor se registre en el blur
              if (e.target.value) {
                form.setValue("nombre", e.target.value, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                });
              }
            }}
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
            {...form.register("apellido")}
            placeholder="Tu apellido"
            className="w-full"
            autoComplete="family-name"
            onBlur={(e) => {
              if (e.target.value) {
                form.setValue("apellido", e.target.value, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                });
              }
            }}
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
            {...form.register("email")}
            type="email"
            placeholder="tu@email.com"
            className="w-full"
            autoComplete="email"
            onBlur={(e) => {
              if (e.target.value) {
                form.setValue("email", e.target.value, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                });
              }
            }}
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
            {...form.register("telefono")}
            placeholder="Tu teléfono"
            className="w-full"
            autoComplete="tel"
            onBlur={(e) => {
              if (e.target.value) {
                form.setValue("telefono", e.target.value, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                });
              }
            }}
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
            {...form.register("direccion")}
            placeholder="Tu dirección completa"
            className="w-full"
            autoComplete="street-address"
            onBlur={(e) => {
              if (e.target.value) {
                form.setValue("direccion", e.target.value, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                });
              }
            }}
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
            {...form.register("ciudad")}
            placeholder="Tu ciudad"
            className="w-full"
            autoComplete="address-level2"
            onBlur={(e) => {
              if (e.target.value) {
                form.setValue("ciudad", e.target.value, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                });
              }
            }}
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
            {...form.register("codigoPostal")}
            placeholder="Tu código postal"
            className="w-full"
            autoComplete="postal-code"
            defaultValue="5600"
            onBlur={(e) => {
              if (e.target.value) {
                form.setValue("codigoPostal", e.target.value, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                });
              }
            }}
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
