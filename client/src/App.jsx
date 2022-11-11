import Demo from './demo/demo_component';
import D2 from './demo/demo2';
import D3 from './demo/demo3post';


function App() {
  
  return (
    <div className="App">

      <div className="relative">
        <div>
          <div>
            <img src="..." />
            <strong>Andrew Alfred</strong>
          </div>
          <div>
            <img src="..." />
            <strong>Debra Houston</strong>
          </div>
        </div>
      </div>
      {/* <Alert type={'error'} title={"this is error"} context={"some wird context etc,some wird context etcsome wird context etc,some wird context etcsome wird context etcsome wird context etcsome wird context etcsome wird context etc ,some wird context etc,some wird context etc,some wird context etc"}/> */}
      
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <Demo/>
      <D2/>
      <D3/>
      
    </div>
    
    
  );
}

export default App;
