export default function EmpleadosTable({ empleados, onEdit, onDelete }) {
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
            <th style={{ minWidth: 160 }}>Acciones</th>
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
                <div className='d-flex gap-2'>
                  <button className='btn btn-sm btn-primary' onClick={() => onEdit(emp)}>Editar</button>
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
