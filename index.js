const express = require('express');
const app = express();

const cors = require('cors');
const scrapp = require('./helpers/scrapp');

app.use(express.json());
app.use(cors());

app.post(
   '/api/calificaciones',
   async (req, resp) => {
      const { registro, password, promEsperado } = req.body;
      const {
         semestres,
         materias,
         promedio,
         calificaciones,
         alumno
      } = await scrapp(registro, password);

      
      if(!promedio){
         return resp.json({
            error: true,
         });
      }

      resp.json({
         calificaciones,
         alumno,
         materias,
         promedioGeneral: promedio,
         semestresTotales: semestres,
         puntosPorSacar: promEsperado * 8 - (promedio * semestres),
         error: false,
      });
   }
);

const PORT = 3006;
app.listen(PORT, () => {
});
