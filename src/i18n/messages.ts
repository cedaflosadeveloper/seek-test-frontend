export const messages = {
  es: {
    login: {
      title: 'Login',
      usernameLabel: 'Usuario *',
      usernamePlaceholder: 'usuario',
      passwordLabel: 'Contrasena *',
      submit: 'Ingresar',
      submitting: 'Ingresando...'
    },
    tasks: {
      title: 'Tareas',
      subtitle: 'Gestiona estado y elimina tareas',
      create: 'Crear tarea',
      createAria: 'Crear tarea',
      logoutAria: 'Cerrar sesion',
      logoutConfirm: '¿Seguro desea cerrar la sesión del usuario?',
      deleteConfirm: '¿Desea eliminar la tarea?',
      empty: 'No hay tareas. Crea la primera.',
      deleteSuccess: 'Realizado correctamente',
      deleteError: 'Algo salió mal',
      actionSuccess: 'Realizado correctamente',
      actionError: 'Algo salió mal'
    },
    taskForm: {
      titleLabel: 'Titulo *',
      titlePlaceholderCreate: 'Nueva tarea',
      titlePlaceholderEdit: 'Titulo de la tarea',
      descriptionLabel: 'Descripcion *',
      descriptionPlaceholder: 'Detalles y contexto',
      statusLabel: 'Estado *',
      save: 'Guardar tarea',
      saving: 'Guardando...'
    },
    taskEdit: {
      title: 'Editar tarea',
      notFound: 'Tarea no encontrada.',
      confirmSave: '¿Desea guardar los cambios?'
    },
    taskNew: {
      title: 'Nueva tarea',
      confirmSave: '¿Desea guardar la tarea?'
    },
    notFound: {
      title: 'Pagina no encontrada',
      subtitle: '404',
      message: 'La pagina que buscas no existe.',
      goHome: 'Ir al inicio'
    },
    taskNotFound: {
      title: 'Tarea no encontrada',
      message: 'La tarea que buscas no existe o ya fue eliminada.'
    },
    tasksError: {
      title: 'Tareas',
      subtitle: 'Algo salio mal',
      message: 'No pudimos cargar las tareas.'
    },
    taskError: {
      title: 'Editar tarea',
      message: 'No pudimos cargar la tarea.'
    },
    status: {
      todo: 'Por hacer',
      in_progress: 'En progreso',
      done: 'Completada'
    },
    common: {
      yes: 'Sí',
      no: 'No',
      retry: 'Reintentar',
      close: 'Cerrar',
      edit: 'Editar',
      delete: 'Eliminar',
      backToList: 'Volver al listado',
      confirmation: 'Confirmacion',
      language: 'Idioma',
      selectOption: 'Selecciona una opcion'
    },
    meta: {
      appTitle: 'Sistema de Gestion de Tareas',
      appDescription: 'Aplicacion de tareas con auth y CRUD en tiempo real',
      tasksTitle: 'Tareas',
      tasksDescription: 'Listado y gestion de tareas.',
      newTaskTitle: 'Nueva tarea',
      newTaskDescription: 'Crear una nueva tarea.',
      editTaskTitle: 'Editar tarea',
      editTaskDescription: 'Editar tarea',
      taskNotFoundTitle: 'Tarea no encontrada'
    }
  },
  en: {
    login: {
      title: 'Login',
      usernameLabel: 'User *',
      usernamePlaceholder: 'user',
      passwordLabel: 'Password *',
      submit: 'Sign in',
      submitting: 'Signing in...'
    },
    tasks: {
      title: 'Tasks',
      subtitle: 'Manage status and delete tasks',
      create: 'Create task',
      createAria: 'Create task',
      logoutAria: 'Sign out',
      logoutConfirm: 'Are you sure you want to sign out this user?',
      deleteConfirm: 'Do you want to delete the task?',
      empty: 'No tasks yet. Create the first one.',
      deleteSuccess: 'Done successfully',
      deleteError: 'Something went wrong',
      actionSuccess: 'Done successfully',
      actionError: 'Something went wrong'
    },
    taskForm: {
      titleLabel: 'Title *',
      titlePlaceholderCreate: 'New task',
      titlePlaceholderEdit: 'Task title',
      descriptionLabel: 'Description *',
      descriptionPlaceholder: 'Details and context',
      statusLabel: 'Status *',
      save: 'Save task',
      saving: 'Saving...'
    },
    taskEdit: {
      title: 'Edit task',
      notFound: 'Task not found.',
      confirmSave: 'Do you want to save the changes?'
    },
    taskNew: {
      title: 'New task',
      confirmSave: 'Do you want to save the task?'
    },
    notFound: {
      title: 'Page not found',
      subtitle: '404',
      message: "The page you are looking for doesn't exist.",
      goHome: 'Go to start'
    },
    taskNotFound: {
      title: 'Task not found',
      message: "The task you are looking for doesn't exist or was deleted."
    },
    tasksError: {
      title: 'Tasks',
      subtitle: 'Something went wrong',
      message: "We couldn't load the tasks."
    },
    taskError: {
      title: 'Edit task',
      message: "We couldn't load the task."
    },
    status: {
      todo: 'To do',
      in_progress: 'In progress',
      done: 'Done'
    },
    common: {
      yes: 'Yes',
      no: 'No',
      retry: 'Try again',
      close: 'Close',
      edit: 'Edit',
      delete: 'Delete',
      backToList: 'Back to list',
      confirmation: 'Confirmation',
      language: 'Language',
      selectOption: 'Select an option'
    },
    meta: {
      appTitle: 'Task Management System',
      appDescription: 'Task app with auth and real-time CRUD',
      tasksTitle: 'Tasks',
      tasksDescription: 'List and manage tasks.',
      newTaskTitle: 'New task',
      newTaskDescription: 'Create a new task.',
      editTaskTitle: 'Edit task',
      editTaskDescription: 'Edit task',
      taskNotFoundTitle: 'Task not found'
    }
  }
} as const;

export type Locale = keyof typeof messages;
export const defaultLocale: Locale = 'es';

export const isLocale = (value?: string | null): value is Locale =>
  value === 'es' || value === 'en';

export const getMessage = (locale: Locale, key: string): string => {
  const parts = key.split('.');
  let current: any = messages[locale];
  for (const part of parts) {
    current = current?.[part];
  }
  if (typeof current === 'string') return current;
  const fallback: any = messages[defaultLocale];
  let fallbackCurrent = fallback;
  for (const part of parts) {
    fallbackCurrent = fallbackCurrent?.[part];
  }
  return typeof fallbackCurrent === 'string' ? fallbackCurrent : key;
};
