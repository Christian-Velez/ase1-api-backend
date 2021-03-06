const express = require('express');
const app = express();

const cors = require('cors');
const scrapp = require('./helpers/scrapp');

app.use(express.json());
app.use(cors());


app.get('/', (req, resp) => {
   resp.send('<h1>ase1 api</h1>');
});

app.post(
   '/api/calificaciones',
   async (req, resp) => {
      const { registro, password, promEsperado } = req.body;
      const {
         semestres,
         materias,
         promedio,
         calificaciones,
         alumno,
         error
      } = await scrapp(registro, password);

      
      if(!promedio){
         return resp.json({
            error: error.message
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

const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
   console.log('running on port', PORT);
});
