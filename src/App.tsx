import DefaultLayout from "./layouts/DefaultLayout";
import './App.css'
import { Route, Switch } from "react-router-dom";
import routes from "./routes";

// import { useAppSelector, useAppDispatch, RootState } from './store/store';
// import { localStorageAppKey, reduxHydrationAction } from "./constants/constants";
// import { fetchPodcastList } from "./store/reducers/podcastSlice/podcastSlice";

// const { isServer } = useSSR();
// let window: any;

export default function App() {
  // const dispatch = useAppDispatch()

  // useEffect(() => {
  //   if (
  //     window.__PRELOADED_STATE__?.podcastApi?.data == null &&
  //     JSON.parse(localStorage.getItem(localStorageAppKey) as string)?.theme ==
  //       null &&
  //     window.matchMedia('(prefers-color-scheme: dark)').matches
  //   ) {
  //     dispatch(fetchPodcastList())
  //   }
  //   if (
  //     !isServer &&

  //     localStorage.getItem(localStorageAppKey) != null
  //   ) {
  //     const localStoragePersistedState: Partial<RootState> = JSON.parse(
  //       localStorage.getItem(localStorageAppKey) as string
  //     )
  //     dispatch({
  //       type: reduxHydrationAction,
  //       payload: localStoragePersistedState
  //     })
  //   }
  // }, [])

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
