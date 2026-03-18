export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export interface Association {
  id: string
  slug: string
  name: string
  description: string
  city: string
  state: string
  region: string
  patientTypes: string[]
  productTypes: string[]
  assistedAccess: boolean
  memberCount: number
  foundedYear: number
  verified: boolean
  contactEmail?: string
  contactPhone?: string
  website?: string
  about?: string
}

export const sampleAssociations: Association[] = [
  {
    id: 'a1b2c3d4-1111-4000-8000-000000000001',
    slug: 'esperanca-verde',
    name: 'Associação Esperança Verde',
    description: 'Fundada em 2018, a Esperança Verde atende pacientes com dor crônica, epilepsia e TEA. Oferece óleos full spectrum de 1% a 6% CBD e programa de acesso assistido para pacientes de baixa renda.',
    about: 'A Associação Esperança Verde nasceu da necessidade de pacientes que buscavam acesso legal e seguro à cannabis medicinal em São Paulo. Com uma equipe de farmacêuticos, médicos e voluntários, construímos uma rede de acolhimento que já transformou a vida de mais de 300 famílias.\n\nNosso programa de acesso assistido garante que pacientes de baixa renda tenham acesso ao tratamento com valores reduzidos ou gratuitos. Trabalhamos com óleos full spectrum produzidos sob rigoroso controle de qualidade, com laudos de análise disponíveis para todos os lotes.\n\nOferecemos também orientação jurídica para importação e habeas corpus preventivo, além de grupos de apoio mensais para pacientes e familiares.',
    city: 'São Paulo', state: 'SP', region: 'Sudeste',
    patientTypes: ['Adulto', 'Responsável Legal', 'Iniciante'],
    productTypes: ['Óleo', 'Cápsula'],
    assistedAccess: true,
    memberCount: 342, foundedYear: 2018, verified: true,
    contactEmail: 'contato@esperancaverde.org.br',
    contactPhone: '(11) 9 8765-4321',
    website: 'https://esperancaverde.org.br',
  },
  {
    id: 'a1b2c3d4-2222-4000-8000-000000000002',
    slug: 'flor-da-terra',
    name: 'Associação Flor da Terra',
    description: 'Referência em curadoria de cepas no Rio de Janeiro. Trabalha com prescritores parceiros e mantém catálogo técnico com laudos de análise para todos os produtos.',
    about: 'A Flor da Terra é reconhecida pela excelência na curadoria de cepas e pela qualidade técnica de seus produtos. Nosso catálogo inclui mais de 20 variedades de óleos, flores e gummies, todos com laudos de análise de laboratórios credenciados.\n\nMantemos parceria com uma rede de prescritores especializados em cannabis medicinal, facilitando o acesso dos pacientes a consultas e acompanhamento. Nosso diferencial é a transparência: todos os dados de concentração, terpenos e contaminantes estão disponíveis para consulta.\n\nRealizamos eventos educacionais mensais abertos ao público sobre cannabis medicinal e seus benefícios terapêuticos.',
    city: 'Rio de Janeiro', state: 'RJ', region: 'Sudeste',
    patientTypes: ['Adulto', 'Médico/Veterinário'],
    productTypes: ['Óleo', 'Flor', 'Gummy'],
    assistedAccess: false,
    memberCount: 218, foundedYear: 2019, verified: true,
    contactEmail: 'atendimento@flordaterra.org.br',
    contactPhone: '(21) 9 7654-3210',
    website: 'https://flordaterra.org.br',
  },
  {
    id: 'a1b2c3d4-3333-4000-8000-000000000003',
    slug: 'cura-natural',
    name: 'Associação Cura Natural',
    description: 'Associação focada em acolhimento humanizado. Equipe multidisciplinar com farmacêuticos e psicólogos. Atendimento presencial e remoto para todo o Brasil.',
    about: 'A Cura Natural se destaca pelo acolhimento humanizado e pela abordagem multidisciplinar no tratamento com cannabis medicinal. Nossa equipe inclui farmacêuticos, psicólogos, assistentes sociais e médicos que trabalham de forma integrada.\n\nOferecemos atendimento presencial em Belo Horizonte e remoto para pacientes de todo o Brasil. Cada novo membro passa por uma avaliação individualizada para definir o melhor plano de tratamento.\n\nNosso programa de acesso assistido atende pacientes de baixa renda com descontos de até 80% nos produtos. Também oferecemos grupos terapêuticos semanais e acompanhamento psicológico.',
    city: 'Belo Horizonte', state: 'MG', region: 'Sudeste',
    patientTypes: ['Adulto', 'Responsável Legal', 'Iniciante'],
    productTypes: ['Óleo', 'Tópico', 'Cápsula'],
    assistedAccess: true,
    memberCount: 156, foundedYear: 2020, verified: true,
    contactEmail: 'acolhimento@curanatural.org.br',
    contactPhone: '(31) 9 8876-5432',
    website: 'https://curanatural.org.br',
  },
  {
    id: 'a1b2c3d4-4444-4000-8000-000000000004',
    slug: 'raizes-do-sul',
    name: 'Associação Raízes do Sul',
    description: 'Maior associação da região Sul, com foco em pacientes com fibromialgia e esclerose múltipla. Parcerias com universidades para pesquisa clínica.',
    about: 'A Raízes do Sul é a maior associação de cannabis medicinal da região Sul do Brasil. Desde 2017, nos especializamos no atendimento a pacientes com fibromialgia e esclerose múltipla, condições para as quais a cannabis medicinal tem demonstrado resultados significativos.\n\nMantemos parcerias ativas com a UFRGS e a PUC-RS para pesquisa clínica, contribuindo para a produção de evidências científicas sobre a eficácia dos tratamentos. Nossos pacientes podem participar voluntariamente dos estudos clínicos.\n\nOferecemos um programa de mentoria onde pacientes experientes acompanham novos membros durante os primeiros 3 meses de tratamento.',
    city: 'Porto Alegre', state: 'RS', region: 'Sul',
    patientTypes: ['Adulto', 'Médico/Veterinário'],
    productTypes: ['Óleo', 'Cápsula', 'Gummy'],
    assistedAccess: false,
    memberCount: 289, foundedYear: 2017, verified: true,
    contactEmail: 'contato@raizesdosul.org.br',
    contactPhone: '(51) 9 9876-5432',
    website: 'https://raizesdosul.org.br',
  },
  {
    id: 'a1b2c3d4-5555-4000-8000-000000000005',
    slug: 'semente-do-cerrado',
    name: 'Associação Semente do Cerrado',
    description: 'Primeira associação do Centro-Oeste com programa de acesso assistido. Atende famílias de crianças com epilepsia refratária e TEA.',
    about: 'A Semente do Cerrado foi a primeira associação do Centro-Oeste a implementar um programa completo de acesso assistido à cannabis medicinal. Nosso foco principal são famílias de crianças com epilepsia refratária e transtorno do espectro autista.\n\nDesenvolvemos um protocolo de acolhimento específico para responsáveis legais, com orientação jurídica, suporte emocional e acompanhamento farmacêutico personalizado. Cada família recebe um plano de tratamento individualizado.\n\nTrabalhamos em parceria com neuropediatras de Brasília e região para garantir o acompanhamento médico adequado durante todo o tratamento.',
    city: 'Brasília', state: 'DF', region: 'Centro-Oeste',
    patientTypes: ['Responsável Legal', 'Iniciante'],
    productTypes: ['Óleo'],
    assistedAccess: true,
    memberCount: 94, foundedYear: 2021, verified: true,
    contactEmail: 'contato@sementedocerrado.org.br',
    contactPhone: '(61) 9 8765-1234',
  },
  {
    id: 'a1b2c3d4-6666-4000-8000-000000000006',
    slug: 'mangue-verde',
    name: 'Associação Mangue Verde',
    description: 'Associação nordestina com rede de prescritores parceiros em 5 estados. Oferece teleconsulta inicial gratuita e orientação completa para novos pacientes.',
    about: 'A Mangue Verde é a principal referência em cannabis medicinal no Nordeste brasileiro. Com prescritores parceiros em Pernambuco, Bahia, Ceará, Paraíba e Rio Grande do Norte, facilitamos o acesso ao tratamento em toda a região.\n\nNosso diferencial é a teleconsulta inicial gratuita, onde um de nossos profissionais avalia o caso do paciente e orienta sobre os próximos passos. Não cobramos pela primeira consulta porque acreditamos que o acesso à informação é o primeiro passo para o tratamento.\n\nMantemos parcerias com farmácias de manipulação para oferecer preços acessíveis e desenvolvemos materiais educativos em linguagem acessível sobre cannabis medicinal.',
    city: 'Recife', state: 'PE', region: 'Nordeste',
    patientTypes: ['Adulto', 'Responsável Legal', 'Iniciante'],
    productTypes: ['Óleo', 'Gummy'],
    assistedAccess: true,
    memberCount: 178, foundedYear: 2019, verified: false,
    contactEmail: 'ola@mangueverde.org.br',
    contactPhone: '(81) 9 7654-3210',
    website: 'https://mangueverde.org.br',
  },
  {
    id: 'a1b2c3d4-7777-4000-8000-000000000007',
    slug: 'verde-vida',
    name: 'Associação Verde Vida',
    description: 'Foco em pacientes veterinários e seus tutores. Trabalha com óleos específicos para uso animal, com acompanhamento de veterinários especializados.',
    about: 'A Verde Vida é pioneira no atendimento a pacientes veterinários no Brasil. Trabalhamos com veterinários especializados em cannabis medicinal para oferecer tratamentos seguros e eficazes para animais de companhia.\n\nNosso catálogo inclui óleos formulados especificamente para uso animal, com concentrações adequadas para diferentes portes e espécies. Todos os produtos passam por testes de qualidade e análise laboratorial.\n\nOferecemos acompanhamento veterinário mensal para ajuste de dosagem e monitoramento dos resultados. Também realizamos workshops para tutores sobre administração correta dos produtos.',
    city: 'Curitiba', state: 'PR', region: 'Sul',
    patientTypes: ['Médico/Veterinário', 'Adulto'],
    productTypes: ['Óleo', 'Tópico'],
    assistedAccess: false,
    memberCount: 67, foundedYear: 2022, verified: true,
    contactEmail: 'contato@verdevida.vet.br',
    contactPhone: '(41) 9 8765-4321',
    website: 'https://verdevida.vet.br',
  },
  {
    id: 'a1b2c3d4-8888-4000-8000-000000000008',
    slug: 'cannaflora',
    name: 'Associação Cannaflora',
    description: 'Associação com foco em diversidade de produtos. Único fornecedor de gummies e comestíveis na região Norte. Programa educacional para novos pacientes.',
    about: 'A Cannaflora é a principal associação de cannabis medicinal da região Norte, sediada em Manaus. Nosso diferencial é a diversidade de produtos: somos os únicos na região a oferecer gummies, comestíveis, flores e cápsulas além dos óleos tradicionais.\n\nDesenvolvemos um programa educacional completo para novos pacientes, com módulos online sobre cannabis medicinal, formas de uso, dosagem e legislação. O programa é gratuito e aberto a qualquer interessado.\n\nNosso programa de acesso assistido é financiado por doações e parcerias com empresas locais, garantindo que pacientes em situação de vulnerabilidade social tenham acesso ao tratamento.',
    city: 'Manaus', state: 'AM', region: 'Norte',
    patientTypes: ['Adulto', 'Iniciante'],
    productTypes: ['Óleo', 'Gummy', 'Cápsula', 'Flor'],
    assistedAccess: true,
    memberCount: 53, foundedYear: 2023, verified: false,
    contactEmail: 'contato@cannaflora.org.br',
    contactPhone: '(92) 9 8765-4321',
  },
  {
    id: 'a1b2c3d4-9999-4000-8000-000000000009',
    slug: 'alianca-medicinal',
    name: 'Aliança Medicinal',
    description: 'Organização dedicada a promover qualidade de vida através do uso de fitocanabinóides. Possui autorização judicial para cultivo e produção seguindo padrão Anvisa, com envio para todo o Brasil.',
    about: 'A Aliança Medicinal é uma organização dedicada a promover qualidade de vida para toda a população e assistência para profissionais da medicina no uso de medicamentos à base de fitocanabinóides.\n\nPossui autorização judicial para cultivar e produzir medicamentos à base de cannabis, seguindo padrão Anvisa — um diferencial que garante segurança e qualidade em todos os produtos. O cultivo legalizado permite controle rigoroso de todo o processo produtivo.\n\nConta com médicos parceiros prontos para ajudar pacientes com prescrições seguras e eficazes. Os óleos canábicos produzidos auxiliam no alívio de dores crônicas, melhora do sono e apetite, efeito antiepilético, redução de ansiedade, náuseas, estabilização do humor e apoio na cognição. Realiza envio para todo o Brasil.',
    city: 'Olinda', state: 'PE', region: 'Nordeste',
    patientTypes: ['Adulto', 'Responsável Legal', 'Médico/Veterinário'],
    productTypes: ['Óleo'],
    assistedAccess: false,
    memberCount: 120, foundedYear: 2020, verified: true,
    contactEmail: 'contato@aliancamedicinal.org',
    contactPhone: '(81) 9 9901-6547',
    website: 'https://www.aliancamedicinal.org',
  },
]
