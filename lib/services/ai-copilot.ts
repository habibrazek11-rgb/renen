// AI Copilot Service — mock implementation with hardcoded heuristics
// To swap to OpenAI/Claude: implement IAICopilot and replace aiCopilot export

export interface FunnelBlueprint {
  name: string;
  description: string;
  landingPage: {
    headline: string;
    subheadline: string;
    benefits: string[];
    cta: string;
  };
  questions: Array<{
    type: string;
    text: string;
    options?: string[];
  }>;
  segments: Array<{
    name: string;
    description: string;
    rules: string;
  }>;
}

export interface FunnelImprovement {
  area: string;
  suggestion: string;
  impact: 'high' | 'medium' | 'low';
}

export interface GeneratedSegments {
  segments: Array<{
    name: string;
    description: string;
    ruleDescription: string;
    ctaType: string;
    ctaLabel: string;
  }>;
}

export interface IAICopilot {
  createFunnel(prompt: string): Promise<FunnelBlueprint>;
  improveFunnel(funnelId: string, analytics: Record<string, number>): Promise<FunnelImprovement[]>;
  generateSegments(assessmentContext: string): Promise<GeneratedSegments>;
}

// Mock implementation — replace with OpenAI/Claude later
class MockAICopilot implements IAICopilot {
  async createFunnel(prompt: string): Promise<FunnelBlueprint> {
    // Simple heuristic: extract keywords from prompt
    const isB2B = prompt.toLowerCase().includes('b2b') || prompt.toLowerCase().includes('business');
    const isSaaS = prompt.toLowerCase().includes('saas') || prompt.toLowerCase().includes('software');

    return {
      name: `${isB2B ? 'B2B' : 'Growth'} Assessment Funnel`,
      description: `AI-generated funnel based on: "${prompt.slice(0, 80)}"`,
      landingPage: {
        headline: isB2B
          ? 'Discover Your Business Growth Potential'
          : 'Find Your Perfect Path to Success',
        subheadline: isSaaS
          ? 'Take our 5-minute assessment to get a personalized SaaS growth roadmap'
          : 'Answer a few questions and get your personalized action plan',
        benefits: [
          'Get instant personalized insights',
          'Identify your biggest opportunities',
          'Receive a custom action plan',
        ],
        cta: 'Start Free Assessment →',
      },
      questions: [
        {
          type: 'single_choice',
          text: 'What is your primary goal right now?',
          options: ['Grow revenue', 'Reduce costs', 'Improve efficiency', 'Scale the team'],
        },
        {
          type: 'scale',
          text: 'How would you rate your current progress? (1 = just starting, 10 = scaling fast)',
        },
        {
          type: 'multi_choice',
          text: 'What are your biggest challenges?',
          options: ['Lead generation', 'Conversion rate', 'Retention', 'Team capacity', 'Budget'],
        },
        {
          type: 'email',
          text: 'Where should we send your personalized report?',
        },
      ],
      segments: [
        {
          name: 'High Potential',
          description: 'Ready to scale with the right support',
          rules: 'Total score >= 70',
        },
        {
          name: 'Growth Stage',
          description: 'Good foundation, needs strategic focus',
          rules: 'Total score 40-69',
        },
        {
          name: 'Foundation First',
          description: 'Needs to build core systems before scaling',
          rules: 'Total score < 40',
        },
      ],
    };
  }

  async improveFunnel(
    funnelId: string,
    analytics: Record<string, number>
  ): Promise<FunnelImprovement[]> {
    const improvements: FunnelImprovement[] = [];
    const { views = 0, starts = 0, completes = 0, leads = 0 } = analytics;

    const startRate = views > 0 ? starts / views : 0;
    const completionRate = starts > 0 ? completes / starts : 0;
    const leadRate = completes > 0 ? leads / completes : 0;

    if (startRate < 0.3) {
      improvements.push({
        area: 'Landing Page',
        suggestion: 'Your start rate is low. Try a more compelling headline or add social proof (testimonials, logos).',
        impact: 'high',
      });
    }

    if (completionRate < 0.5) {
      improvements.push({
        area: 'Assessment',
        suggestion: 'Many users drop off mid-assessment. Consider reducing questions or adding a progress bar.',
        impact: 'high',
      });
    }

    if (leadRate < 0.7) {
      improvements.push({
        area: 'Email Capture',
        suggestion: 'Move email capture earlier in the flow or add more value framing before asking for email.',
        impact: 'medium',
      });
    }

    if (improvements.length === 0) {
      improvements.push({
        area: 'CTA',
        suggestion: 'Performance looks good! Try A/B testing your CTA button copy to squeeze more conversions.',
        impact: 'low',
      });
    }

    return improvements;
  }

  async generateSegments(assessmentContext: string): Promise<GeneratedSegments> {
    return {
      segments: [
        {
          name: 'Champion',
          description: 'Top performers ready for premium offerings',
          ruleDescription: 'Total score >= 80',
          ctaType: 'buy',
          ctaLabel: 'Get Started with Pro →',
        },
        {
          name: 'Contender',
          description: 'Strong potential, needs targeted support',
          ruleDescription: 'Total score 50-79',
          ctaType: 'book',
          ctaLabel: 'Book a Strategy Call →',
        },
        {
          name: 'Explorer',
          description: 'Early stage, nurture with educational content',
          ruleDescription: 'Total score < 50',
          ctaType: 'nurture',
          ctaLabel: 'Get Your Free Guide →',
        },
      ],
    };
  }
}

// Singleton — replace with: export const aiCopilot: IAICopilot = new OpenAICopilot(process.env.OPENAI_API_KEY);
export const aiCopilot: IAICopilot = new MockAICopilot();
