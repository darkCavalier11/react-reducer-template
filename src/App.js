import { useStateValue } from "./StateProvider";

function App() {
  const [{ msg }, dispatch] = useStateValue();
  return (
    <div className="app">
      <h1>Hi</h1>
    </div>
  );
}

export default App;
