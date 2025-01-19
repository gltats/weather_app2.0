import './App.css';
import Weather from './Weather';

function App() {
  return (
    <div className="App">
		<Weather />
		<footer>
			<p> This project was coded by Sofia and
				 is open-sourced on <a href="https://github.com/gltats/weather_app2.0" target="_blank" rel="noopener noreferrer" >GitHub</a> and hosted on <a href="https://weather-gltats.netlify.app" target="_blank" rel="noopener noreferrer">Netlify</a>. </p>
		</footer>
    </div>
  );
}

export default App;
