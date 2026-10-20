import { useEffect, useState } from 'react';

function Foto({ src, nombre, apellido }) {
  const [error, setError] = useState(false);
  const iniciales = `${nombre?.[0] ?? ''}${apellido?.[0] ?? ''}`.toUpperCase();

  if (error || !src) {
    return <div className="foto foto-placeholder">{iniciales}</div>;
  }
  return (
    <img
      className="foto"
      src={src}
      alt={`Fotografía de ${nombre} ${apellido}`}
      onError={() => setError(true)}
    />
  );
}

export default function App() {
  const [cv, setCv] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Nginx redirige /api/* al servicio backend:4000
    fetch('/api/cv')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setCv)
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return <main className="estado">No se pudo cargar el CV ({error}).</main>;
  }
  if (!cv) {
    return <main className="estado">Cargando...</main>;
  }

  const { persona, formacion } = cv;

  return (
    <main className="cv">
      <header className="cabecera">
        <Foto src={persona.foto} nombre={persona.nombre} apellido={persona.apellido} />
        <div>
          <h1>
            {persona.nombre} <span>{persona.apellido}</span>
          </h1>
          <dl className="datos">
            <div><dt>Nombre</dt><dd>{persona.nombre}</dd></div>
            <div><dt>Apellido</dt><dd>{persona.apellido}</dd></div>
            <div><dt>Ciudad</dt><dd>{persona.ciudad}</dd></div>
          </dl>
        </div>
      </header>

      <section>
        <h2>Formación académica</h2>
        <ul className="formacion">
          {formacion.map((f) => (
            <li key={f.id}>
              <span className="anio">{f.anio}</span>
              <div>
                <strong>{f.titulo}</strong>
                <p>{f.institucion}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <footer>Datos obtenidos desde MySQL mediante el backend Node.js</footer>
    </main>
  );
}
