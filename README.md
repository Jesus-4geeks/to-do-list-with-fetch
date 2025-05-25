# Todo List with Fetch

Evolución del proyecto "To-Do List" básico añadiendo persistencia de datos mediante API REST.

## Cambios principales respecto al proyecto anterior

### 1. **Integración con API REST**
- Servicio `todoAPI.js` que abstrae comunicación con backend
- Operaciones CRUD completas: crear usuario, añadir/eliminar tareas
- Manejo de errores HTTP con propagación hacia componentes

### 2. **Estados asíncronos**
- Estados granulares de carga por operación (`isAddingTask`, `isClearingAll`, `deletingIds`)
- Prevención de operaciones múltiples simultáneas
- Indicadores visuales específicos para cada acción

### 3. **Sincronización automática**
- Inicialización con detección automática de usuario existente
- Refresh de datos tras cada operación CRUD
- Gestión transparente del ciclo de vida del usuario

### 4. **Funcionalidad Clear All**
- Eliminación masiva de todas las tareas
- Implementada mediante `Promise.all()` para operaciones concurrentes
- Mantiene usuario activo (solo elimina tareas)

### 5. **Mejoras de experiencia**
- Input que permanece activo durante operaciones
- Limpieza inmediata del campo tras envío (para UX fluida)
- Estados de error con alertas
- Feedback visual diferenciado por tipo de operación
