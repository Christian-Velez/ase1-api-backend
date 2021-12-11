const { chromium } = require('playwright');



const promedio = (calificaciones) => {
   let aux = 0;
   calificaciones.forEach(calificacion => {
      aux += parseInt(calificacion);
   });

   return aux / calificaciones.length;

};

module.exports = async (registro, password) => {
   try {
      const browser = await chromium.launch();
      const page = await browser.newPage();

      await page.goto(
         'https://ase1.ceti.mx/tecnologo/'
      );

      await page.fill(
         'input[name="registro"]',
         registro
      );
      await page.fill(
         'input[name="password"]',
         password
      );
      await page.click(
         'input[value="INGRESAR AL SISTEMA"]'
      );
      
      //await page.click('text=Kardex Calificaciones');

      await page.goto(
         'https://ase1.ceti.mx/tecnologo/tgoalumno/kardex'
      );


      const alumnoTD = await page.$('td:right-of(:text(" Nombre: "))');
      const alumno = await alumnoTD.innerText();


      const ths = await page.$$('th');

      let allTexts = await Promise.all(
         ths.map(async (th) => {
            const text = await th.innerText();
            return text;
         })
      );

      
      allTexts = allTexts.filter(function (text) {
         return text !== undefined;
      });

      const calificaciones = allTexts.filter(text => !isNaN(text));
      const semestres = allTexts.filter(text => text.includes('Nivel'));

      await browser.close();

      return {
         calificaciones,
         alumno,
         materias: calificaciones.length,
         promedio: promedio(calificaciones),
         semestres: semestres.length
      };
   } catch (err) {
      return {
         err
      };
   }
};
