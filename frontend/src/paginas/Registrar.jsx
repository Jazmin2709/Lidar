import { useState } from 'react';

export default function Registrar() {

    const [Nombres, setNombres] = useState('Mark');
    const [Apellidos, setApellidos] = useState('Otto');
    const [Gmail, setGmail] = useState('');
    const [Cedula, setCedula] = useState('');
    const [state, setState] = useState('');
    const [zip, setZip] = useState('');
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
                    <span className="input-group-text" id="inputGroupPrepend">@</span>
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
                <div className="col-md-6">
                    <label htmlFor="Cedula" className="form-label">Cédula Ciudadania</label>
                    <input
                    type="number"
                    className="form-control"
                    id="Cedula"
                    value={Cedula}
                    onChange={(e) => setCedula(e.target.value)}
                    required
                    />
                    <div className="invalid-feedback">Por favor ingresa tu número de cédula.</div>
                </div>
                <div className="col-md-3">
                    <label htmlFor="state" className="form-label">State</label>
                    <select
                    className="form-select"
                    id="state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                    >
                    <option value="">Choose...</option>
                    <option value="CA">California</option>
                    <option value="NY">New York</option>
                    {/* Add more states as needed */}
                    </select>
                    <div className="invalid-feedback">Please select a valid state.</div>
                </div>
                <div className="col-md-3">
                    <label htmlFor="zip" className="form-label">Zip</label>
                    <input
                    type="text"
                    className="form-control"
                    id="zip"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    required
                    />
                    <div className="invalid-feedback">Please provide a valid zip.</div>
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
                        Agree to terms and conditions
                    </label>
                    <div className="invalid-feedback">You must agree before submitting.</div>
                    </div>
                </div>
                <div className="col-12">
                    <button className="btn btn-primary" type="submit">
                    Submit form
                    </button>
                        </div>
                        
            </form>
        </div>
    </div>        
);
}
