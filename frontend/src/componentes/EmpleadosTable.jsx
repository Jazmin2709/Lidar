import React from 'react';

const EmpleadosTable = ({ empleados, onToggleActivo, onEditar }) => {
  return (
    <div className="table-responsive" style={{padding: '0 50px  50px' }}>
      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Cédula</th>
            <th>Celular</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empleados.map(emp => (
            <tr key={emp.id_per}>
              <td>{emp.Nombres} {emp.Apellidos}</td>
              <td>{emp.Correo}</td>
              <td>{emp.Cedula}</td>
              <td>{emp.Celular}</td>
              <td>
                {emp.id_rol === 3 ? 'Administrador' : 
                emp.id_rol === 1 ? 'Supervisor' : 
                emp.id_rol === 2 ? 'Empleado' : 
                'Sin rol'}
              </td>
              <td>
                <span className={`badge ${emp.activo === 1 ? 'bg-success' : 'bg-danger'}`}>
                  {emp.activo === 1 ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td>
                <button 
                  className="btn btn-sm btn-outline-primary me-1"
                  onClick={() => onEditar(emp)}
                >
                  <i className="bi bi-pencil"></i> Editar
                </button>
                
                <button 
                  className={`btn btn-sm ${emp.activo === 1 ? 'btn-outline-warning' : 'btn-outline-success'}`}
                  onClick={() => onToggleActivo(emp)}
                >
                  {emp.activo === 1 ? 
                    <><i className="bi bi-person-x"></i> Desactivar</> : 
                    <><i className="bi bi-person-check"></i> Activar</>}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmpleadosTable;