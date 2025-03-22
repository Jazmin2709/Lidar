import { useState } from 'react';

export default function Registrar() {

    const [Usuario, setUsuario] = useState({
        Nombres: '',
        Apellidos: '',
        Gmail: '',
        TipoDoc: '',
        Cedula: '',
        Celular: '',
        Contraseña: '',
        agreeTerms: false,
    });
    const handleSubmit = (event) => {

    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUsuario((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (

        <div className='row p-5'>
            <div>
                <h1 className='text-center p-5'>
                    FORMULARIO DE REGISTRO
                </h1>
                <br />
                <form className={`row g-3`} noValidate onSubmit={handleSubmit}>
                    <div className="col-md-4">
                        <label htmlFor="Nombres" className="form-label">Nombres</label>
                        <input
                            type="text"
                            className="form-control"
                            id="Nombres"
                            value={Usuario.Nombres}
                            onChange={handleInputChange}
                            required
                        />
                        <div className="valid-feedback">Looks good!</div>
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="Apellidos" className="form-label">Apellidos</label>
                        <input
                            type="text"
                            className="form-control"
                            id="Apellidos"
                            value={Usuario.Apellidos}
                            onChange={handleInputChange}
                            required
                        />
                        <div className="valid-feedback">Looks good!</div>
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="Gmail" className="form-label">Gmail</label>
                        <div className="input-group has-validation">
                            <span className="input-group-text" id="inputGroupPrepend">  </span>
                            <input
                                type="gmail"
                                className="form-control"
                                id="Gmail"
                                aria-describedby="inputGroupPrepend"
                                value={Usuario.Gmail}
                                onChange={handleInputChange}
                                required
                            />
                            <div className="invalid-feedback">Por favor ingresa tu Gmail.</div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="TipoDoc" className="form-label">Tipo de Documento</label>
                        <select
                            className="form-select"
                            id="TipoDoc"
                            value={Usuario.TipoDoc}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Seleccione...</option>
                            <option value="CI">Cédula de ciudadania</option>
                            <option value="PA">Pasaporte</option>
                            <option value="PP">Permiso se permanencia</option>
                            {/* Add more states as needed */}
                        </select>
                        <div className="invalid-feedback">Por favor selecione un tipo de documento.</div>
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="Cedula" className="form-label">Número de Documento</label>
                        <input
                            type="number"
                            className="form-control"
                            id="Cedula"
                            value={Usuario.Cedula}
                            onChange={handleInputChange}
                            required
                        />
                        <div className="invalid-feedback">Por favor ingresa tu número de documento.</div>
                    </div>

                    <div className="col-md-4    ">
                        <label htmlFor="zip" className="form-label">Número de Celular</label>
                        <input
                            type="number"
                            className="form-control"
                            id="Celular"
                            value={Usuario.Celular}
                            onChange={handleInputChange}
                            required
                        />
                        <div className="invalid-feedback">Por favor ingrese su número de celular.</div>
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="Contraseña" className="form-label">Contraseña</label>
                        <input
                            type="text"
                            className="form-control"
                            id="Contraseña"
                            value={Usuario.Contraseña}
                            onChange={handleInputChange}
                            required
                        />
                        <div className="valid-feedback">Looks good!</div>
                    </div>
                    <div className="col-12">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="agreeTerms"
                                checked={Usuario.agreeTerms}
                                onChange={handleInputChange}
                                required
                            />
                            <label className="form-check-label" htmlFor="agreeTerms">
                                Acepto términos y condiciones
                            </label>
                            <div className="invalid-feedback">Acepta los términos y condiciones.</div>
                        </div>
                    </div>
                    <div className="col-12">
                        <button className="btn btn-primary" type="submit">
                            Enviar registro
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
