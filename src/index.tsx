import { h, render } from "preact";
import App from "./App";

// Must be the first import
import "preact/debug";

const HOST = "http://localhost:8080";

render(<App host={HOST} />, document.getElementById("main") as HTMLElement);
