import { useState } from 'react';

export default function Registrar() {

    const [Nombres, setNombres] = useState('');
    const [Apellidos, setApellidos] = useState('');
    const [Gmail, setGmail] = useState('');
    const [TipoDoc, setTipoDoc] = useState('');
    const [Cedula, setCedula] = useState('');
    const [Celular, setCelular] = useState('');
    const [Contraseña, setContraseña] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [validated, setValidated] = useState(false);

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false || !agreeTerms) {
            event.preventDefault();
            event.stopPropagation();
        }
        setValidated(true);
    };

    return (

        <div className='row p-5'>
            <div>
                <h1 className='text-center p-5'>
                    FORMULARIO DE REGISTRO
                </h1>
                <br />
                <form className={`row g-3 ${validated ? 'was-validated' : ''}`} noValidate onSubmit={handleSubmit}>
                    <div className="col-md-4">
                        <label htmlFor="Nombres" className="form-label">Nombres</label>
                        <input
                            type="text"
                            className="form-control"
                            id="Nombres"
                            value={Nombres}
                            onChange={(e) => setNombres(e.target.value)}
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
                            value={Apellidos}
                            onChange={(e) => setApellidos(e.target.value)}
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
                                value={Gmail}
                                onChange={(e) => setGmail(e.target.value)}
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
                            value={TipoDoc}
                            onChange={(e) => setTipoDoc(e.target.value)}
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
                            value={Cedula}
                            onChange={(e) => setCedula(e.target.value)}
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
                            value={Celular}
                            onChange={(e) => setCelular(e.target.value)}
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
                            value={Contraseña}
                            onChange={(e) => setContraseña(e.target.value)}
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
                                checked={agreeTerms}
                                onChange={(e) => setAgreeTerms(e.target.checked)}
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
