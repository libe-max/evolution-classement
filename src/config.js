module.exports = {
  meta: {
    author: 'Baptiste Bouthier, Maxime Fabas, Dario Ingiusto',
    title: 'Le Tour de France en un clin d\'œil',
    url: 'https://www.liberation.fr/apps/2019/07/le-fil-du-tour-de-france',
    description: 'Comment Egan Bernal a-t-il remporté l\'édition 2019 de la Grande boucle&nbsp;? De la première à la dernière étape, retour sur l\'évolution des écarts entre les principaux protagonistes du Tour, au fil des nombreux rebondissements qui ont émaillé ces trois semaines.',
    image: 'https://www.liberation.fr/apps/2019/07/le-fil-du-tour-de-france/social.jpg',
    xiti_id: 'le-fil-du-tour-de-france'
  },
  tracking: {
    active: false,
    format: 'evolution-classement',
    article: 'le-fil-du-tour-de-france'
  },
  show_header: true,
  statics_url: process.env.NODE_ENV === 'production'
    ? 'https://www.liberation.fr/apps/static'
    : 'http://localhost:3003',
  api_url: process.env.NODE_ENV === 'production'
    ? 'https://libe-labo-2.site/api'
    : 'http://localhost:3004/api',
  stylesheet: 'evolution-classement.css',
  spreadsheet: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRgy36Od6pZVIYc35CRYZDIZbQ6Ib8kwdBP27dEvPaMh9fQWoXp1ft2qWQghDkfXc0KcKRRWtoRa7PL/pub?gid=0&single=true&output=tsv'
}
