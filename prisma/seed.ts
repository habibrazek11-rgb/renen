// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('@prisma/client');
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const db = new PrismaClient();

async function main() {
  console.log('🌱 Seeding RENEN database...');

  // ─── Workspace ───────────────────────────────────────────────────────────
  const workspace = await db.workspace.upsert({
    where: { slug: 'renen-demo' },
    update: {},
    create: {
      id: 'ws-renen-demo',
      name: 'RENEN Demo Workspace',
      slug: 'renen-demo',
      webhookSecret: 'demo-webhook-secret-change-in-prod',
    },
  });
  console.log('✅ Workspace:', workspace.name);

  // ─── Membership ───────────────────────────────────────────────────────────
  await db.membership.upsert({
    where: { workspaceId_userId: { workspaceId: workspace.id, userId: 'user-owner-1' } },
    update: {},
    create: { workspaceId: workspace.id, userId: 'user-owner-1', role: 'owner' },
  });
  await db.membership.upsert({
    where: { workspaceId_userId: { workspaceId: workspace.id, userId: 'user-admin-1' } },
    update: {},
    create: { workspaceId: workspace.id, userId: 'user-admin-1', role: 'admin' },
  });

  // ─── Project ──────────────────────────────────────────────────────────────
  const project = await db.project.upsert({
    where: { id: 'proj-demo-1' },
    update: {},
    create: {
      id: 'proj-demo-1',
      workspaceId: workspace.id,
      name: 'Lead Generation Funnels',
      description: 'Assessment funnels for lead qualification',
    },
  });
  console.log('✅ Project:', project.name);

  // ─── Funnel ───────────────────────────────────────────────────────────────
  const funnel = await db.funnel.upsert({
    where: { slug: 'business-growth-assessment' },
    update: {},
    create: {
      id: 'funnel-demo-1',
      workspaceId: workspace.id,
      projectId: project.id,
      name: 'Business Growth Assessment',
      slug: 'business-growth-assessment',
      description: 'Assess your business growth readiness and get a personalized action plan',
      createdBy: 'user-owner-1',
    },
  });
  console.log('✅ Funnel:', funnel.name);

  // ─── Funnel Version ───────────────────────────────────────────────────────
  const funnelVersion = await db.funnelVersion.upsert({
    where: { funnelId_version: { funnelId: funnel.id, version: 1 } },
    update: {},
    create: {
      id: 'fv-demo-1',
      funnelId: funnel.id,
      version: 1,
      isDraft: false,
      isPublished: true,
      publishedAt: new Date(),
      landingPage: {
        blocks: [
          {
            type: 'hero',
            headline: 'Discover Your Business Growth Potential',
            subheadline: 'Take our 5-minute assessment and get a personalized roadmap',
            ctaText: 'Start Free Assessment →',
          },
          {
            type: 'benefits',
            items: [
              'Identify your biggest growth opportunities',
              'Get a personalized action plan',
              'Benchmark against industry standards',
            ],
          },
          {
            type: 'proof',
            stats: [
              { value: '2,400+', label: 'Assessments completed' },
              { value: '94%', label: 'Found it valuable' },
              { value: '5 min', label: 'Average completion time' },
            ],
          },
          {
            type: 'faq',
            items: [
              { q: 'Is this free?', a: 'Yes, completely free.' },
              { q: 'How long does it take?', a: 'About 5 minutes.' },
              { q: 'What do I get?', a: 'A personalized PDF report with your score and action plan.' },
            ],
          },
        ],
      },
      brandTheme: {
        primaryColor: '#ff36a2',
        secondaryColor: '#ff6b9d',
        fontFamily: 'system-ui',
        logoUrl: null,
      },
    },
  });
  console.log('✅ Funnel Version:', funnelVersion.version);

  // ─── Assessment ───────────────────────────────────────────────────────────
  const assessment = await db.assessment.upsert({
    where: { funnelVersionId: funnelVersion.id },
    update: {},
    create: {
      id: 'assess-demo-1',
      funnelVersionId: funnelVersion.id,
      name: 'Business Growth Readiness Assessment',
    },
  });

  // ─── Score Categories ─────────────────────────────────────────────────────
  const catStrategy = await db.scoreCategory.upsert({
    where: { id: 'cat-strategy' },
    update: {},
    create: { id: 'cat-strategy', assessmentId: assessment.id, name: 'Strategy', maxScore: 30, weight: 1.0 },
  });
  const catOperations = await db.scoreCategory.upsert({
    where: { id: 'cat-operations' },
    update: {},
    create: { id: 'cat-operations', assessmentId: assessment.id, name: 'Operations', maxScore: 25, weight: 1.0 },
  });
  const catMarketing = await db.scoreCategory.upsert({
    where: { id: 'cat-marketing' },
    update: {},
    create: { id: 'cat-marketing', assessmentId: assessment.id, name: 'Marketing', maxScore: 25, weight: 1.0 },
  });
  const catFinance = await db.scoreCategory.upsert({
    where: { id: 'cat-finance' },
    update: {},
    create: { id: 'cat-finance', assessmentId: assessment.id, name: 'Finance', maxScore: 20, weight: 1.0 },
  });

  // ─── Score Tiers ──────────────────────────────────────────────────────────
  await db.scoreTier.upsert({
    where: { id: 'tier-champion' },
    update: {},
    create: { id: 'tier-champion', assessmentId: assessment.id, name: 'Champion', label: '🏆 Champion', minScore: 80, maxScore: 100 },
  });
  await db.scoreTier.upsert({
    where: { id: 'tier-contender' },
    update: {},
    create: { id: 'tier-contender', assessmentId: assessment.id, name: 'Contender', label: '🚀 Contender', minScore: 50, maxScore: 79 },
  });
  await db.scoreTier.upsert({
    where: { id: 'tier-explorer' },
    update: {},
    create: { id: 'tier-explorer', assessmentId: assessment.id, name: 'Explorer', label: '🌱 Explorer', minScore: 0, maxScore: 49 },
  });

  // ─── Questions ────────────────────────────────────────────────────────────
  const q1 = await db.question.upsert({
    where: { id: 'q-1' },
    update: {},
    create: {
      id: 'q-1', assessmentId: assessment.id, order: 1,
      type: 'single_choice', text: 'How clearly defined is your business strategy?', required: true,
    },
  });
  await db.answerOption.createMany({
    skipDuplicates: true,
    data: [
      { id: 'q1-a', questionId: q1.id, text: 'No clear strategy yet', order: 1, points: 0, categoryId: catStrategy.id },
      { id: 'q1-b', questionId: q1.id, text: 'Basic direction but not documented', order: 2, points: 10, categoryId: catStrategy.id },
      { id: 'q1-c', questionId: q1.id, text: 'Documented strategy with goals', order: 3, points: 20, categoryId: catStrategy.id },
      { id: 'q1-d', questionId: q1.id, text: 'Clear strategy with KPIs and reviews', order: 4, points: 30, categoryId: catStrategy.id },
    ],
  });

  const q2 = await db.question.upsert({
    where: { id: 'q-2' },
    update: {},
    create: {
      id: 'q-2', assessmentId: assessment.id, order: 2,
      type: 'single_choice', text: 'How would you rate your operational efficiency?', required: true,
    },
  });
  await db.answerOption.createMany({
    skipDuplicates: true,
    data: [
      { id: 'q2-a', questionId: q2.id, text: 'Very inefficient, lots of manual work', order: 1, points: 0, categoryId: catOperations.id },
      { id: 'q2-b', questionId: q2.id, text: 'Some processes documented', order: 2, points: 8, categoryId: catOperations.id },
      { id: 'q2-c', questionId: q2.id, text: 'Most processes automated', order: 3, points: 17, categoryId: catOperations.id },
      { id: 'q2-d', questionId: q2.id, text: 'Highly optimized with continuous improvement', order: 4, points: 25, categoryId: catOperations.id },
    ],
  });

  const q3 = await db.question.upsert({
    where: { id: 'q-3' },
    update: {},
    create: {
      id: 'q-3', assessmentId: assessment.id, order: 3,
      type: 'multi_choice', text: 'Which marketing channels are you actively using?', required: true,
    },
  });
  await db.answerOption.createMany({
    skipDuplicates: true,
    data: [
      { id: 'q3-a', questionId: q3.id, text: 'Social media', order: 1, points: 5, categoryId: catMarketing.id },
      { id: 'q3-b', questionId: q3.id, text: 'Email marketing', order: 2, points: 7, categoryId: catMarketing.id },
      { id: 'q3-c', questionId: q3.id, text: 'SEO / Content', order: 3, points: 8, categoryId: catMarketing.id },
      { id: 'q3-d', questionId: q3.id, text: 'Paid advertising', order: 4, points: 5, categoryId: catMarketing.id },
    ],
  });

  const q4 = await db.question.upsert({
    where: { id: 'q-4' },
    update: {},
    create: {
      id: 'q-4', assessmentId: assessment.id, order: 4,
      type: 'scale', text: 'How confident are you in your financial runway? (1 = very worried, 10 = very secure)',
      required: true, scaleMin: 1, scaleMax: 10, scaleMinLabel: 'Very worried', scaleMaxLabel: 'Very secure',
    },
  });

  const q5 = await db.question.upsert({
    where: { id: 'q-5' },
    update: {},
    create: {
      id: 'q-5', assessmentId: assessment.id, order: 5,
      type: 'email', text: 'Where should we send your personalized growth report?', required: true,
    },
  });

  console.log('✅ Assessment with 5 questions created');

  // ─── Segments ─────────────────────────────────────────────────────────────
  const segChampion = await db.segment.upsert({
    where: { id: 'seg-champion' },
    update: {},
    create: {
      id: 'seg-champion', funnelId: funnel.id, name: 'Champion', priority: 1,
      description: 'High-performing businesses ready to scale',
      reasonTemplate: 'Your strong scores across strategy, operations, and marketing show you\'re ready to scale. Let\'s accelerate your growth.',
    },
  });
  await db.segmentRule.upsert({
    where: { id: 'rule-champ-1' },
    update: {},
    create: { id: 'rule-champ-1', segmentId: segChampion.id, type: 'total_score', operator: 'gte', value: 70 },
  });

  const segContender = await db.segment.upsert({
    where: { id: 'seg-contender' },
    update: {},
    create: {
      id: 'seg-contender', funnelId: funnel.id, name: 'Contender', priority: 2,
      description: 'Strong potential with clear areas to improve',
      reasonTemplate: 'You have a solid foundation. With targeted improvements in a few key areas, you can reach the next level.',
    },
  });
  await db.segmentRule.upsert({
    where: { id: 'rule-cont-1' },
    update: {},
    create: { id: 'rule-cont-1', segmentId: segContender.id, type: 'total_score', operator: 'gte', value: 40 },
  });
  await db.segmentRule.upsert({
    where: { id: 'rule-cont-2' },
    update: {},
    create: { id: 'rule-cont-2', segmentId: segContender.id, type: 'total_score', operator: 'lt', value: 70 },
  });

  const segExplorer = await db.segment.upsert({
    where: { id: 'seg-explorer' },
    update: {},
    create: {
      id: 'seg-explorer', funnelId: funnel.id, name: 'Explorer', priority: 3,
      description: 'Early stage businesses building their foundation',
      reasonTemplate: 'You\'re in the early stages of your growth journey. Focus on building strong foundations first.',
    },
  });
  await db.segmentRule.upsert({
    where: { id: 'rule-expl-1' },
    update: {},
    create: { id: 'rule-expl-1', segmentId: segExplorer.id, type: 'total_score', operator: 'lt', value: 40 },
  });

  console.log('✅ 3 Segments created');

  // ─── Result Pages ─────────────────────────────────────────────────────────
  const rpChampion = await db.resultPage.upsert({
    where: { segmentId: segChampion.id },
    update: {},
    create: {
      id: 'rp-champion', segmentId: segChampion.id,
      headline: '🏆 You\'re a Champion — Ready to Scale!',
      body: 'Congratulations! Your assessment results show you have a well-defined strategy, efficient operations, and strong marketing. You\'re in the top tier of business readiness.\n\nYou\'re ready to accelerate growth with the right strategic partner. Let\'s build your scaling roadmap together.',
      showScore: true, showCategories: true,
    },
  });
  await db.cTAConfig.upsert({
    where: { resultPageId: rpChampion.id },
    update: {},
    create: {
      resultPageId: rpChampion.id, type: 'book',
      label: 'Book Your Growth Strategy Session →',
      abVariantLabel: 'Schedule Your Free Consultation →',
      url: 'https://calendly.com/renen-demo',
    },
  });

  const rpContender = await db.resultPage.upsert({
    where: { segmentId: segContender.id },
    update: {},
    create: {
      id: 'rp-contender', segmentId: segContender.id,
      headline: '🚀 You\'re a Contender — Almost There!',
      body: 'Great work! You have a solid business foundation with clear strengths. Your assessment shows specific areas where focused improvement will unlock significant growth.\n\nA strategic review session will help you identify the highest-leverage actions to take next.',
      showScore: true, showCategories: true,
    },
  });
  await db.cTAConfig.upsert({
    where: { resultPageId: rpContender.id },
    update: {},
    create: {
      resultPageId: rpContender.id, type: 'book',
      label: 'Book a Free Strategy Review →',
      abVariantLabel: 'Get Your Personalized Growth Plan →',
      url: 'https://calendly.com/renen-demo',
    },
  });

  const rpExplorer = await db.resultPage.upsert({
    where: { segmentId: segExplorer.id },
    update: {},
    create: {
      id: 'rp-explorer', segmentId: segExplorer.id,
      headline: '🌱 You\'re an Explorer — Let\'s Build Your Foundation!',
      body: 'Every great business starts somewhere! Your assessment shows you\'re in the early stages of your growth journey. The good news: you\'ve identified exactly where to focus first.\n\nStart with our free Business Foundation Guide to build the systems you need.',
      showScore: true, showCategories: true,
    },
  });
  await db.cTAConfig.upsert({
    where: { resultPageId: rpExplorer.id },
    update: {},
    create: {
      resultPageId: rpExplorer.id, type: 'nurture',
      label: 'Get Your Free Foundation Guide →',
      abVariantLabel: 'Download the Starter Toolkit →',
      url: 'https://renen.app/guide',
    },
  });

  console.log('✅ 3 Result pages with CTAs created');

  // ─── Sample Events ────────────────────────────────────────────────────────
  const eventTypes = ['page.viewed', 'assessment.started', 'assessment.completed', 'lead.created', 'cta.clicked'];
  for (let i = 0; i < 20; i++) {
    await db.eventLog.create({
      data: {
        workspaceId: workspace.id,
        funnelId: funnel.id,
        eventType: eventTypes[Math.floor(Math.random() * eventTypes.length)],
        anonymousId: `anon-seed-${i}`,
        eventData: { source: 'seed' },
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      },
    });
  }
  console.log('✅ 20 sample events created');

  // ─── Update users.json with bcrypt hashes ────────────────────────────────
  const passwordHash = await bcrypt.hash('password123', 10);
  const users = [
    { id: 'user-owner-1', email: 'owner@renen.app', passwordHash, name: 'Habib Owner', role: 'owner', workspaceId: workspace.id },
    { id: 'user-admin-1', email: 'admin@renen.app', passwordHash, name: 'Admin User', role: 'admin', workspaceId: workspace.id },
    { id: 'user-editor-1', email: 'editor@renen.app', passwordHash, name: 'Editor User', role: 'editor', workspaceId: workspace.id },
    { id: 'user-viewer-1', email: 'viewer@renen.app', passwordHash, name: 'Viewer User', role: 'viewer', workspaceId: workspace.id },
  ];
  const usersPath = path.join(process.cwd(), 'data', 'users.json');
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
  console.log('✅ users.json updated with fresh bcrypt hashes');

  console.log('\n🎉 Seeding complete!');
  console.log('   Funnel slug: business-growth-assessment');
  console.log('   Public URL:  http://localhost:3000/f/business-growth-assessment');
  console.log('   Login:       owner@renen.app / password123');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
