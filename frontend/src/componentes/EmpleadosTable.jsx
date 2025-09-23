export default function EmpleadosTable({ empleados, onEdit, onDelete, onToggleActivo }) {
  return (
    <div className='table-responsive'>
      <table className='table table-striped table-bordered align-middle'>
        <thead className='table-light'>
          <tr>
            <th>#</th>
            <th>Correo</th>
            <th>Nombres</th>
            <th>Apellidos</th>
            <th>Cédula</th>
            <th>Celular</th>
            <th>Tipo Doc</th>
            <th>Rol</th>
            <th>Estado</th>
            <th style={{ minWidth: 200 }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empleados.map((emp, idx) => (
            <tr key={emp.id_per}>
              <td>{idx + 1}</td>
              <td>{emp.Correo}</td>
              <td>{emp.Nombres}</td>
              <td>{emp.Apellidos}</td>
              <td>{emp.Cedula}</td>
              <td>{emp.Celular}</td>
              <td>{emp.Tipo_Doc}</td>
              <td>{emp.id_rol}</td>
              <td>
                <span className={`badge ${(emp.activo === 1 || emp.activo === undefined) ? 'bg-success' : 'bg-danger'}`}>
                  {(emp.activo === 1 || emp.activo === undefined) ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td>
                <div className='d-flex gap-2'>
                  <button className='btn btn-sm btn-primary' onClick={() => onEdit(emp)}>Editar</button>
                  {(emp.activo !== undefined) && (
                    <button 
                      className={`btn btn-sm ${emp.activo === 1 ? 'btn-warning' : 'btn-success'}`} 
                      onClick={() => onToggleActivo(emp)}
                    >
                      {emp.activo === 1 ? 'Desactivar' : 'Activar'}
                    </button>
                  )}
                  <button className='btn btn-sm btn-danger' onClick={() => onDelete(emp.id_per)}>Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
          {empleados.length === 0 && (
            <tr><td colSpan={9} className='text-center py-4'>Sin empleados</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
