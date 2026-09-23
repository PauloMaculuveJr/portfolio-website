// Runs in <head> before first paint: a saved choice wins, otherwise follow the OS setting.
// Kept in a plain module so the server layout can inline it.
export const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d)}catch(e){}})()`
