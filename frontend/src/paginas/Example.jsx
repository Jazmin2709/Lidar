import React from 'react'
import Holi from './Holi'

export default function Example() {

    const baseDatos = [
        {
            id: 1,
            name: "Jorge"
        },
        {
            id: 2,
            name: "Luis"
        },
        {
            id: 3,
            name: "Andres"
        },
        {
            id: 4,
            name: "Pedro"
        }
    ]


  return (
    <div>
          {
            baseDatos.map((item) => {
                return <h1 key={item.id}>{item.name}</h1>
            })
        }
      <h1 className='text-warning text-center '>Example</h1>
      <Holi />
    </div>
  );
}
