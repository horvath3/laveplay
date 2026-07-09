import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "hu";

type Dict = Record<string, { en: string; hu: string }>;

// All UI strings live here. Add a key + both languages to translate a new string.
export const translations = {
  // Nav
  "nav.home": { en: "Home", hu: "Kezdőlap" },
  "nav.library": { en: "Library", hu: "Könyvtár" },
  "nav.mypc": { en: "My PC", hu: "A gépem" },
  "nav.settings": { en: "Settings", hu: "Beállítások" },
  "nav.login": { en: "Login", hu: "Belépés" },
  "nav.downloads": { en: "Downloads", hu: "Letöltések" },
  "nav.screenshots": { en: "Screenshots", hu: "Képernyőképek" },
  "nav.saves": { en: "Game Saves", hu: "Játékmentések" },
  "nav.remote": { en: "Remote Desktop", hu: "Távoli asztal" },
  "nav.activity": { en: "Activity Log", hu: "Eseménynapló" },
  "nav.soon": { en: "Soon", hu: "Hamarosan" },
  "nav.more": { en: "More", hu: "Több" },

  // Hero
  "hero.title": { en: "Play Your Own PC Anywhere", hu: "Játssz a saját gépeddel bárhol" },
  "hero.subtitle": {
    en: "Turn your gaming PC into your own cloud gaming server.",
    hu: "Alakítsd a gépi PC-det saját felhő-gaming szerverré.",
  },
  "hero.play": { en: "Play Now", hu: "Indítás" },
  "hero.viewLibrary": { en: "View Library", hu: "Könyvtár megnyitása" },

  // PC Status
  "pc.status": { en: "PC Status", hu: "Gép állapota" },
  "pc.online": { en: "Online", hu: "Elérhető" },
  "pc.offline": { en: "Offline", hu: "Offline" },
  "pc.cpu": { en: "CPU", hu: "Processzor" },
  "pc.gpu": { en: "GPU", hu: "Videokártya" },
  "pc.ram": { en: "RAM", hu: "Memória" },
  "pc.storage": { en: "Storage", hu: "Tárhely" },
  "pc.internet": { en: "Internet", hu: "Internet" },
  "pc.connect": { en: "Connect", hu: "Csatlakozás" },

  // Home sections
  "home.continue": { en: "Continue Playing", hu: "Folytatás" },
  "home.recent": { en: "Recently Added", hu: "Nemrég hozzáadva" },
  "home.favorites": { en: "Favorite Games", hu: "Kedvenc játékok" },
  "home.quickLaunch": { en: "Quick Launch", hu: "Gyorsindítás" },
  "home.actions": { en: "Recommended Actions", hu: "Javasolt műveletek" },
  "home.wake": { en: "Wake your PC", hu: "Gép ébresztése" },
  "home.wakeDesc": { en: "Send a Wake-on-LAN signal", hu: "Wake-on-LAN jel küldése" },
  "home.update": { en: "Update drivers", hu: "Illesztőprogramok frissítése" },
  "home.updateDesc": { en: "New GPU driver available", hu: "Új GPU illesztőprogram elérhető" },
  "home.optimize": { en: "Optimize storage", hu: "Tárhely optimalizálása" },
  "home.optimizeDesc": { en: "42 GB can be freed up", hu: "42 GB felszabadítható" },

  // Library
  "lib.title": { en: "Game Library", hu: "Játékkönyvtár" },
  "lib.subtitle": {
    en: "All your games from every store, in one place.",
    hu: "Minden játékod egy helyen, minden áruházból.",
  },
  "lib.search": { en: "Search games...", hu: "Játékok keresése..." },
  "lib.all": { en: "All", hu: "Összes" },
  "lib.installed": { en: "Installed", hu: "Telepítve" },
  "lib.favorites": { en: "Favorites", hu: "Kedvencek" },
  "lib.recent": { en: "Recently Played", hu: "Legutóbb játszott" },
  "lib.play": { en: "Play", hu: "Indítás" },
  "lib.install": { en: "Install", hu: "Telepítés" },
  "lib.lastPlayed": { en: "Last played", hu: "Legutóbb" },
  "lib.playTime": { en: "Play time", hu: "Játékidő" },
  "lib.size": { en: "Size", hu: "Méret" },
  "lib.never": { en: "Never", hu: "Soha" },
  "lib.syncSteam": { en: "Sync Steam library", hu: "Steam könyvtár szinkron" },
  "lib.storeConnect": { en: "Connect stores", hu: "Áruházak csatlakoztatása" },

  // My PC
  "mypc.title": { en: "My PC", hu: "A gépem" },
  "mypc.subtitle": {
    en: "Live system information from Lave Agent.",
    hu: "Élő rendszeradatok a Lave Agenttől.",
  },
  "mypc.performance": { en: "Performance", hu: "Teljesítmény" },
  "mypc.temps": { en: "Temperatures", hu: "Hőmérséklet" },
  "mypc.system": { en: "System", hu: "Rendszer" },
  "mypc.network": { en: "Network", hu: "Hálózat" },
  "mypc.streaming": { en: "Streaming", hu: "Streamelés" },
  "mypc.cpuUsage": { en: "CPU Usage", hu: "CPU kihasználtság" },
  "mypc.gpuUsage": { en: "GPU Usage", hu: "GPU kihasználtság" },
  "mypc.ramUsage": { en: "RAM Usage", hu: "Memória használat" },
  "mypc.cpuTemp": { en: "CPU Temp", hu: "CPU hő" },
  "mypc.gpuTemp": { en: "GPU Temp", hu: "GPU hő" },
  "mypc.fan": { en: "Fan Speed", hu: "Ventilátor" },
  "mypc.battery": { en: "Battery", hu: "Akkumulátor" },
  "mypc.runningGame": { en: "Current Game", hu: "Aktuális játék" },
  "mypc.uptime": { en: "Windows Uptime", hu: "Windows üzemidő" },
  "mypc.latency": { en: "Latency", hu: "Késleltetés" },
  "mypc.download": { en: "Download", hu: "Letöltés" },
  "mypc.upload": { en: "Upload", hu: "Feltöltés" },
  "mypc.streamStatus": { en: "Stream Status", hu: "Stream állapot" },
  "mypc.resolution": { en: "Resolution", hu: "Felbontás" },
  "mypc.fps": { en: "FPS", hu: "FPS" },
  "mypc.bitrate": { en: "Bitrate", hu: "Bitráta" },
  "mypc.codec": { en: "Codec", hu: "Kodek" },
  "mypc.quality": { en: "Connection", hu: "Kapcsolat" },
  "mypc.packetLoss": { en: "Packet Loss", hu: "Csomagvesztés" },
  "mypc.controller": { en: "Controller", hu: "Kontroller" },
  "mypc.connected": { en: "Connected", hu: "Csatlakoztatva" },
  "mypc.disconnected": { en: "Disconnected", hu: "Nincs csatlakoztatva" },
  "mypc.idle": { en: "Idle", hu: "Tétlen" },
  "mypc.streaming.active": { en: "Streaming", hu: "Streamel" },

  // Settings
  "set.title": { en: "Settings", hu: "Beállítások" },
  "set.subtitle": {
    en: "Tune your cloud gaming experience.",
    hu: "Hangold a felhő-gaming élményt.",
  },
  "set.appearance": { en: "Appearance", hu: "Megjelenés" },
  "set.darkMode": { en: "Dark Mode", hu: "Sötét mód" },
  "set.darkModeDesc": {
    en: "Use the dark futuristic theme",
    hu: "Sötét, futurisztikus téma használata",
  },
  "set.language": { en: "Language", hu: "Nyelv" },
  "set.languageDesc": { en: "Interface language", hu: "Felület nyelve" },
  "set.stream": { en: "Streaming", hu: "Streamelés" },
  "set.streamQuality": { en: "Streaming Quality", hu: "Stream minőség" },
  "set.balanced": { en: "Balanced", hu: "Kiegyensúlyozott" },
  "set.performance": { en: "Performance", hu: "Teljesítmény" },
  "set.quality": { en: "Quality", hu: "Minőség" },
  "set.resolution": { en: "Resolution", hu: "Felbontás" },
  "set.controllerSupport": { en: "Controller Support", hu: "Kontroller támogatás" },
  "set.controllerDesc": {
    en: "Enable gamepad input over the stream",
    hu: "Gamepad bemenet engedélyezése a streamen",
  },
  "set.automation": { en: "PC Automation", hu: "Gép automatizálás" },
  "set.wol": { en: "Wake-on-LAN", hu: "Wake-on-LAN" },
  "set.wolDesc": {
    en: "Wake your PC remotely before a session",
    hu: "Gép távoli ébresztése munkamenet előtt",
  },
  "set.autoSleep": { en: "Auto sleep after gaming", hu: "Automatikus alvás játék után" },
  "set.autoSleepDesc": {
    en: "Sleep the PC when the session ends",
    hu: "Gép altatása a munkamenet végén",
  },
  "set.autoShutdown": { en: "Auto shutdown after gaming", hu: "Automatikus leállítás játék után" },
  "set.autoShutdownDesc": { en: "Power off after inactivity", hu: "Kikapcsolás tétlenség után" },
  "set.autoSteam": { en: "Auto launch Steam", hu: "Steam automatikus indítása" },
  "set.autoSteamDesc": { en: "Start Steam on connect", hu: "Steam indítása csatlakozáskor" },
  "set.autoReconnect": { en: "Auto reconnect", hu: "Automatikus újracsatlakozás" },
  "set.autoReconnectDesc": {
    en: "Reconnect after a dropped stream",
    hu: "Újracsatlakozás megszakadt stream után",
  },
  "set.notifications": { en: "Notifications", hu: "Értesítések" },
  "set.notifDesc": {
    en: "Session, update and status alerts",
    hu: "Munkamenet, frissítés és állapot értesítések",
  },
  "set.soon": { en: "Coming soon", hu: "Hamarosan" },

  // Login
  "login.welcome": { en: "Welcome back", hu: "Üdv újra" },
  "login.subtitle": {
    en: "Sign in to reach your gaming PC.",
    hu: "Jelentkezz be a gaming gépedhez.",
  },
  "login.email": { en: "Email", hu: "E-mail" },
  "login.password": { en: "Password", hu: "Jelszó" },
  "login.remember": { en: "Remember me", hu: "Emlékezz rám" },
  "login.forgot": { en: "Forgot password?", hu: "Elfelejtett jelszó?" },
  "login.signIn": { en: "Sign In", hu: "Belépés" },
  "login.or": { en: "or continue with", hu: "vagy folytasd" },
  "login.noAccount": { en: "Don't have an account?", hu: "Nincs fiókod?" },
  "login.signUp": { en: "Sign up", hu: "Regisztráció" },

  // Nav additions
  "nav.streaming": { en: "Streaming", hu: "Streamelés" },

  // Home additions
  "home.recommended": { en: "Recommended for You", hu: "Neked ajánljuk" },
  "home.activeStream": { en: "Active Stream", hu: "Aktív stream" },
  "home.connectionQuality": { en: "Connection Quality", hu: "Kapcsolat minősége" },
  "home.viewAll": { en: "View all", hu: "Összes" },
  "home.openStream": { en: "Open stream view", hu: "Stream nézet megnyitása" },
  "home.noStream": { en: "No active stream", hu: "Nincs aktív stream" },
  "home.noStreamDesc": {
    en: "Launch a game to start streaming.",
    hu: "Indíts egy játékot a streameléshez.",
  },
  "home.emptyRow": { en: "Nothing here yet", hu: "Itt még nincs semmi" },
  "home.emptyContinue": {
    en: "Games you play will appear here.",
    hu: "A játszott játékok itt jelennek meg.",
  },
  "home.emptyFav": {
    en: "Mark games as favorite to see them here.",
    hu: "Jelölj kedvencnek játékokat, hogy itt lásd őket.",
  },
  "home.stable": { en: "Stable", hu: "Stabil" },
  "home.jitter": { en: "Jitter", hu: "Ingadozás" },

  // Library additions
  "lib.sort": { en: "Sort", hu: "Rendezés" },
  "lib.sortRecent": { en: "Recently Played", hu: "Legutóbb játszott" },
  "lib.sortName": { en: "Name (A–Z)", hu: "Név (A–Z)" },
  "lib.sortPlaytime": { en: "Most Played", hu: "Legtöbbet játszott" },
  "lib.sortSize": { en: "Largest Size", hu: "Legnagyobb méret" },
  "lib.sortRating": { en: "Top Rated", hu: "Legjobbra értékelt" },
  "lib.empty": { en: "No games found", hu: "Nincs találat" },
  "lib.emptyDesc": {
    en: "Try a different search or filter.",
    hu: "Próbálj más keresést vagy szűrőt.",
  },
  "lib.results": { en: "games", hu: "játék" },
  "lib.details": { en: "Details", hu: "Részletek" },

  // Game details
  "game.back": { en: "Back to Library", hu: "Vissza a könyvtárba" },
  "game.play": { en: "Play Now", hu: "Indítás" },
  "game.install": { en: "Install", hu: "Telepítés" },
  "game.stream": { en: "Stream", hu: "Streamelés" },
  "game.about": { en: "About", hu: "Leírás" },
  "game.achievements": { en: "Achievements", hu: "Eredmények" },
  "game.achievementsSoon": {
    en: "Detailed achievements coming soon",
    hu: "Részletes eredmények hamarosan",
  },
  "game.unlocked": { en: "unlocked", hu: "feloldva" },
  "game.details": { en: "Game Details", hu: "Játék adatok" },
  "game.playTime": { en: "Play Time", hu: "Játékidő" },
  "game.size": { en: "Installed Size", hu: "Telepítési méret" },
  "game.lastPlayed": { en: "Last Played", hu: "Legutóbb játszva" },
  "game.developer": { en: "Developer", hu: "Fejlesztő" },
  "game.publisher": { en: "Publisher", hu: "Kiadó" },
  "game.released": { en: "Released", hu: "Megjelenés" },
  "game.rating": { en: "Critic Score", hu: "Kritikus pontszám" },
  "game.controller": { en: "Controller Support", hu: "Kontroller támogatás" },
  "game.compat": { en: "Streaming Compatibility", hu: "Stream kompatibilitás" },
  "game.notFound": { en: "Game not found", hu: "A játék nem található" },
  "game.notFoundDesc": {
    en: "This title isn't in your library.",
    hu: "Ez a játék nincs a könyvtáradban.",
  },
  "ctrl.full": { en: "Full Support", hu: "Teljes támogatás" },
  "ctrl.partial": { en: "Partial Support", hu: "Részleges támogatás" },
  "ctrl.none": { en: "Not Supported", hu: "Nem támogatott" },
  "compat.optimized": { en: "Optimized", hu: "Optimalizált" },
  "compat.supported": { en: "Supported", hu: "Támogatott" },
  "compat.experimental": { en: "Experimental", hu: "Kísérleti" },

  // Streaming page
  "stream.title": { en: "Streaming", hu: "Streamelés" },
  "stream.subtitle": {
    en: "Live session performance and stream health.",
    hu: "Élő munkamenet teljesítménye és stream állapota.",
  },
  "stream.status": { en: "Stream Status", hu: "Stream állapot" },
  "stream.active": { en: "Streaming", hu: "Streamel" },
  "stream.idle": { en: "Idle", hu: "Tétlen" },
  "stream.connecting": { en: "Connecting", hu: "Csatlakozás" },
  "stream.session": { en: "Session", hu: "Munkamenet" },
  "stream.resolution": { en: "Resolution", hu: "Felbontás" },
  "stream.fps": { en: "Frame Rate", hu: "Képkocka" },
  "stream.bitrate": { en: "Bitrate", hu: "Bitráta" },
  "stream.codec": { en: "Video Codec", hu: "Videó kodek" },
  "stream.latency": { en: "Latency", hu: "Késleltetés" },
  "stream.quality": { en: "Connection Quality", hu: "Kapcsolat minősége" },
  "stream.packetLoss": { en: "Packet Loss", hu: "Csomagvesztés" },
  "stream.hdr": { en: "HDR", hu: "HDR" },
  "stream.audio": { en: "Audio", hu: "Hang" },
  "stream.audioStatus": { en: "Audio Status", hu: "Hang állapot" },
  "stream.audioOn": { en: "Enabled", hu: "Engedélyezve" },
  "stream.audioOff": { en: "Muted", hu: "Némítva" },
  "stream.controllerStatus": { en: "Controller Status", hu: "Kontroller állapot" },
  "stream.player": { en: "Player", hu: "Játékos" },
  "stream.on": { en: "On", hu: "Be" },
  "stream.off": { en: "Off", hu: "Ki" },
  "stream.stop": { en: "Stop Session", hu: "Munkamenet leállítása" },
  "stream.gameName": { en: "Game Name", hu: "Játék neve" },
  "stream.controller": { en: "Controller", hu: "Kontroller" },
  "stream.startStream": { en: "Start Stream", hu: "Stream indítása" },
  "stream.stopStream": { en: "Stop Stream", hu: "Stream leállítása" },
  "stream.restartStream": { en: "Restart Stream", hu: "Stream újraindítása" },
  "stream.working": { en: "Working", hu: "Folyamatban" },
  "stream.noActiveGame": { en: "No active game", hu: "Nincs aktív játék" },
  "stream.noActiveGameDesc": {
    en: "Start a game on the host PC to open a live streaming dashboard.",
    hu: "Indíts egy játékot a gépen az élő streaming dashboardhoz.",
  },
  "stream.controllerEmpty": {
    en: "No controller input detected",
    hu: "Nincs érzékelt kontroller bemenet",
  },
  "stream.sunshineMissing": {
    en: "Sunshine is not installed",
    hu: "A Sunshine nincs telepítve",
  },
  "stream.sunshineMissingDesc": {
    en: "Install and configure Sunshine on the host PC before starting a remote stream.",
    hu: "Telepítsd és állítsd be a Sunshine-t a gépen, mielőtt távoli streamet indítasz.",
  },
  "stream.status.preparing": { en: "Preparing", hu: "Előkészítés" },
  "stream.status.ready": { en: "Ready", hu: "Kész" },
  "stream.status.streaming": { en: "Streaming", hu: "Streamel" },
  "stream.status.stopping": { en: "Stopping", hu: "Leállítás" },
  "stream.status.stopped": { en: "Stopped", hu: "Leállítva" },
  "stream.status.error": { en: "Error", hu: "Hiba" },
  "quality.excellent": { en: "Excellent", hu: "Kiváló" },
  "quality.good": { en: "Good", hu: "Jó" },
  "quality.fair": { en: "Fair", hu: "Megfelelő" },
  "quality.poor": { en: "Poor", hu: "Gyenge" },

  // My PC additions
  "mypc.currentRes": { en: "Current Resolution", hu: "Aktuális felbontás" },
  "mypc.currentFps": { en: "Current FPS", hu: "Aktuális FPS" },
  "mypc.jitter": { en: "Jitter", hu: "Ingadozás" },
  "mypc.viewStream": { en: "View full stream", hu: "Teljes stream nézet" },

  // Common
  "common.online": { en: "Online", hu: "Elérhető" },
  "common.offline": { en: "Offline", hu: "Offline" },
  "common.excellent": { en: "Excellent", hu: "Kiváló" },
  "common.good": { en: "Good", hu: "Jó" },
  "common.hours": { en: "h", hu: "ó" },
  "common.footer": {
    en: "Lave Play — your personal cloud gaming platform.",
    hu: "Lave Play — a személyes felhő-gaming platformod.",
  },
} satisfies Dict;

export type TKey = keyof typeof translations;

interface I18nContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  t: (key: TKey) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "lave-play-lang";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  // Read persisted language after mount to avoid SSR hydration mismatch.
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (stored === "en" || stored === "hu") setLangState(stored);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((prev) => {
      const next = prev === "en" ? "hu" : "en";
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const t = useCallback((key: TKey) => translations[key][lang], [lang]);

  return (
    <I18nContext.Provider value={{ lang, setLang, toggleLang, t }}>{children}</I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
