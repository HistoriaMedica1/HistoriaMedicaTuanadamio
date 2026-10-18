# Integración de Supabase para guardar JSON de paciente

## 1) Crear la tabla en Supabase

```sql
create table public.patients (
  id bigserial primary key,
  cedula text,
  payload jsonb not null,
  created_at timestamptz default now()
);
```

Si quieres que `cedula` sea única, puedes agregar:

```sql
create unique index patients_cedula_unique
on public.patients (cedula)
where cedula is not null;
```

## 2) Incluir el script en el index

Añade esto en el `<head>` o antes del cierre de `</body>`:

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
  window.SUPABASE_URL = 'https://imecopipntcbzhfznzru.supabase.co';
  window.SUPABASE_KEY = 'sb_publishable_SutBY-NKjnj-2BN5E0qSgA_4DUKzHiX';
</script>
<script src="./supabase-patient-import.js"></script>
```

## 3) Reutilizar desde el HTML si quieres

```html
<button type="button" onclick="savePatientFromJson({
  trabajador_cedula: 'V-12345678',
  trabajador_nombres: 'Ana',
  trabajador_apellidos: 'Pérez'
})">Guardar paciente</button>
```

## 4) Cómo funciona

- El script genera un botón `Importar JSON` en la página.
- Cuando eliges un archivo `.json`, lo parsea.
- Extrae la cédula desde `trabajador_cedula` o `cedula`.
- Inserta el registro en la tabla `public.patients` con:
  - `cedula`
  - `payload` = JSON completo

## 5) Resultado esperado

Se guarda en Supabase algo como:

```json
{
  "cedula": "V-12345678",
  "payload": {
    "trabajador_nombres": "Ana",
    "trabajador_apellidos": "Pérez"
  }
}
```
