import ROUTES from "./routes";
import { RenderRoutes } from "./utils/routes";
import { BrowserRouter as Router } from 'react-router-dom'

function App() {

  return (
    <Router>
      <RenderRoutes routes={ROUTES} />
    </Router>
  );
}

export default App;
