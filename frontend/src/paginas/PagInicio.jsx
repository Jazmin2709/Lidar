import React from 'react'


export default function PagInicio() {

  


  return (
    <div className='container'>
          
      <h1 className='text-warning text-center col p-5 fw-bold fst-italic' >Pagina de inicio</h1>
      
      <div className="row row-cols-1 row-cols-sm-2 align-items-center">
        
        <h1 className='text-center col align-self-center border border-secondary rounded-4 p-3 fst-italic'>Misión
          <p className='text-secondary fst-italic'>
            Hola buenas tardes mi nombre es russel 
          </p>
        </h1>
        
        <h1 className='text-center col align-self-center border border-secondary rounded-4 p-3 fst-italic'>Visión
          <p className='text-secondary fst-italic'>
            Y soy un guia explorador de la tribu 54 guarida 12 
          </p>
        </h1>
      </div>
    </div>
  );
}