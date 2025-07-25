import { PrismaClient, TaskStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o processo de seeding...');

  const saltRounds = 8;
  const password = 'Senha123*';
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const user = await prisma.user.upsert({
    where: { email: 'Jose@exemplo.com' },
    update: {
      password: hashedPassword,
    },
    create: {
      id: randomUUID(),
      name: 'José',
      email: 'Jose@exemplo.com',
      password: hashedPassword,
    },
  });

  console.log(`Usuário criado ou encontrado: ${user.name} (ID: ${user.id})`);

  await prisma.task.deleteMany({ where: { userId: user.id } });

  const tasksData = [
    {
      title: 'Revisar relatório trimestral',
      description:
        'Verificar os dados de vendas e marketing do último trimestre.',
      status: TaskStatus.PENDING,
      dueDate: new Date('2025-08-15T23:59:59Z'),
    },
    {
      title: 'Desenvolver nova funcionalidade de login',
      description: 'Implementar autenticação OAuth2 com Google e GitHub.',
      status: TaskStatus.IN_PROGRESS,
      dueDate: new Date('2025-08-10T23:59:59Z'),
    },
    {
      title: 'Configurar ambiente de produção',
      description:
        'Instalar Docker e configurar os contêineres do projeto no servidor.',
      status: TaskStatus.COMPLETED,
      dueDate: new Date('2025-07-20T23:59:59Z'),
      completedAt: new Date('2025-07-19T10:00:00Z'),
    },
    {
      title: 'Planejar sprint da próxima semana',
      description:
        'Definir as prioridades e distribuir as tarefas para a equipe de desenvolvimento.',
      status: TaskStatus.PENDING,
      dueDate: new Date('2025-07-30T23:59:59Z'),
    },
    {
      title: 'Corrigir bug na exportação de PDF',
      description:
        'O bug ocorre quando o usuário tenta exportar relatórios com mais de 50 páginas.',
      status: TaskStatus.COMPLETED,
      dueDate: new Date('2025-07-25T23:59:59Z'),
      completedAt: new Date('2025-07-25T15:30:00Z'),
    },
    {
      title: 'Atualizar dependências do projeto',
      description:
        'Verificar e atualizar pacotes NPM para as últimas versões estáveis.',
      status: TaskStatus.IN_PROGRESS,
      dueDate: new Date('2025-08-05T23:59:59Z'),
    },
    {
      title: 'Escrever documentação da API',
      description:
        'Documentar todos os endpoints da API REST utilizando o padrão OpenAPI.',
      status: TaskStatus.PENDING,
      dueDate: new Date('2025-09-01T23:59:59Z'),
    },
    {
      title: 'Reunião de alinhamento com a equipe de design',
      description: 'Discutir o protótipo da nova interface do dashboard.',
      status: TaskStatus.COMPLETED,
      dueDate: new Date('2025-07-22T23:59:59Z'),
      completedAt: new Date('2025-07-22T14:00:00Z'),
    },
    {
      title: 'Testar fluxo de pagamento em homologação',
      description:
        'Realizar testes de ponta a ponta no gateway de pagamento com cartões de teste.',
      status: TaskStatus.IN_PROGRESS,
      dueDate: new Date('2025-07-28T23:59:59Z'),
    },
    {
      title: 'Otimizar consultas ao banco de dados',
      description:
        'Analisar e refatorar as queries mais lentas identificadas no monitoramento.',
      status: TaskStatus.PENDING,
      dueDate: new Date('2025-08-20T23:59:59Z'),
    },
  ];

  await prisma.task.createMany({
    data: tasksData.map((task) => ({
      ...task,
      userId: user.id,
    })),
  });

  console.log(`${tasksData.length} novas tarefas foram criadas com sucesso.`);
  console.log('Seeding concluído.');
}

async function runSeed() {
  try {
    await main();
  } catch (e) {
    console.error('Ocorreu um erro fatal durante o processo de seeding:');
    console.error(e);
    process.exit(1);
  } finally {
    // This block will always run, whether `main()` succeeded or failed
    await prisma.$disconnect();
    console.log('Conexão com o Prisma foi fechada.');
  }
}

runSeed();
