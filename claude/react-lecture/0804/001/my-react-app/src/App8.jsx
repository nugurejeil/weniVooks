import items from './data';
import './App.css';

function Name({ name, level }) {
  let levelClass = '';
  if (level >= 60) {
    levelClass = 'legend-level';
  } else if (level >= 50) {
    levelClass = 'high-level';
  } else {
    levelClass = 'low-level';
  }

  return (
    <div className={`name ${levelClass}`}>
      <h2>{name}</h2>
      <p className="level">{levelClass.split('-')[0]}</p>
    </div>
  );
}

function Health({ health, healthmax }) {
  const healthPercentage = (health / healthmax) * 100;
  let healthClass = '';
  if (healthPercentage >= 75) {
    healthClass = 'healthy';
  } else if (healthPercentage >= 50) {
    healthClass = 'moderate';
  } else {
    healthClass = 'critical';
  } 
  return (
    <div className={`health ${healthClass}`}>
      <p>Health: {health}/{healthmax}</p>
    </div>
  );
}

function Card({ item }) {
  return (
    <div className="card">
      <img src="https://picsum.photos/200" alt="" />
      <Name name={item.name} level={item.level} />
      <p>Class: {item.class}</p>
      <p>Level: {item.level}</p>
      <Health health={item.health.current} healthmax={item.health.max} />
      <p>Mana: {item.mana.current}/{item.mana.max}</p>
      <p>Status: {item.status}</p>
      <p>Guild: {item.guild || "None"}</p>
      <p>Achievements: {item.achievements.join(", ")}</p>
      <p>Online: {item.isOnline ? <span className="online-indicator online"></span> : <span className="online-indicator offline"></span>}</p>
      <p>Last Login: {new Date(item.lastLogin).toLocaleString()}</p>
    </div>
  );
}

function App() {
  return (
    <div className="card-container">
      {items.map(item => (
        <Card key={item.id} item={item} />
      ))}
    </div>
  );
}

export default App;