export function getAdminString(code) {
  switch (code) {
    case null: return 'Cargando...'
    case 0: return 'Administrador principal'
    default: return 'Usuario'
  }
}

export function getTypeClass(type) {
  switch (type) {
    case 0: return 'battery'
    case 1: return 'fuel'
    case 2: return 'temperature'
    case 3: return 'access'
    default: return 'generic'
  }
}

export function getTypeText(type) {
  switch (type) {
    case 0: return 'Batería'
    case 1: return 'Combustible'
    case 2: return 'Temperatura'
    case 3: return 'Acceso'
    default: return 'Alerta'
  }
}
