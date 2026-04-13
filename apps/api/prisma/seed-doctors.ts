import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

const doctors = [
  {
    slug: 'dra-camila-alencar',
    name: 'Dra. Camila Alencar',
    crm: 'CRM-SP 148392',
    state: 'SP',
    city: 'São Paulo',
    specialties: ['Neurologia', 'Epilepsia', 'Autismo'],
    telemedicine: true,
    inPerson: true,
    bio: 'Neurologista com mais de 12 anos de experiência. Prescreve cannabis medicinal desde 2019, com foco em epilepsia refratária e transtorno do espectro autista.',
    photoUrl: null,
    consultationFee: 'R$ 450 (primeira consulta)',
    contactInfo: {
      email: 'contato@dracamilaalencar.com.br',
      whatsapp: '+55 11 99876-5432',
      website: 'https://dracamilaalencar.com.br',
    },
    directoryListed: true,
  },
  {
    slug: 'dr-rafael-monteiro',
    name: 'Dr. Rafael Monteiro',
    crm: 'CRM-RJ 872145',
    state: 'RJ',
    city: 'Rio de Janeiro',
    specialties: ['Dor crônica', 'Fibromialgia', 'Oncologia'],
    telemedicine: true,
    inPerson: false,
    bio: 'Especialista em dor e cuidados paliativos. Atendimento 100% por telemedicina com protocolos estruturados para dor crônica e pacientes oncológicos.',
    photoUrl: null,
    consultationFee: 'R$ 380',
    contactInfo: {
      email: 'contato@drrafaelmonteiro.com.br',
      whatsapp: '+55 21 98765-1234',
    },
    directoryListed: true,
  },
  {
    slug: 'dra-juliana-prado',
    name: 'Dra. Juliana Prado',
    crm: 'CRM-MG 095728',
    state: 'MG',
    city: 'Belo Horizonte',
    specialties: ['Psiquiatria', 'Ansiedade', 'Insônia', 'Depressão'],
    telemedicine: true,
    inPerson: true,
    bio: 'Psiquiatra focada em saúde mental e uso terapêutico de canabinoides. Atendimento integrativo combinando farmacologia, terapia e mudanças de estilo de vida.',
    photoUrl: null,
    consultationFee: 'R$ 420',
    contactInfo: {
      email: 'atendimento@drajulianaprado.com.br',
      whatsapp: '+55 31 97654-3210',
      website: 'https://drajulianaprado.com.br',
    },
    directoryListed: true,
  },
  {
    slug: 'dr-lucas-ferreira',
    name: 'Dr. Lucas Ferreira',
    crm: 'CRM-RS 043218',
    state: 'RS',
    city: 'Porto Alegre',
    specialties: ['Reumatologia', 'Artrite', 'Dor crônica'],
    telemedicine: false,
    inPerson: true,
    bio: 'Reumatologista com atendimento presencial em Porto Alegre. Protocolos para artrite, lúpus e dor inflamatória crônica com cannabis medicinal.',
    photoUrl: null,
    consultationFee: 'R$ 520',
    contactInfo: {
      email: 'consultorio@drlucasferreira.com.br',
      whatsapp: '+55 51 98321-7654',
    },
    directoryListed: true,
  },
  {
    slug: 'dra-patricia-souza',
    name: 'Dra. Patrícia Souza',
    crm: 'CRM-PE 067389',
    state: 'PE',
    city: 'Recife',
    specialties: ['Oncologia', 'Cuidados paliativos', 'Náuseas da quimioterapia'],
    telemedicine: true,
    inPerson: true,
    bio: 'Oncologista clínica com experiência em cuidados paliativos e suporte a pacientes em tratamento quimioterápico. Uso de canabinoides para náuseas, apetite e dor.',
    photoUrl: null,
    consultationFee: 'R$ 600',
    contactInfo: {
      email: 'contato@drapatriciasouza.com.br',
      whatsapp: '+55 81 99432-1098',
    },
    directoryListed: true,
  },
  {
    slug: 'dr-eduardo-nakamura',
    name: 'Dr. Eduardo Nakamura',
    crm: 'CRM-PR 112987',
    state: 'PR',
    city: 'Curitiba',
    specialties: ['Neurologia', 'Parkinson', 'Esclerose múltipla'],
    telemedicine: true,
    inPerson: true,
    bio: 'Neurologista especializado em doenças neurodegenerativas. Atende pacientes com Parkinson, esclerose múltipla e outras condições que se beneficiam de canabinoides.',
    photoUrl: null,
    consultationFee: 'R$ 480',
    contactInfo: {
      email: 'contato@dreduardonakamura.com.br',
      whatsapp: '+55 41 98712-3456',
    },
    directoryListed: true,
  },
];

async function main() {
  console.log('Seeding doctor directory...');

  for (const d of doctors) {
    await prisma.doctor.upsert({
      where: { crm: d.crm },
      update: d,
      create: d,
    });
    console.log(`  ${d.name} (${d.state}) — ${d.specialties.join(', ')}`);
  }

  console.log(`\n${doctors.length} médicos no diretório.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
