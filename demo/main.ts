import { LogStorage, createPanel, installConsoleLogger, installNetworkLogger } from "../src/index";

const storage = new LogStorage({ maxSize: 500 });

createPanel({ storage, initiallyOpen: true, title: "Dev Inspector" });

installConsoleLogger({ emit: (e) => storage.add(e) });
installNetworkLogger({ emit: (e) => storage.add(e), includeBodies: false });

console.log("Dev Inspector demo hazır");


