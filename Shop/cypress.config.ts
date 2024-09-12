import { defineConfig } from 'cypress';
// import { build } from 'vite';
// import { resolve } from 'path';

// async function startViteServer(){
//   try {
//     const configFile = resolve(process.cwd(), 'vite.config.show.ts');
//     console.log('configFile-----------', configFile);
    
//     await build({ configFile });
//     console.log('Vite build completed successfully');
//   } catch (error) {
//     console.error('Vite build failed:', error);
//     throw error;
//   }
// }

// async function stopViteServer(){
//   // TODO:
//   console.log('Vite server stopped');
//   console.error('Vite server not stopped');
// }
 
export default defineConfig({
  e2e: {
    // setupNodeEvents(on, config) {
    //   if (config.isInteractive) {
    //     // Diese Funktion wird für cypress open ausgeführt
    //     console.log('Cypress in interactive mode');
    //     // Fügen Sie hier Ihre spezifische Logik für cypress open hinzu
    //     on('before:browser:launch', startViteServer);
    //     on('after:run', stopViteServer);
    //   } else {
    //     // Diese Funktion wird für cypress run ausgeführt
    //     console.log('Cypress in head less mode');
    //     on('before:run', startViteServer);
    //     on('after:run', stopViteServer);
    //   }
    // },
    experimentalStudio: true,
    chromeWebSecurity: false,
  },
});