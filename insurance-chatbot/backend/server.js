const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
const qaPairs = [
  {
    question: 'Care este numărul maxim de medicamente compensate sau gratuite pe care le pot primi lunar pe o rețetă?',
    answer: 'Numărul de medicamente compensate este stabilit în funcție de afecțiune și schema de tratament, dar există o limită valorică lunară conform reglementărilor CNAS.' },
  { 
    question: 'Câte consultații pot avea cu o singură trimitere de la medicul de familie?',
    answer: 'O singură trimitere de la medicul de familie este valabilă pentru o consultație la o specialitate medicală și este valabilă de obicei timp de 60 de zile.' }  ,
  {
    question: 'Cum pot verifica dacă sunt asigurat la sănătate?',
    answer: 'Poți verifica statusul de asigurat pe site-ul oficial CNAS: https://siui.casan.ro/asigurati/'
  },
  {
    question: 'Câte consultații pot face cu o singură trimitere medicală?',
    answer: 'O trimitere permite o singură consultație la fiecare specialitate. Detalii: https://www.cnas.ro/page/pachet-de-baza.html'
  },
  {
    question: 'Ce trebuie să fac dacă nu sunt angajat dar vreau asigurare medicală?',
    answer: 'Poți depune Declarația unică (D212) și plăti CASS. Detalii: https://static.anaf.ro/static/10/Anaf/Declaratii_R/212.html'
  },
  {
    question: 'Cine poate fi coasigurat pe cardul meu?',
    answer: 'Soțul/soția, părinții fără venituri, copiii — vezi condițiile pe https://www.cnas.ro/page/coasigurati.html'
  },
  {
    question: 'Pot primi servicii dacă nu am cardul de sănătate fizic?',
    answer: 'Da. Statusul tău e verificat electronic. Info: https://www.cnas.ro/page/card-national.html'
  },
  {
    question: 'Care este valabilitatea cardului național de sănătate?',
    answer: 'Cardul este valabil 7 ani. Verifică detalii aici: https://www.cnas.ro/page/card-national.html'
  },
  {
    question: 'Ce include pachetul de bază al serviciilor medicale?',
    answer: 'Consultații, tratamente, investigații, urgențe. Lista completă: https://www.cnas.ro/page/pachet-de-baza.html'
  },
  {
    question: 'Pot schimba medicul de familie?',
    answer: 'Da, după minimum 6 luni. Procedura: https://www.cnas.ro/page/medic-de-familie.html'
  },
  {
    question: 'Cum obțin cardul european de sănătate?',
    answer: 'Depui cerere la casa de sănătate. Info complet: https://www.cnas.ro/page/cardul-european.html'
  },
  {
    question: 'Sunt acoperite medicamentele pentru boli cronice?',
    answer: 'Da, prin rețete compensate. Detalii: https://www.cnas.ro/page/lista-medicamente.html'
  },
  {
    question: 'Pot beneficia de consultații la domiciliu?',
    answer: 'Da, la recomandarea medicului de familie. Vezi: https://www.cnas.ro/page/pachet-de-baza.html'
  },
  {
    question: 'Sunt consultațiile prenatale acoperite?',
    answer: 'Da. Consultațiile prenatale și nașterea sunt gratuite pentru femeile gravide. Info: https://www.cnas.ro/page/pachet-de-baza.html'
  },
];

const removeDiacritics = (str) => str.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();

function significantWords(str) {
  return removeDiacritics(str)
    .split(/\s+/)
    .filter(w => w.length >= 3);
}

app.post('/ask', (req, res) => {
  const userQuestion = req.body.question || '';
  const userWords = significantWords(userQuestion);
  let match = null;
  if (userWords.length > 0) {
    match = qaPairs.find(q => {
      const qWords = significantWords(q.question);
      // Count how many user words are in the question
      const common = userWords.filter(w => qWords.includes(w));
      return common.length >= 2; // at least 2 significant words in common
    });
  }
  if (match) {
    res.json({ answer: match.answer });
  } else {
    res.json({ answer: "Sorry, I don't know the answer to that. Please contact support for more help." });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
}); 