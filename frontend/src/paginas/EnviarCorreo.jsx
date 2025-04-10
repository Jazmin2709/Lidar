import React from "react";

return (
    <div className='container-fluid'>
        <div className='justify-content-center align-items-center h-100'>
            <div className='container mt-5 p-5 shadow rounded-5 border-3' style={{ marginBottom: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: 'auto', maxWidth: '400px', backgroundColor: '#ffffff' }}>
                <h1 className='text-center p-5'>
                    Recuperar Contraseña
                </h1>
                <br />
                <form className='d-flex flex-column align-items-center' noValidate onSubmit={handleSubmit}>
                    <div className="mb-3" style={{ width: '300px' }}>
                        <label htmlFor="Cedula" className="form-label">Digite el Correo Electrónico.</label>
                        <input
                            type="text"
                            className="form-control"
                            id="Cedula"
                            value={Usuario.Correo}
                            name='Cedula'
                            onChange={handleInputChange}
                            required
                        />
                        <div className="invalid-feedback">Por favor ingresa tu correo electrónico.</div>
                    </div>
                    <div className="text-center">
                        <button className="btn btn-primary" type="submit">
                            Ingresar
                        </button>
                    </div>
                    <style jsx>{`
                            button.btn.btn-primary:hover {
                            background-color: rgb(73, 1, 141);
                            }
                        `}</style>
                </form>
            </div>
        </div>
    </div>
);