export default function EmpleadosTable({ empleados, onEdit, onToggleActivo }) {
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
            <th style={{ minWidth: 180 }}>Acciones</th>
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
                {emp.activo === 1 ? (
                  <span className="badge bg-success">Activo</span>
                ) : (
                  <span className="badge bg-secondary">Inactivo</span>
                )}
              </td>
              <td>
                <div className='d-flex gap-2'>
                  <button 
                    className='btn btn-sm btn-primary' 
                    onClick={() => onEdit(emp)}
                  >
                    Editar
                  </button>
                  <button 
                    className={`btn btn-sm ${emp.activo === 1 ? 'btn-danger' : 'btn-success'}`} 
                    onClick={() => onToggleActivo(emp)}
                  >
                    {emp.activo === 1 ? 'Desactivar' : 'Activar'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {empleados.length === 0 && (
            <tr><td colSpan={10} className='text-center py-4'>Sin empleados</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
