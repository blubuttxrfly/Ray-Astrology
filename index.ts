import { registerRootComponent } from "expo";
// @ts-expect-error NativeWind handles CSS as side-effect import on web
import "./src/styles/global.css";
import App from "./App";

registerRootComponent(App);
