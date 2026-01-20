export type DataType = {
  id: number
  avatar: string
  fullName: string
  post: string
  email: string
  city: string
  start_date: string
  salary: number
  age: number
  experience: string
  status: number
  name: string
  username: string
}

const data: DataType[] = [
  {
    id: 1,
    avatar: '8.png',
    fullName: "Korrie O'Crevy",
    post: 'Nuclear Power Engineer',
    email: 'kocrevy0@thetimes.co.uk',
    city: 'Krasnosilka',
    start_date: '09/23/2016',
    salary: 23896.35,
    age: 61,
    experience: '1 Year',
    status: 2,
    name: "Korrie O'Crevy", // Dummy name
    username: 'korrie.o.crevy' // Dummy username
  },
  {
    id: 7,
    avatar: '',
    fullName: 'Eileen Diehn',
    post: 'Environmental Specialist',
    email: 'ediehn6@163.com',
    city: 'Lampuyang',
    start_date: '10/15/2017',
    salary: 18991.67,
    age: 59,
    experience: '9 Years',
    status: 3,
    name: 'Eileen Diehn', // Dummy name
    username: 'eileen.diehn' // Dummy username
  },
  {
    id: 11,
    avatar: '',
    fullName: 'De Falloon',
    post: 'Sales Representative',
    email: 'dfalloona@ifeng.com',
    city: 'Colima',
    start_date: '06/12/2018',
    salary: 19252.12,
    age: 30,
    experience: '0 Year',
    status: 4,
    name: 'De Falloon', // Dummy name
    username: 'de.falloon' // Dummy username
  },
  {
    id: 3,
    avatar: '7.png',
    fullName: 'Stella Ganderton',
    post: 'Operator',
    email: 'sganderton2@tuttocitta.it',
    city: 'Golcowa',
    start_date: '03/24/2018',
    salary: 13076.28,
    age: 66,
    experience: '6 Years',
    status: 5,
    name: 'Stella Ganderton', // Dummy name
    username: 'stella.ganderton' // Dummy username
  },
  {
    id: 5,
    avatar: '',
    fullName: 'Harmonia Nisius',
    post: 'Senior Cost Accountant',
    email: 'hnisius4@gnu.org',
    city: 'Lucan',
    start_date: '08/25/2017',
    salary: 10909.52,
    age: 33,
    experience: '3 Years',
    status: 2,
    name: 'Harmonia Nisius', // Dummy name
    username: 'harmonia.nisius' // Dummy username
  },
  {
    id: 6,
    avatar: '',
    fullName: 'Genevra Honeywood',
    post: 'Geologist',
    email: 'ghoneywood5@narod.ru',
    city: 'Maofan',
    start_date: '06/01/2017',
    salary: 17803.8,
    age: 61,
    experience: '1 Year',
    status: 1,
    name: 'Genevra Honeywood', // Dummy name
    username: 'genevra.honeywood' // Dummy username
  },
  {
    id: 4,
    avatar: '8.png',
    fullName: 'Dorolice Crossman',
    post: 'Cost Accountant',
    email: 'dcrossman3@google.co.jp',
    city: 'Paquera',
    start_date: '12/03/2017',
    salary: 12336.17,
    age: 22,
    experience: '2 Years',
    status: 2,
    name: 'Dorolice Crossman', // Dummy name
    username: 'dorolice.crossman' // Dummy username
  },
  {
    id: 8,
    avatar: '7.png',
    fullName: 'Richardo Aldren',
    post: 'Senior Sales Associate',
    email: 'raldren7@mtv.com',
    city: 'Skoghall',
    start_date: '11/05/2016',
    salary: 19230.13,
    age: 55,
    experience: '5 Years',
    status: 3,
    name: 'Richardo Aldren', // Dummy name
    username: 'richardo.aldren' // Dummy username
  },
  {
    id: 9,
    avatar: '2.png',
    fullName: 'Allyson Moakler',
    post: 'Safety Technician',
    email: 'amoakler8@shareasale.com',
    city: 'Mogilany',
    start_date: '12/29/2018',
    salary: 11677.32,
    age: 39,
    experience: '9 Years',
    status: 5,
    name: 'Allyson Moakler', // Dummy name
    username: 'allyson.moakler' // Dummy username
  },
  {
    id: 10,
    avatar: '7.png',
    fullName: 'Merline Penhalewick',
    post: 'Junior Executive',
    email: 'mpenhalewick9@php.net',
    city: 'Kanuma',
    start_date: '04/19/2019',
    salary: 15939.52,
    age: 23,
    experience: '3 Years',
    status: 2,
    name: 'Merline Penhalewick', // Dummy name
    username: 'merline.penhalewick' // Dummy username
  },

  {
    id: 12,
    avatar: '',
    fullName: 'Cyrus Gornal',
    post: 'Senior Sales Associate',
    email: 'cgornalb@fda.gov',
    city: 'Boro Utara',
    start_date: '12/09/2017',
    salary: 16745.47,
    age: 22,
    experience: '2 Years',
    status: 4,
    name: 'Cyrus Gornal', // Dummy name
    username: 'cyrus.gornal' // Dummy username
  },
  {
    id: 13,
    avatar: '',
    fullName: 'Tallou Balf',
    post: 'Staff Accountant',
    email: 'tbalfc@sina.com.cn',
    city: 'Siliana',
    start_date: '01/21/2016',
    salary: 15488.53,
    age: 36,
    experience: '6 Years',
    status: 4,
    name: 'Tallou Balf', // Dummy name
    username: 'tallou.balf' // Dummy username
  },
  {
    id: 14,
    avatar: '',
    fullName: 'Othilia Extill',
    post: 'Associate Professor',
    email: 'oextilld@theatlantic.com',
    city: 'Brzyska',
    start_date: '02/01/2016',
    salary: 18442.34,
    age: 43,
    experience: '3 Years',
    status: 2,
    name: 'Othilia Extill', // Dummy name
    username: 'othilia.extill' // Dummy username
  },
  {
    id: 15,
    avatar: '',
    fullName: 'Wilmar Bourton',
    post: 'Administrative Assistant',
    email: 'wbourtone@sakura.ne.jp',
    city: 'Bích Động',
    start_date: '04/25/2018',
    salary: 13304.45,
    age: 19,
    experience: '9 Years',
    status: 5,
    name: 'Wilmar Bourton', // Dummy name
    username: 'wilmar.bourton' // Dummy username
  },
  {
    id: 16,
    avatar: '4.png',
    fullName: 'Robinson Brazenor',
    post: 'General Manager',
    email: 'rbrazenorf@symantec.com',
    city: 'Gendiwu',
    start_date: '12/23/2017',
    salary: 11953.08,
    age: 66,
    experience: '6 Years',
    status: 5,
    name: 'Robinson Brazenor', // Dummy name
    username: 'robinson.brazenor' // Dummy username
  },
  {
    id: 17,
    avatar: '',
    fullName: 'Nadia Bettenson',
    post: 'Environmental Tech',
    email: 'nbettensong@joomla.org',
    city: 'Chabařovice',
    start_date: '07/11/2018',
    salary: 20484.44,
    age: 64,
    experience: '4 Years',
    status: 1,
    name: 'Nadia Bettenson', // Dummy name
    username: 'nadia.bettenson' // Dummy username
  },
  {
    id: 18,
    avatar: '',
    fullName: 'Titus Hayne',
    post: 'Web Designer',
    email: 'thayneh@kickstarter.com',
    city: 'Yangon',
    start_date: '05/25/2019',
    salary: 16871.48,
    age: 59,
    experience: '9 Years',
    status: 1,
    name: 'Titus Hayne', // Dummy name
    username: 'titus.hayne' // Dummy username
  },
  {
    id: 19,
    avatar: '4.png',
    fullName: 'Roxie Huck',
    post: 'Administrative Assistant',
    email: 'rhucki@ed.gov',
    city: 'Polýkastro',
    start_date: '04/04/2019',
    salary: 19653.56,
    age: 41,
    experience: '1 Year',
    status: 4,
    name: 'Roxie Huck', // Dummy name
    username: 'roxie.huck' // Dummy username
  },
  {
    id: 20,
    avatar: '7.png',
    fullName: 'Latashia Lewtey',
    post: 'Actuary',
    email: 'llewteyj@sun.com',
    city: 'Hougong',
    start_date: '08/03/2017',
    salary: 18303.87,
    age: 35,
    experience: '5 Years',
    status: 1,
    name: 'Latashia Lewtey', // Dummy name
    username: 'latashia.lewtey' // Dummy username
  },
  {
    id: 21,
    avatar: '',
    fullName: 'Natalina Tyne',
    post: 'Software Engineer',
    email: 'ntynek@merriam-webster.com',
    city: 'Yanguan',
    start_date: '03/16/2019',
    salary: 15256.4,
    age: 30,
    experience: '0 Year',
    status: 2,
    name: 'Natalina Tyne', // Dummy name
    username: 'natalina.tyne' // Dummy username
  },
  {
    id: 22,
    avatar: '',
    fullName: 'Faun Josefsen',
    post: 'Analog Circuit Design manager',
    email: 'fjosefsenl@samsung.com',
    city: 'Wengyang',
    start_date: '07/08/2017',
    salary: 11209.16,
    age: 40,
    experience: '0 Year',
    status: 3,
    name: 'Faun Josefsen', // Dummy name
    username: 'faun.josefsen' // Dummy username
  },
  {
    id: 23,
    avatar: '7.png',
    fullName: 'Rosmunda Steed',
    post: 'Assistant Media Planner',
    email: 'rsteedm@xing.com',
    city: 'Manzanares',
    start_date: '12/23/2017',
    salary: 13778.34,
    age: 21,
    experience: '1 Year',
    status: 5,
    name: 'Rosmunda Steed', // Dummy name
    username: 'rosmunda.steed' // Dummy username
  },
  {
    id: 24,
    avatar: '',
    fullName: 'Scott Jiran',
    post: 'Graphic Designer',
    email: 'sjirann@simplemachines.org',
    city: 'Pinglin',
    start_date: '05/26/2016',
    salary: 23081.71,
    age: 23,
    experience: '3 Years',
    status: 1,
    name: 'Scott Jiran', // Dummy name
    username: 'scott.jiran' // Dummy username
  },
  {
    id: 25,
    avatar: '',
    fullName: 'Carmita Medling',
    post: 'Accountant',
    email: 'cmedlingo@hp.com',
    city: 'Bourges',
    start_date: '07/31/2019',
    salary: 13602.24,
    age: 47,
    experience: '7 Years',
    status: 3,
    name: 'Carmita Medling', // Dummy name
    username: 'carmita.medling' // Dummy username
  },
  {
    id: 26,
    avatar: '2.png',
    fullName: 'Morgen Benes',
    post: 'Senior Sales Associate',
    email: 'mbenesp@ted.com',
    city: 'Cà Mau',
    start_date: '04/10/2016',
    salary: 16969.63,
    age: 42,
    experience: '2 Years',
    status: 4,
    name: 'Morgen Benes', // Dummy name
    username: 'morgen.benes' // Dummy username
  },
  {
    id: 27,
    avatar: '',
    fullName: 'Onfroi Doughton',
    post: 'Civil Engineer',
    email: 'odoughtonq@aboutads.info',
    city: 'Utrecht (stad)',
    start_date: '09/29/2018',
    salary: 23796.62,
    age: 28,
    experience: '8 Years',
    status: 3,
    name: 'Onfroi Doughton', // Dummy name
    username: 'onfroi.doughton' // Dummy username
  },
  {
    id: 28,
    avatar: '',
    fullName: 'Kliment McGinney',
    post: 'Chief Design Engineer',
    email: 'kmcginneyr@paginegialle.it',
    city: 'Xiaocheng',
    start_date: '07/09/2018',
    salary: 24027.81,
    age: 28,
    experience: '8 Years',
    status: 4,
    name: 'Kliment McGinney', // Dummy name
    username: 'kliment.mcginney' // Dummy username
  },
  {
    id: 29,
    avatar: '',
    fullName: 'Devin Bridgland',
    post: 'Tax Accountant',
    email: 'dbridglands@odnoklassniki.ru',
    city: 'Baoli',
    start_date: '07/17/2016',
    salary: 13508.15,
    age: 48,
    experience: '8 Years',
    status: 3,
    name: 'Devin Bridgland', // Dummy name
    username: 'devin.bridgland' // Dummy username
  },
  {
    id: 30,
    avatar: '6.png',
    fullName: 'Gilbert McFade',
    post: 'Biostatistician',
    email: 'gmcfadet@irs.gov',
    city: 'Deje',
    start_date: '08/28/2018',
    salary: 21632.3,
    age: 20,
    experience: '0 Year',
    status: 2,
    name: 'Gilbert McFade', // Dummy name
    username: 'gilbert.mcfade' // Dummy username
  },
  {
    id: 31,
    avatar: '',
    fullName: 'Teressa Bleakman',
    post: 'Senior Editor',
    email: 'tbleakmanu@phpbb.com',
    city: 'Žebrák',
    start_date: '09/03/2016',
    salary: 24875.41,
    age: 37,
    experience: '7 Years',
    status: 5,
    name: 'Teressa Bleakman', // Dummy name
    username: 'teressa.bleakman' // Dummy username
  },
  {
    id: 32,
    avatar: '',
    fullName: 'Marcelia Alleburton',
    post: 'Safety Technician',
    email: 'malleburtonv@amazon.com',
    city: 'Basail',
    start_date: '06/02/2016',
    salary: 23888.98,
    age: 53,
    experience: '3 Years',
    status: 2,
    name: 'Marcelia Alleburton', // Dummy name
    username: 'marcelia.alleburton' // Dummy username
  },
  {
    id: 33,
    avatar: '7.png',
    fullName: 'Aili De Coursey',
    post: 'Environmental Specialist',
    email: 'adew@etsy.com',
    city: 'Łazy',
    start_date: '09/30/2016',
    salary: 14082.44,
    age: 27,
    experience: '7 Years',
    status: 5,
    name: 'Aili De Coursey', // Dummy name
    username: 'aili.de'
  }
]

export default data
