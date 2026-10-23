import DevOpsLoop from "@/components/DevOpsLoop";

export default function Home() {
  return (
    <>
      <nav className="nav">
        <div className="container">
          <a className="brand" href="#">
            <span className="brand-mark">D</span>
            DevOps 2
          </a>
          <ul className="nav-links">
            <li><a href="#cours">Les cours</a></li>
          </ul>
        </div>
      </nav>

      <header className="hero">
        <div className="container">
          <div>
            <div className="eyebrow">Module ECUE733 · Site pédagogique</div>
            <h1>Les cours du module DevOps 2</h1>
            <p className="lead">
              De Git au déploiement continu : retrouvez chaque séance, sa durée, son niveau et ses notions clés.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#cours">Voir les cours</a>
            </div>
            <span className="pill">DevOps 2 · TP3</span>
          </div>
          <DevOpsLoop className="loop" />
        </div>
      </header>

      <section id="cours">
        <div className="container">
          <div className="section-head">
            <h2>Les cours</h2>
            <p>Cherchez une notion ou filtrez par niveau.</p>
          </div>
        </div>
      </section>
    </>
  );
}
