import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class OpenaiService {
  private readonly openai: OpenAI;

  constructor() {
    this.openai = new OpenAI();
  }

  async test() {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        {
          role: 'user',
          content: 'Write a haiku about recursion in programming.',
        },
      ],
    });

    return completion.choices[0].message;
  }

  async analyzeSecurityAudit(url: string) {
    if (!url) {
      throw new Error('Please provide a URL to analyze.');
    }

    const auditAnalysisPrompt = `
      You are a DeFi audit analyzer. Analyze the security audit at the following link: ${url}. Use the following table structure to evaluate each focus area with scores from 1 to 5 and calculate the total weighted average score.

    | Focus Area                       | Description                                                                                                  | Importance | Score (1-5) |
    |----------------------------------|--------------------------------------------------------------------------------------------------------------|------------|-------------|
    | **Smart Contract Vulnerabilities** | Key vulnerabilities like reentrancy, overflow, etc.                                                         | **High (3)**   |             |
    | **Privileged Roles & Permissions** | Functions accessible by privileged roles and associated risks.                                              | **High (3)**   |             |
    | **External Dependencies**          | Risks from dependencies on other contracts and services.                                                    | **High (3)**   |             |
    | **Testing Coverage**              | Extent and depth of testing coverage for the codebase.                                                      | **High (3)**   |             |
    | **Formal Verification**            | Presence of mathematical proofs ensuring code correctness.                                                  | **High (3)**   |             |
    | **Economic Security**             | Resistance to economic exploits like flash loans or price manipulation.                                     | **High (3)**   |             |
    | **Bug Bounty Program**            | Incentives for external security testing through a bug bounty.                                              | **Medium (2)** |             |
    | **Gas Optimization**              | Efficiency of code execution to reduce transaction costs.                                                   | **Medium (2)** |             |
    | **Immutable Contracts**           | Verifying if contracts are upgradeable or immutable.                                                        | **Medium (2)** |             |
    | **Auditor Reputation**            | Track record and credibility of the auditing firm.                                                          | **Medium (2)** |             |
    | **Audit Recency**                 | How recent the audit is, covering latest code updates.                                                      | **Medium (2)** |             |
    | **Code Readability & Documentation** | Clarity of code and documentation quality for easier review and understanding.                             | **Low (1)**    |             |
    | **Non-Technical Risks**           | Consideration of external risks, like team reputation or regulatory factors.                               | **Low (1)**    |             |

    Return each focus area with an explanation of the score given, and calculate the **weighted average score** based on importance levels (High = 3, Medium = 2, Low = 1).
    `;

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a DeFi audit analyzer assistant.' },
        { role: 'user', content: auditAnalysisPrompt },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'DeFiAuditAnalysis',
          schema: {
            type: 'object',
            properties: {
              scores: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    focus_area: { type: 'string' },
                    importance: {
                      type: 'string',
                      enum: ['High', 'Medium', 'Low'],
                    },
                    score: { type: 'integer' },
                    description: { type: 'string' },
                  },
                  required: [
                    'focus_area',
                    'importance',
                    'score',
                    'description',
                  ],
                  additionalProperties: false,
                },
              },
              weighted_average_score: { type: 'number' },
            },
            required: ['scores', 'weighted_average_score'],
            additionalProperties: false,
          },
          strict: true,
        },
      },
    });

    return completion.choices[0].message;
  }
}
