import { h, render } from "preact";
import App from "./App";

const HOST = "http://localhost:8080";

render(<App host={HOST} />, document.getElementById("main") as HTMLElement);
