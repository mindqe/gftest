import DefaultLayout from './layouts/DefaultLayout';
import './App.css';
import { Route, Switch } from 'react-router-dom';
import routes from './routes';

export default function App() {
  return (
    <div className="podcast-layout-container">
      <DefaultLayout>
        <Switch>
          {routes.map(({ path, component, ...route }) => (
            <Route
              key={path}
              path={path}
              component={component}
              {...route}
            ></Route>
          ))}
        </Switch>
      </DefaultLayout>
    </div>
  );
}
