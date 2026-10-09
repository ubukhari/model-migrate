// src/data/retirements.json
var retirements_default = {
  version: 1,
  updated: "2026-10-08",
  windowStart: "2025-07-01",
  scope: "Language models (chat, reasoning, completions, code, search, computer-use and deep-research IDs, and OpenAI fine-tune families) with a shutdown date on or after 1 July 2025, from four official pages: OpenAI's deprecations page, Anthropic's model deprecations doc, the Gemini API deprecations page and Vertex AI's model versions page. Audio, realtime, speech, transcription, image, video, embedding and moderation models are left out.",
  priceBasis: "US dollars per million tokens at the standard tier, text input, shortest context tier, as listed on the provider's pricing page on the date seen. A ratio is the replacement's price divided by the retiring model's; it ignores differences in how many tokens each model uses.",
  providers: {
    openai: {
      name: "OpenAI",
      platform: "OpenAI API",
      deprecations: "https://developers.openai.com/api/docs/deprecations",
      pricing: "https://developers.openai.com/api/docs/pricing",
      seen: "2026-10-08"
    },
    anthropic: {
      name: "Anthropic",
      platform: "Claude API",
      deprecations: "https://platform.claude.com/docs/en/about-claude/model-deprecations",
      pricing: "https://platform.claude.com/docs/en/about-claude/pricing",
      seen: "2026-10-08"
    },
    "gemini-api": {
      name: "Google",
      platform: "Gemini API",
      deprecations: "https://ai.google.dev/gemini-api/docs/deprecations",
      pricing: "https://ai.google.dev/gemini-api/docs/pricing",
      seen: "2026-10-08"
    },
    "vertex-ai": {
      name: "Google Cloud",
      platform: "Vertex AI (Gemini Enterprise Agent Platform)",
      deprecations: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/model-versions",
      pricing: "https://cloud.google.com/gemini-enterprise-agent-platform/generative-ai/pricing",
      seen: "2026-10-08"
    }
  },
  entries: [
    {
      aliases: [],
      kind: "model",
      announced: "2025-04-14",
      shutdownIsEarliest: false,
      replacements: ["gpt-4.1"],
      prices: [],
      breaks: [],
      notes: [],
      seen: "2026-10-08",
      provider: "openai",
      id: "gpt-4.5-preview",
      shutdown: "2025-07-14",
      source: "https://developers.openai.com/api/docs/deprecations",
      priceNote: "Not listed on OpenAI's pricing page when checked on 8 October 2026, so no ratio is given."
    },
    {
      aliases: [],
      kind: "model",
      announced: "2025-01-21",
      shutdownIsEarliest: false,
      replacements: ["claude-opus-4-8"],
      prices: [],
      breaks: [
        {
          short: "a non-default temperature, top_p or top_k returns a 400 error",
          text: "Claude 4.7 and later models return a 400 error when temperature, top_p or top_k is set to a non-default value. Anthropic's Python SDK v1.0 and later removes these parameters, so passing them raises a TypeError. Omit them and guide the model with the prompt.",
          source: "https://platform.claude.com/docs/en/about-claude/model-deprecations"
        },
        {
          short: "a newer tokenizer counts about 30% more tokens for the same text",
          text: "Claude 4.7 and later models use a newer tokenizer that produces approximately 30% more tokens for the same text, so the same prompt can cost more than the per-token ratio suggests. Measure on your own prompts.",
          source: "https://platform.claude.com/docs/en/about-claude/pricing"
        }
      ],
      notes: [
        "Dates apply to the Claude API, Claude Platform on AWS and Microsoft Foundry. Amazon Bedrock and Google Cloud set their own retirement schedules."
      ],
      seen: "2026-10-08",
      provider: "anthropic",
      id: "claude-2.0",
      shutdown: "2025-07-21",
      source: "https://platform.claude.com/docs/en/about-claude/model-deprecations",
      priceNote: "Not listed on Anthropic's pricing page when checked on 8 October 2026, so no ratio is given."
    },
    {
      aliases: [],
      kind: "model",
      announced: "2025-01-21",
      shutdownIsEarliest: false,
      replacements: ["claude-opus-4-8"],
      prices: [],
      breaks: [
        {
          short: "a non-default temperature, top_p or top_k returns a 400 error",
          text: "Claude 4.7 and later models return a 400 error when temperature, top_p or top_k is set to a non-default value. Anthropic's Python SDK v1.0 and later removes these parameters, so passing them raises a TypeError. Omit them and guide the model with the prompt.",
          source: "https://platform.claude.com/docs/en/about-claude/model-deprecations"
        },
        {
          short: "a newer tokenizer counts about 30% more tokens for the same text",
          text: "Claude 4.7 and later models use a newer tokenizer that produces approximately 30% more tokens for the same text, so the same prompt can cost more than the per-token ratio suggests. Measure on your own prompts.",
          source: "https://platform.claude.com/docs/en/about-claude/pricing"
        }
      ],
      notes: [
        "Dates apply to the Claude API, Claude Platform on AWS and Microsoft Foundry. Amazon Bedrock and Google Cloud set their own retirement schedules."
      ],
      seen: "2026-10-08",
      provider: "anthropic",
      id: "claude-2.1",
      shutdown: "2025-07-21",
      source: "https://platform.claude.com/docs/en/about-claude/model-deprecations",
      priceNote: "Not listed on Anthropic's pricing page when checked on 8 October 2026, so no ratio is given."
    },
    {
      aliases: [],
      kind: "model",
      announced: "2025-01-21",
      shutdownIsEarliest: false,
      replacements: ["claude-sonnet-4-6"],
      prices: [],
      breaks: [],
      notes: [
        "Dates apply to the Claude API, Claude Platform on AWS and Microsoft Foundry. Amazon Bedrock and Google Cloud set their own retirement schedules."
      ],
      seen: "2026-10-08",
      provider: "anthropic",
      id: "claude-3-sonnet-20240229",
      shutdown: "2025-07-21",
      source: "https://platform.claude.com/docs/en/about-claude/model-deprecations",
      priceNote: "Not listed on Anthropic's pricing page when checked on 8 October 2026, so no ratio is given."
    },
    {
      aliases: [],
      kind: "model",
      announced: "2025-04-28",
      shutdownIsEarliest: false,
      replacements: ["o3"],
      prices: [],
      breaks: [],
      notes: [],
      seen: "2026-10-08",
      provider: "openai",
      id: "o1-preview",
      shutdown: "2025-07-28",
      source: "https://developers.openai.com/api/docs/deprecations",
      priceNote: "Not listed on OpenAI's pricing page when checked on 8 October 2026, so no ratio is given."
    },
    {
      aliases: [],
      kind: "model",
      announced: null,
      shutdownIsEarliest: false,
      replacements: ["gemini-2.5-flash-lite"],
      prices: [],
      breaks: [],
      notes: [],
      seen: "2026-10-08",
      provider: "vertex-ai",
      id: "gemini-1.5-flash-002",
      shutdown: "2025-09-24",
      source: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/model-versions",
      priceNote: "The retiring model is not listed on the Agent Platform pricing page when checked on 8 October 2026, so no ratio is given."
    },
    {
      aliases: [],
      kind: "model",
      announced: null,
      shutdownIsEarliest: false,
      replacements: ["gemini-2.5-flash"],
      prices: [],
      breaks: [],
      notes: [],
      seen: "2026-10-08",
      provider: "vertex-ai",
      id: "gemini-1.5-pro-002",
      shutdown: "2025-09-24",
      source: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/model-versions",
      priceNote: "The retiring model is not listed on the Agent Platform pricing page when checked on 8 October 2026, so no ratio is given."
    },
    {
      aliases: [],
      kind: "model",
      announced: "2025-04-28",
      shutdownIsEarliest: false,
      replacements: ["o4-mini"],
      prices: [],
      breaks: [],
      notes: [],
      seen: "2026-10-08",
      provider: "openai",
      id: "o1-mini",
      shutdown: "2025-10-27",
      source: "https://developers.openai.com/api/docs/deprecations",
      priceNote: "Not listed on OpenAI's pricing page when checked on 8 October 2026, so no ratio is given."
    },
    {
      aliases: [],
      kind: "model",
      announced: "2025-08-13",
      shutdownIsEarliest: false,
      replacements: ["claude-sonnet-4-6"],
      prices: [],
      breaks: [],
      notes: [
        "Dates apply to the Claude API, Claude Platform on AWS and Microsoft Foundry. Amazon Bedrock and Google Cloud set their own retirement schedules."
      ],
      seen: "2026-10-08",
      provider: "anthropic",
      id: "claude-3-5-sonnet-20240620",
      shutdown: "2025-10-28",
      source: "https://platform.claude.com/docs/en/about-claude/model-deprecations",
      priceNote: "Not listed on Anthropic's pricing page when checked on 8 October 2026, so no ratio is given."
    },
    {
      aliases: [],
      kind: "model",
      announced: "2025-08-13",
      shutdownIsEarliest: false,
      replacements: ["claude-sonnet-4-6"],
      prices: [],
      breaks: [],
      notes: [
        "Dates apply to the Claude API, Claude Platform on AWS and Microsoft Foundry. Amazon Bedrock and Google Cloud set their own retirement schedules."
      ],
      seen: "2026-10-08",
      provider: "anthropic",
      id: "claude-3-5-sonnet-20241022",
      shutdown: "2025-10-28",
      source: "https://platform.claude.com/docs/en/about-claude/model-deprecations",
      priceNote: "Not listed on Anthropic's pricing page when checked on 8 October 2026, so no ratio is given."
    },
    {
      aliases: [],
      kind: "model",
      announced: null,
      shutdownIsEarliest: true,
      replacements: ["gemini-3.6-flash"],
      prices: [],
      breaks: [
        {
          short: "a temperature below 1.0 may cause looping",
          text: "For Gemini 3 models Google recommends keeping temperature at its default of 1.0; setting it below 1.0 may cause looping or degraded performance.",
          source: "https://ai.google.dev/gemini-api/docs/gemini-3"
        },
        {
          short: "sending thinking_level and thinking_budget together returns a 400 error",
          text: "Gemini 3 uses thinking_level; sending thinking_level and the legacy thinking_budget in the same request returns a 400 error.",
          source: "https://ai.google.dev/gemini-api/docs/gemini-3"
        }
      ],
      notes: [
        "Google lists this as the earliest possible shutdown date and says it will give the exact date with advance notice."
      ],
      seen: "2026-10-08",
      provider: "gemini-api",
      id: "gemini-2.5-flash-preview-05-20",
      shutdown: "2025-11-18",
      source: "https://ai.google.dev/gemini-api/docs/deprecations",
      priceNote: "The retiring model is not listed on the Gemini API pricing page when checked on 8 October 2026, so no ratio is given."
    },
    {
      aliases: [],
      kind: "model",
      announced: null,
      shutdownIsEarliest: true,
      replacements: ["gemini-3.1-pro-preview"],
      prices: [],
      breaks: [
        {
          short: "a temperature below 1.0 may cause looping",
          text: "For Gemini 3 models Google recommends keeping temperature at its default of 1.0; setting it below 1.0 may cause looping or degraded performance.",
          source: "https://ai.google.dev/gemini-api/docs/gemini-3"
        },
        {
          short: "sending thinking_level and thinking_budget together returns a 400 error",
          text: "Gemini 3 uses thinking_level; sending thinking_level and the legacy thinking_budget in the same request returns a 400 error.",
          source: "https://ai.google.dev/gemini-api/docs/gemini-3"
        }
      ],
      notes: [
        "Google lists this as the earliest possible shutdown date and says it will give the exact date with advance notice."
      ],
      seen: "2026-10-08",
      provider: "gemini-api",
      id: "gemini-2.5-pro-preview-03-25",
      shutdown: "2025-12-02",
      source: "https://ai.google.dev/gemini-api/docs/deprecations",
      priceNote: "The retiring model is not listed on the Gemini API pricing page when checked on 8 October 2026, so no ratio is given."
    },
    {
      aliases: [],
      kind: "model",
      announced: null,
      shutdownIsEarliest: true,
      replacements: ["gemini-3.1-pro-preview"],
      prices: [],
      breaks: [
        {
          short: "a temperature below 1.0 may cause looping",
          text: "For Gemini 3 models Google recommends keeping temperature at its default of 1.0; setting it below 1.0 may cause looping or degraded performance.",
          source: "https://ai.google.dev/gemini-api/docs/gemini-3"
        },
        {
          short: "sending thinking_level and thinking_budget together returns a 400 error",
          text: "Gemini 3 uses thinking_level; sending thinking_level and the legacy thinking_budget in the same request returns a 400 error.",
          source: "https://ai.google.dev/gemini-api/docs/gemini-3"
        }
      ],
      notes: [
        "Google lists this as the earliest possible shutdown date and says it will give the exact date with advance notice."
      ],
      seen: "2026-10-08",
      provider: "gemini-api",
      id: "gemini-2.5-pro-preview-05-06",
      shutdown: "2025-12-02",
      source: "https://ai.google.dev/gemini-api/docs/deprecations",
      priceNote: "The retiring model is not listed on the Gemini API pricing page when checked on 8 October 2026, so no ratio is given."
    },
    {
      aliases: [],
      kind: "model",
      announced: null,
      shutdownIsEarliest: true,
      replacements: ["gemini-3.1-pro-preview"],
      prices: [],
      breaks: [
        {
          short: "a temperature below 1.0 may cause looping",
          text: "For Gemini 3 models Google recommends keeping temperature at its default of 1.0; setting it below 1.0 may cause looping or degraded performance.",
          source: "https://ai.google.dev/gemini-api/docs/gemini-3"
        },
        {
          short: "sending thinking_level and thinking_budget together returns a 400 error",
          text: "Gemini 3 uses thinking_level; sending thinking_level and the legacy thinking_budget in the same request returns a 400 error.",
          source: "https://ai.google.dev/gemini-api/docs/gemini-3"
        }
      ],
      notes: [
        "Google lists this as the earliest possible shutdown date and says it will give the exact date with advance notice."
      ],
      seen: "2026-10-08",
      provider: "gemini-api",
      id: "gemini-2.5-pro-preview-06-05",
      shutdown: "2025-12-02",
      source: "https://ai.google.dev/gemini-api/docs/deprecations",
      priceNote: "The retiring model is not listed on the Gemini API pricing page when checked on 8 October 2026, so no ratio is given."
    },
    {
      aliases: [],
      kind: "model",
      announced: null,
      shutdownIsEarliest: true,
      replacements: ["gemini-2.5-flash-lite"],
      prices: [],
      breaks: [],
      notes: [
        "Google lists this as the earliest possible shutdown date and says it will give the exact date with advance notice."
      ],
      seen: "2026-10-08",
      provider: "gemini-api",
      id: "gemini-2.0-flash-lite-preview",
      shutdown: "2025-12-09",
      source: "https://ai.google.dev/gemini-api/docs/deprecations",
      priceNote: "The retiring model is not listed on the Gemini API pricing page when checked on 8 October 2026, so no ratio is given."
    },
    {
      aliases: [],
      kind: "model",
      announced: null,
      shutdownIsEarliest: true,
      replacements: ["gemini-2.5-flash-lite"],
      prices: [],
      breaks: [],
      notes: [
        "Google lists this as the earliest possible shutdown date and says it will give the exact date with advance notice."
      ],
      seen: "2026-10-08",
      provider: "gemini-api",
      id: "gemini-2.0-flash-lite-preview-02-05",
      shutdown: "2025-12-09",
      source: "https://ai.google.dev/gemini-api/docs/deprecations",
      priceNote: "The retiring model is not listed on the Gemini API pricing page when checked on 8 October 2026, so no ratio is given."
    },
    {
      aliases: [],
      kind: "model",
      announced: "2025-06-30",
      shutdownIsEarliest: false,
      replacements: ["claude-opus-4-8"],
      prices: [],
      breaks: [
        {
          short: "a non-default temperature, top_p or top_k returns a 400 error",
          text: "Claude 4.7 and later models return a 400 error when temperature, top_p or top_k is set to a non-default value. Anthropic's Python SDK v1.0 and later removes these parameters, so passing them raises a TypeError. Omit them and guide the model with the prompt.",
          source: "https://platform.claude.com/docs/en/about-claude/model-deprecations"
        },
        {
          short: "a newer tokenizer counts about 30% more tokens for the same text",
          text: "Claude 4.7 and later models use a newer tokenizer that produces approximately 30% more tokens for the same text, so the same prompt can cost more than the per-token ratio suggests. Measure on your own prompts.",
          source: "https://platform.claude.com/docs/en/about-claude/pricing"
        }
      ],
      notes: [
        "Dates apply to the Claude API, Claude Platform on AWS and Microsoft Foundry. Amazon Bedrock and Google Cloud set their own retirement schedules."
      ],
      seen: "2026-10-08",
      provider: "anthropic",
      id: "claude-3-opus-20240229",
      shutdown: "2026-01-05",
      source: "https://platform.claude.com/docs/en/about-claude/model-deprecations",
      priceNote: "Not listed on Anthropic's pricing page when checked on 8 October 2026, so no ratio is given."
    },
    {
      aliases: [],
      kind: "model",
      announced: "2025-11-17",
      shutdownIsEarliest: false,
      replacements: ["gpt-5-codex-mini"],
      prices: [],
      breaks: [
        {
          short: "the legacy local shell tool is no longer supported",
          text: "The legacy local shell tool, available only with codex-mini-latest, is no longer supported; OpenAI points to its latest shell tool.",
          source: "https://developers.openai.com/api/docs/deprecations"
        }
      ],
      notes: [],
      seen: "2026-10-08",
      provider: "openai",
      id: "codex-mini-latest",
      shutdown: "2026-02-12",
      source: "https://developers.openai.com/api/docs/deprecations",
      priceNote: "Not listed on OpenAI's pricing page when checked on 8 October 2026, so no ratio is given."
    },
    {
      aliases: [],
      kind: "model",
      announced: null,
      shutdownIsEarliest: true,
      replacements: ["gemini-3.6-flash"],
      prices: [],
      breaks: [
        {
          short: "a temperature below 1.0 may cause looping",
          text: "For Gemini 3 models Google recommends keeping temperature at its default of 1.0; setting it below 1.0 may cause looping or degraded performance.",
          source: "https://ai.google.dev/gemini-api/docs/gemini-3"
        },
        {
          short: "sending thinking_level and thinking_budget together returns a 400 error",
          text: "Gemini 3 uses thinking_level; sending thinking_level and the legacy thinking_budget in the same request returns a 400 error.",
          source: "https://ai.google.dev/gemini-api/docs/gemini-3"
        }
      ],
      notes: [
        "Google lists this as the earliest possible shutdown date and says it will give the exact date with advance notice."
      ],
      seen: "2026-10-08",
      provider: "gemini-api",
      id: "gemini-2.5-flash-preview-09-25",
      shutdown: "2026-02-17",
      source: "https://ai.google.dev/gemini-api/docs/deprecations",
      priceNote: "The retiring model is not listed on the Gemini API pricing page when checked on 8 October 2026, so no ratio is given."
    },
    {
      aliases: [],
      kind: "model",
      announced: "2025-11-18",
      shutdownIsEarliest: false,
      replacements: ["gpt-5.1-chat-latest"],
      prices: [],
      breaks: [],
      notes: [
        "The replacement OpenAI named, gpt-5.1-chat-latest, was itself shut down on 23 July 2026."
      ],
      seen: "2026-10-08",
      provider: "openai",
      id: "chatgpt-4o-latest",
      shutdown: "2026-02-17",
      source: "https://developers.openai.com/api/docs/deprecations",
      priceNote: "Not listed on OpenAI's pricing page when checked on 8 October 2026, so no ratio is given."
    },
    {
      aliases: [],
      kind: "model",
      announced: "2025-12-19",
      shutdownIsEarliest: false,
      replacements: ["claude-haiku-4-5-20251001"],
      prices: [
        {
          replacement: "claude-haiku-4-5-20251001",
          retiring: {
            input: 0.8,
            output: 4
          },
          replacementPrice: {
            input: 1,
            output: 5
          },
          ratio: {
            input: 1.25,
            output: 1.25
          }
        }
      ],
      breaks: [],
      notes: [
        "Dates apply to the Claude API, Claude Platform on AWS and Microsoft Foundry. Amazon Bedrock and Google Cloud set their own retirement schedules."
      ],
      seen: "2026-10-08",
      provider: "anthropic",
      id: "claude-3-5-haiku-20241022",
      shutdown: "2026-02-19",
      source: "https://platform.claude.com/docs/en/about-claude/model-deprecations",
      pricingSource: "https://platform.claude.com/docs/en/about-claude/pricing",
      pricingSeen: "2026-10-08"
    },
    {
      aliases: [],
      kind: "model",
      announced: "2025-10-28",
      shutdownIsEarliest: false,
      replacements: ["claude-sonnet-4-6"],
      prices: [],
      breaks: [],
      notes: [
        "Dates apply to the Claude API, Claude Platform on AWS and Microsoft Foundry. Amazon Bedrock and Google Cloud set their own retirement schedules."
      ],
      seen: "2026-10-08",
      provider: "anthropic",
      id: "claude-3-7-sonnet-20250219",
      shutdown: "2026-02-19",
      source: "https://platform.claude.com/docs/en/about-claude/model-deprecations",
      priceNote: "Not listed on Anthropic's pricing page when checked on 8 October 2026, so no ratio is given."
    },
    {
      aliases: [],
      kind: "model",
      announced: null,
      shutdownIsEarliest: true,
      replacements: ["gemini-3.1-pro-preview"],
      prices: [],
      breaks: [],
      notes: [
        "Google lists this as the earliest possible shutdown date and says it will give the exact date with advance notice."
      ],
      seen: "2026-10-08",
      provider: "gemini-api",
      id: "gemini-3-pro-preview",
      shutdown: "2026-03-09",
      source: "https://ai.google.dev/gemini-api/docs/deprecations",
      priceNote: "The retiring model is not listed on the Gemini API pricing page when checked on 8 October 2026, so no ratio is given."
    },
    {
      aliases: ["gpt-4-turbo-preview", "gpt-4-turbo-preview-completions"],
      kind: "model",
      announced: "2025-09-26",
      shutdownIsEarliest: false,
      replacements: ["gpt-5", "gpt-4.1"],
      prices: [],
      breaks: [],
      notes: [],
      seen: "2026-10-08",
      provider: "openai",
      id: "gpt-4-0125-preview",
      shutdown: "2026-03-26",
      source: "https://developers.openai.com/api/docs/deprecations",
      priceNote: "Not listed on OpenAI's pricing page when checked on 8 October 2026, so no ratio is given."
    },
    {
      aliases: [],
      kind: "model",
      announced: "2025-09-26",
      shutdownIsEarliest: false,
      replacements: ["gpt-5", "gpt-4.1"],
      prices: [],
      breaks: [],
      notes: [],
      seen: "2026-10-08",
      provider: "openai",
      id: "gpt-4-0314",
      shutdown: "2026-03-26",
      source: "https://developers.openai.com/api/docs/deprecations",
      priceNote: "Not listed on OpenAI's pricing page when checked on 8 October 2026, so no ratio is given."
    },
    {
      aliases: [],
      kind: "model",
      announced: null,
      shutdownIsEarliest: true,
      replacements: ["gemini-3.1-flash-lite"],
      prices: [],
      breaks: [
        {
          short: "a temperature below 1.0 may cause looping",
          text: "For Gemini 3 models Google recommends keeping temperature at its default of 1.0; setting it below 1.0 may cause looping or degraded performance.",
          source: "https://ai.google.dev/gemini-api/docs/gemini-3"
        },
        {
          short: "sending thinking_level and thinking_budget together returns a 400 error",
          text: "Gemini 3 uses thinking_level; sending thinking_level and the legacy thinking_budget in the same request returns a 400 error.",
          source: "https://ai.google.dev/gemini-api/docs/gemini-3"
        }
      ],
      notes: [
        "Google lists this as the earliest possible shutdown date and says it will give the exact date with advance notice."
      ],
      seen: "2026-10-08",
      provider: "gemini-api",
      id: "gemini-2.5-flash-lite-preview-09-2025",
      shutdown: "2026-03-31",
      source: "https://ai.google.dev/gemini-api/docs/deprecations",
      priceNote: "The retiring model is not listed on the Gemini API pricing page when checked on 8 October 2026, so no ratio is given."
    },
    {
      aliases: [],
      kind: "model",
      announced: "2026-02-19",
      shutdownIsEarliest: false,
      replacements: ["claude-haiku-4-5-20251001"],
      prices: [],
      breaks: [],
      notes: [
        "Dates apply to the Claude API, Claude Platform on AWS and Microsoft Foundry. Amazon Bedrock and Google Cloud set their own retirement schedules."
      ],
      seen: "2026-10-08",
      provider: "anthropic",
      id: "claude-3-haiku-20240307",
      shutdown: "2026-04-20",
      source: "https://platform.claude.com/docs/en/about-claude/model-deprecations",
      priceNote: "Not listed on Anthropic's pricing page when checked on 8 October 2026, so no ratio is given."
    },
    {
      aliases: [],
      kind: "model",
      announced: null,
      shutdownIsEarliest: true,
      replacements: ["gemini-3.1-flash-lite"],
      prices: [],
      breaks: [],
      notes: [
        "Google lists this as the earliest possible shutdown date and says it will give the exact date with advance notice."
      ],
      seen: "2026-10-08",
      provider: "gemini-api",
      id: "gemini-3.1-flash-lite-preview",
      shutdown: "2026-05-25",
      source: "https://ai.google.dev/gemini-api/docs/deprecations",
      priceNote: "The retiring model is not listed on the Gemini API pricing page when checked on 8 October 2026, so no ratio is given."
    },
    {
      aliases: [],
      kind: "model",
      announced: null,
      shutdownIsEarliest: true,
      replacements: ["gemini-3.6-flash"],
      prices: [],
      breaks: [
        {
          short: "a temperature below 1.0 may cause looping",
          text: "For Gemini 3 models Google recommends keeping temperature at its default of 1.0; setting it below 1.0 may cause looping or degraded performance.",
          source: "https://ai.google.dev/gemini-api/docs/gemini-3"
        },
        {
          short: "sending thinking_level and thinking_budget together returns a 400 error",
          text: "Gemini 3 uses thinking_level; sending thinking_level and the legacy thinking_budget in the same request returns a 400 error.",
          source: "https://ai.google.dev/gemini-api/docs/gemini-3"
        }
      ],
      notes: [
        "Google lists this as the earliest possible shutdown date and says it will give the exact date with advance notice."
      ],
      seen: "2026-10-08",
      provider: "gemini-api",
      id: "gemini-2.0-flash",
      shutdown: "2026-06-01",
      source: "https://ai.google.dev/gemini-api/docs/deprecations",
      priceNote: "The retiring model is not listed on the Gemini API pricing page when checked on 8 October 2026, so no ratio is given."
    },
    {
      aliases: [],
      kind: "model",
      announced: null,
      shutdownIsEarliest: true,
      replacements: ["gemini-3.6-flash"],
      prices: [],
      breaks: [
        {
          short: "a temperature below 1.0 may cause looping",
          text: "For Gemini 3 models Google recommends keeping temperature at its default of 1.0; setting it below 1.0 may cause looping or degraded performance.",
          source: "https://ai.google.dev/gemini-api/docs/gemini-3"
        },
        {
          short: "sending thinking_level and thinking_budget together returns a 400 error",
          text: "Gemini 3 uses thinking_level; sending thinking_level and the legacy thinking_budget in the same request returns a 400 error.",
          source: "https://ai.google.dev/gemini-api/docs/gemini-3"
        }
      ],
      notes: [
        "Google lists this as the earliest possible shutdown date and says it will give the exact date with advance notice."
      ],
      seen: "2026-10-08",
      provider: "gemini-api",
      id: "gemini-2.0-flash-001",
      shutdown: "2026-06-01",
      source: "https://ai.google.dev/gemini-api/docs/deprecations",
      priceNote: "The retiring model is not listed on the Gemini API pricing page when checked on 8 October 2026, so no ratio is given."
    },
    {
      aliases: [],
      kind: "model",
      announced: null,
      shutdownIsEarliest: true,
      replacements: ["gemini-3.1-flash-lite"],
      prices: [],
      breaks: [
        {
          short: "a temperature below 1.0 may cause looping",
          text: "For Gemini 3 models Google recommends keeping temperature at its default of 1.0; setting it below 1.0 may cause looping or degraded performance.",
          source: "https://ai.google.dev/gemini-api/docs/gemini-3"
        },
        {
          short: "sending thinking_level and thinking_budget together returns a 400 error",
          text: "Gemini 3 uses thinking_level; sending thinking_level and the legacy thinking_budget in the same request returns a 400 error.",
          source: "https://ai.google.dev/gemini-api/docs/gemini-3"
        }
      ],
      notes: [
        "Google lists this as the earliest possible shutdown date and says it will give the exact date with advance notice."
      ],
      seen: "2026-10-08",
      provider: "gemini-api",
      id: "gemini-2.0-flash-lite",
      shutdown: "2026-06-01",
      source: "https://ai.google.dev/gemini-api/docs/deprecations",
      priceNote: "The retiring model is not listed on the Gemini API pricing page when checked on 8 October 2026, so no ratio is given."
    },
    {
      aliases: [],
      kind: "model",
      announced: null,
      shutdownIsEarliest: true,
      replacements: ["gemini-3.1-flash-lite"],
      prices: [],
      breaks: [
        {
          short: "a temperature below 1.0 may cause looping",
          text: "For Gemini 3 models Google recommends keeping temperature at its default of 1.0; setting it below 1.0 may cause looping or degraded performance.",
          source: "https://ai.google.dev/gemini-api/docs/gemini-3"
        },
        {
          short: "sending thinking_level and thinking_budget together returns a 400 error",
          text: "Gemini 3 uses thinking_level; sending thinking_level and the legacy thinking_budget in the same request returns a 400 error.",
          source: "https://ai.google.dev/gemini-api/docs/gemini-3"
        }
      ],
      notes: [
        "Google lists this as the earliest possible shutdown date and says it will give the exact date with advance notice."
      ],
      seen: "2026-10-08",
      provider: "gemini-api",
      id: "gemini-2.0-flash-lite-001",
      shutdown: "2026-06-01",
      source: "https://ai.google.dev/gemini-api/docs/deprecations",
      priceNote: "The retiring model is not listed on the Gemini API pricing page when checked on 8 October 2026, so no ratio is given."
    },
    {
      aliases: [],
      kind: "model",
      announced: null,
      shutdownIsEarliest: false,
      replacements: ["gemini-3.1-flash-lite"],
      prices: [],
      breaks: [
        {
          short: "temperature, top_p and top_k are deprecated and should be removed",
          text: "For Gemini 3.x models, temperature, top_p and top_k are deprecated: Google says to remove them from every request and to use a system instruction for determinism.",
          source: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/migrate"
        },
        {
          short: "thinking_budget gives way to thinking_level",
          text: "thinking_budget is deprecated on Gemini 3.x in favour of thinking_level.",
          source: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/migrate"
        },
        {
          short: "a function response that does not match its call returns an empty answer, not an error",
          text: "Every FunctionResponse must carry the id and name of its FunctionCall, exactly one per call. Google says the API does not yet return an error for a mismatch; the model returns an empty response with finish_reason STOP instead.",
          source: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/migrate"
        }
      ],
      notes: [],
      seen: "2026-10-08",
      provider: "vertex-ai",
      id: "gemini-2.0-flash",
      shutdown: "2026-06-01",
      source: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/model-versions",
      priceNote: "The retiring model is not listed on the Agent Platform pricing page when checked on 8 October 2026, so no ratio is given."
    },
    {
      aliases: [],
      kind: "model",
      announced: null,
      shutdownIsEarliest: false,
      replacements: ["gemini-3.1-flash-lite"],
      prices: [],
      breaks: [
        {
          short: "temperature, top_p and top_k are deprecated and should be removed",
          text: "For Gemini 3.x models, temperature, top_p and top_k are deprecated: Google says to remove them from every request and to use a system instruction for determinism.",
          source: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/migrate"
        },
        {
          short: "thinking_budget gives way to thinking_level",
          text: "thinking_budget is deprecated on Gemini 3.x in favour of thinking_level.",
          source: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/migrate"
        },
        {
          short: "a function response that does not match its call returns an empty answer, not an error",
          text: "Every FunctionResponse must carry the id and name of its FunctionCall, exactly one per call. Google says the API does not yet return an error for a mismatch; the model returns an empty response with finish_reason STOP instead.",
          source: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/migrate"
        }
      ],
      notes: [],
      seen: "2026-10-08",
      provider: "vertex-ai",
      id: "gemini-2.0-flash-lite",
      shutdown: "2026-06-01",
      source: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/model-versions",
      priceNote: "The retiring model is not listed on the Agent Platform pricing page when checked on 8 October 2026, so no ratio is given."
    },
    {
      aliases: [],
      kind: "model",
      announced: "2026-04-14",
      shutdownIsEarliest: false,
      replacements: ["claude-opus-4-8"],
      prices: [
        {
          replacement: "claude-opus-4-8",
          retiring: {
            input: 15,
            output: 75
          },
          replacementPrice: {
            input: 5,
            output: 25
          },
          ratio: {
            input: 0.333,
            output: 0.333
          }
        }
      ],
      breaks: [
        {
          short: "a non-default temperature, top_p or top_k returns a 400 error",
          text: "Claude 4.7 and later models return a 400 error when temperature, top_p or top_k is set to a non-default value. Anthropic's Python SDK v1.0 and later removes these parameters, so passing them raises a TypeError. Omit them and guide the model with the prompt.",
          source: "https://platform.claude.com/docs/en/about-claude/model-deprecations"
        },
        {
          short: "a newer tokenizer counts about 30% more tokens for the same text",
          text: "Claude 4.7 and later models use a newer tokenizer that produces approximately 30% more tokens for the same text, so the same prompt can cost more than the per-token ratio suggests. Measure on your own prompts.",
          source: "https://platform.claude.com/docs/en/about-claude/pricing"
        }
      ],
      notes: [
        "Dates apply to the Claude API, Claude Platform on AWS and Microsoft Foundry. Amazon Bedrock and Google Cloud set their own retirement schedules."
      ],
      seen: "2026-10-08",
      provider: "anthropic",
      id: "claude-opus-4-20250514",
      shutdown: "2026-06-15",
      source: "https://platform.claude.com/docs/en/about-claude/model-deprecations",
      pricingSource: "https://platform.claude.com/docs/en/about-claude/pricing",
      pricingSeen: "2026-10-08"
    },
    {
      aliases: [],
      kind: "model",
      announced: "2026-04-14",
      shutdownIsEarliest: false,
      replacements: ["claude-sonnet-4-6"],
      prices: [
        {
          replacement: "claude-sonnet-4-6",
          retiring: {
            input: 3,
            output: 15
          },
          replacementPrice: {
            input: 3,
            output: 15
          },
          ratio: {
            input: 1,
            output: 1
          }
        }
      ],
      breaks: [],
      notes: [
        "Dates apply to the Claude API, Claude Platform on AWS and Microsoft Foundry. Amazon Bedrock and Google Cloud set their own retirement schedules."
      ],
      seen: "2026-10-08",
      provider: "anthropic",
      id: "claude-sonnet-4-20250514",
      shutdown: "2026-06-15",
      source: "https://platform.claude.com/docs/en/about-claude/model-deprecations",
      pricingSource: "https://platform.claude.com/docs/en/about-claude/pricing",
      pricingSeen: "2026-10-08"
    },
    {
      aliases: ["computer-use-preview"],
      kind: "model",
      announced: "2026-04-22",
      shutdownIsEarliest: false,
      replacements: ["gpt-5.6-terra"],
      prices: [],
      breaks: [],
      notes: [],
      seen: "2026-10-08",
      provider: "openai",
      id: "computer-use-preview-2025-03-11",
      shutdown: "2026-07-23",
      source: "https://developers.openai.com/api/docs/deprecations",
      priceNote: "Not listed on OpenAI's pricing page when checked on 8 October 2026, so no ratio is given."
    },
    {
      aliases: [],
      kind: "model",
      announced: "2026-04-22",
      shutdownIsEarliest: false,
      replacements: ["gpt-5.6-terra"],
      prices: [],
      breaks: [],
      notes: [],
      seen: "2026-10-08",
      provider: "openai",
      id: "gpt-4o-mini-search-preview-2025-03-11",
      shutdown: "2026-07-23",
      source: "https://developers.openai.com/api/docs/deprecations",
      priceNote: "Not listed on OpenAI's pricing page when checked on 8 October 2026, so no ratio is given."
    },
    {
      aliases: [],
      kind: "model",
      announced: "2026-04-22",
      shutdownIsEarliest: false,
      replacements: ["gpt-5.6-terra"],
      prices: [],
      breaks: [],
      notes: [],
      seen: "2026-10-08",
      provider: "openai",
      id: "gpt-4o-search-preview-2025-03-11",
      shutdown: "2026-07-23",
      source: "https://developers.openai.com/api/docs/deprecations",
      priceNote: "Not listed on OpenAI's pricing page when checked on 8 October 2026, so no ratio is given."
    },
    {
      aliases: [],
      kind: "model",
      announced: "2026-04-22",
      shutdownIsEarliest: false,
      replacements: ["gpt-5.6-sol"],
      prices: [],
      breaks: [],
      notes: [],
      seen: "2026-10-08",
      provider: "openai",
      id: "gpt-5-chat-latest",
      shutdown: "2026-07-23",
      source: "https://developers.openai.com/api/docs/deprecations",
      priceNote: "Not listed on OpenAI's pricing page when checked on 8 October 2026, so no ratio is given."
    },
    {
      aliases: [],
      kind: "model",
      announced: "2026-04-22",
      shutdownIsEarliest: false,
      replacements: ["gpt-5.6-sol"],
      prices: [],
      breaks: [],
      notes: [],
      seen: "2026-10-08",
      provider: "openai",
      id: "gpt-5-codex",
      shutdown: "2026-07-23",
      source: "https://developers.openai.com/api/docs/deprecations",
      priceNote: "Not listed on OpenAI's pricing page when checked on 8 October 2026, so no ratio is given."
    },
    {
      aliases: [],
      kind: "model",
      announced: "2026-04-22",
      shutdownIsEarliest: false,
      replacements: ["gpt-5.6-sol"],
      prices: [],
      breaks: [],
      notes: [],
      seen: "2026-10-08",
      provider: "openai",
      id: "gpt-5.1-chat-latest",
      shutdown: "2026-07-23",
      source: "https://developers.openai.com/api/docs/deprecations",
      priceNote: "Not listed on OpenAI's pricing page when checked on 8 October 2026, so no ratio is given."
    },
    {
      aliases: [],
      kind: "model",
      announced: "2026-04-22",
      shutdownIsEarliest: false,
      replacements: ["gpt-5.6-sol"],
      prices: [],
      breaks: [],
      notes: [],
      seen: "2026-10-08",
      provider: "openai",
      id: "gpt-5.1-codex",
      shutdown: "2026-07-23",
      source: "https://developers.openai.com/api/docs/deprecations",
      priceNote: "Not listed on OpenAI's pricing page when checked on 8 October 2026, so no ratio is given."
    },
    {
      aliases: [],
      kind: "model",
      announced: "2026-04-22",
      shutdownIsEarliest: false,
      replacements: ["gpt-5.6-sol"],
      prices: [],
      breaks: [],
      notes: [],
      seen: "2026-10-08",
      provider: "openai",
      id: "gpt-5.1-codex-max",
      shutdown: "2026-07-23",
      source: "https://developers.openai.com/api/docs/deprecations",
      priceNote: "Not listed on OpenAI's pricing page when checked on 8 October 2026, so no ratio is given."
    },
    {
      aliases: [],
      kind: "model",
      announced: "2026-04-22",
      shutdownIsEarliest: false,
      replacements: ["gpt-5.6-terra"],
      prices: [],
      breaks: [],
      notes: [],
      seen: "2026-10-08",
      provider: "openai",
      id: "gpt-5.1-codex-mini",
      shutdown: "2026-07-23",
      source: "https://developers.openai.com/api/docs/deprecations",
      priceNote: "Not listed on OpenAI's pricing page when checked on 8 October 2026, so no ratio is given."
    },
    {
      aliases: [],
      kind: "model",
      announced: "2026-04-22",
      shutdownIsEarliest: false,
      replacements: ["gpt-5.6-sol"],
      prices: [],
      breaks: [],
      notes: [],
      seen: "2026-10-08",
      provider: "openai",
      id: "gpt-5.2-codex",
      shutdown: "2026-07-23",
      source: "https://developers.openai.com/api/docs/deprecations",
      priceNote: "Not listed on OpenAI's pricing page when checked on 8 October 2026, so no ratio is given."
    },
    {
      aliases: ["o3-deep-research"],
      kind: "model",
      announced: "2026-04-22",
      shutdownIsEarliest: false,
      replacements: ["gpt-5.6-sol"],
      prices: [],
      breaks: [],
      notes: [],
      seen: "2026-10-08",
      provider: "openai",
      id: "o3-deep-research-2025-06-26",
      shutdown: "2026-07-23",
      source: "https://developers.openai.com/api/docs/deprecations",
      priceNote: "Not listed on OpenAI's pricing page when checked on 8 October 2026, so no ratio is given."
    },
    {
      aliases: ["o4-mini-deep-research"],
      kind: "model",
      announced: "2026-04-22",
      shutdownIsEarliest: false,
      replacements: ["gpt-5.6-sol"],
      prices: [],
      breaks: [],
      notes: [],
      seen: "2026-10-08",
      provider: "openai",
      id: "o4-mini-deep-research-2025-06-26",
      shutdown: "2026-07-23",
      source: "https://developers.openai.com/api/docs/deprecations",
      priceNote: "Not listed on OpenAI's pricing page when checked on 8 October 2026, so no ratio is given."
    },
    {
      aliases: [],
      kind: "model",
      announced: null,
      shutdownIsEarliest: true,
      replacements: ["gemini-3.8-flash"],
      prices: [],
      breaks: [
        {
          short: "a temperature below 1.0 may cause looping",
          text: "For Gemini 3 models Google recommends keeping temperature at its default of 1.0; setting it below 1.0 may cause looping or degraded performance.",
          source: "https://ai.google.dev/gemini-api/docs/gemini-3"
        },
        {
          short: "sending thinking_level and thinking_budget together returns a 400 error",
          text: "Gemini 3 uses thinking_level; sending thinking_level and the legacy thinking_budget in the same request returns a 400 error.",
          source: "https://ai.google.dev/gemini-api/docs/gemini-3"
        }
      ],
      notes: [
        "Google lists this as the earliest possible shutdown date and says it will give the exact date with advance notice."
      ],
      seen: "2026-10-08",
      provider: "gemini-api",
      id: "gemini-2.5-computer-use-preview-10-2025",
      shutdown: "2026-07-28",
      source: "https://ai.google.dev/gemini-api/docs/deprecations",
      priceNote: "The retiring model is not listed on the Gemini API pricing page when checked on 8 October 2026, so no ratio is given."
    },
    {
      aliases: ["claude-opus-4-1"],
      kind: "model",
      announced: "2026-06-05",
      shutdownIsEarliest: false,
      replacements: ["claude-opus-4-8"],
      prices: [
        {
          replacement: "claude-opus-4-8",
          retiring: {
            input: 15,
            output: 75
          },
          replacementPrice: {
            input: 5,
            output: 25
          },
          ratio: {
            input: 0.333,
            output: 0.333
          }
        }
      ],
      breaks: [
        {
          short: "a non-default temperature, top_p or top_k returns a 400 error",
          text: "Claude 4.7 and later models return a 400 error when temperature, top_p or top_k is set to a non-default value. Anthropic's Python SDK v1.0 and later removes these parameters, so passing them raises a TypeError. Omit them and guide the model with the prompt.",
          source: "https://platform.claude.com/docs/en/about-claude/model-deprecations"
        },
        {
          short: "a newer tokenizer counts about 30% more tokens for the same text",
          text: "Claude 4.7 and later models use a newer tokenizer that produces approximately 30% more tokens for the same text, so the same prompt can cost more than the per-token ratio suggests. Measure on your own prompts.",
          source: "https://platform.claude.com/docs/en/about-claude/pricing"
        }
      ],
      notes: [
        "Dates apply to the Claude API, Claude Platform on AWS and Microsoft Foundry. Amazon Bedrock and Google Cloud set their own retirement schedules."
      ],
      seen: "2026-10-08",
      provider: "anthropic",
      id: "claude-opus-4-1-20250805",
      shutdown: "2026-08-05",
      source: "https://platform.claude.com/docs/en/about-claude/model-deprecations",
      pricingSource: "https://platform.claude.com/docs/en/about-claude/pricing",
      pricingSeen: "2026-10-08",
      aliasSource: "https://platform.claude.com/docs/en/about-claude/models/model-ids-and-versions"
    },
    {
      aliases: [],
      kind: "model",
      announced: "2026-05-08",
      shutdownIsEarliest: false,
      replacements: ["gpt-5.6-sol"],
      prices: [],
      breaks: [],
      notes: [],
      seen: "2026-10-08",
      provider: "openai",
      id: "gpt-5.2-chat-latest",
      shutdown: "2026-08-10",
      source: "https://developers.openai.com/api/docs/deprecations",
      priceNote: "Not listed on OpenAI's pricing page when checked on 8 October 2026, so no ratio is given."
    },
    {
      aliases: [],
      kind: "model",
      announced: "2026-05-08",
      shutdownIsEarliest: false,
      replacements: ["gpt-5.6-sol"],
      prices: [],
      breaks: [],
      notes: [],
      seen: "2026-10-08",
      provider: "openai",
      id: "gpt-5.3-chat-latest",
      shutdown: "2026-08-10",
      source: "https://developers.openai.com/api/docs/deprecations",
      priceNote: "Not listed on OpenAI's pricing page when checked on 8 October 2026, so no ratio is given."
    },
    {
      aliases: [],
      kind: "model",
      announced: "2025-09-26",
      shutdownIsEarliest: false,
      replacements: ["gpt-5.6-terra"],
      prices: [
        {
          replacement: "gpt-5.6-terra",
          retiring: {
            input: 0.4,
            output: 0.4
          },
          replacementPrice: {
            input: 2,
            output: 12
          },
          ratio: {
            input: 5,
            output: 30
          }
        }
      ],
      breaks: [],
      notes: [],
      seen: "2026-10-08",
      provider: "openai",
      id: "babbage-002",
      shutdown: "2026-09-28",
      source: "https://developers.openai.com/api/docs/deprecations",
      pricingSource: "https://developers.openai.com/api/docs/pricing",
      pricingSeen: "2026-10-08"
    },
    {
      aliases: [],
      kind: "model",
      announced: "2025-09-26",
      shutdownIsEarliest: false,
      replacements: ["gpt-5.6-terra"],
      prices: [
        {
          replacement: "gpt-5.6-terra",
          retiring: {
            input: 2,
            output: 2
          },
          replacementPrice: {
            input: 2,
            output: 12
          },
          ratio: {
            input: 1,
            output: 6
          }
        }
      ],
      breaks: [],
      notes: [],
      seen: "2026-10-08",
      provider: "openai",
      id: "davinci-002",
      shutdown: "2026-09-28",
      source: "https://developers.openai.com/api/docs/deprecations",
      pricingSource: "https://developers.openai.com/api/docs/pricing",
      pricingSeen: "2026-10-08"
    },
    {
      aliases: [],
      kind: "model",
      announced: "2025-09-26",
      shutdownIsEarliest: false,
      replacements: ["gpt-5.6-terra"],
      prices: [
        {
          replacement: "gpt-5.6-terra",
          retiring: {
            input: 1,
            output: 2
          },
          replacementPrice: {
            input: 2,
            output: 12
          },
          ratio: {
            input: 2,
            output: 6
          }
        }
      ],
      breaks: [],
      notes: [],
      seen: "2026-10-08",
      provider: "openai",
      id: "gpt-3.5-turbo-1106",
      shutdown: "2026-09-28",
      source: "https://developers.openai.com/api/docs/deprecations",
      pricingSource: "https://developers.openai.com/api/docs/pricing",
      pricingSeen: "2026-10-08"
    },
    {
      aliases: [],
      kind: "model",
      announced: "2025-09-26",
      shutdownIsEarliest: false,
      replacements: ["gpt-5.6-terra"],
      prices: [
        {
          replacement: "gpt-5.6-terra",
          retiring: {
            input: 1.5,
            output: 2
          },
          replacementPrice: {
            input: 2,
            output: 12
          },
          ratio: {
            input: 1.33,
            output: 6
          }
        }
      ],
      breaks: [],
      notes: [],
      seen: "2026-10-08",
      provider: "openai",
      id: "gpt-3.5-turbo-instruct",
      shutdown: "2026-09-28",
      source: "https://developers.openai.com/api/docs/deprecations",
      pricingSource: "https://developers.openai.com/api/docs/pricing",
      pricingSeen: "2026-10-08"
    },
    {
      aliases: [],
      kind: "model",
      announced: "2026-09-11",
      shutdownIsEarliest: false,
      replacements: [],
      prices: [],
      breaks: [],
      notes: [],
      seen: "2026-10-08",
      provider: "openai",
      id: "gpt-5.4-cyber",
      shutdown: "2026-10-01",
      source: "https://developers.openai.com/api/docs/deprecations",
      priceNote: "OpenAI names no specific replacement model, so no ratio is given.",
      replacementNote: "The most capable cyber model available to you."
    },
    {
      aliases: [],
      kind: "model",
      announced: null,
      shutdownIsEarliest: false,
      replacements: ["gemini-3.8-flash", "gemini-3.5-flash-lite", "gemini-3.1-flash-lite"],
      prices: [
        {
          replacement: "gemini-3.8-flash",
          retiring: {
            input: 0.3,
            output: 2.5
          },
          replacementPrice: {
            input: 0.75,
            output: 3.75
          },
          ratio: {
            input: 2.5,
            output: 1.5
          },
          until: "2026-12-31"
        },
        {
          replacement: "gemini-3.8-flash",
          retiring: {
            input: 0.3,
            output: 2.5
          },
          replacementPrice: {
            input: 1.5,
            output: 7.5
          },
          ratio: {
            input: 5,
            output: 3
          },
          from: "2027-01-01"
        },
        {
          replacement: "gemini-3.5-flash-lite",
          retiring: {
            input: 0.3,
            output: 2.5
          },
          replacementPrice: {
            input: 0.3,
            output: 2.5
          },
          ratio: {
            input: 1,
            output: 1
          }
        },
        {
          replacement: "gemini-3.1-flash-lite",
          retiring: {
            input: 0.3,
            output: 2.5
          },
          replacementPrice: {
            input: 0.25,
            output: 1.5
          },
          ratio: {
            input: 0.833,
            output: 0.6
          }
        }
      ],
      breaks: [
        {
          short: "temperature, top_p and top_k are deprecated and should be removed",
          text: "For Gemini 3.x models, temperature, top_p and top_k are deprecated: Google says to remove them from every request and to use a system instruction for determinism.",
          source: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/migrate"
        },
        {
          short: "thinking_budget gives way to thinking_level",
          text: "thinking_budget is deprecated on Gemini 3.x in favour of thinking_level.",
          source: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/migrate"
        },
        {
          short: "a function response that does not match its call returns an empty answer, not an error",
          text: "Every FunctionResponse must carry the id and name of its FunctionCall, exactly one per call. Google says the API does not yet return an error for a mismatch; the model returns an empty response with finish_reason STOP instead.",
          source: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/migrate"
        }
      ],
      notes: [
        "On the Gemini API (ai.google.dev) the same model ID had no shutdown date announced when checked on 8 October 2026; Google limits 2.5 access there to projects that used it before. This date is for Vertex AI, now Gemini Enterprise Agent Platform.",
        "Google says retirement dates on this page may be extended but will not be moved earlier."
      ],
      seen: "2026-10-08",
      provider: "vertex-ai",
      id: "gemini-2.5-flash",
      shutdown: "2026-10-20",
      source: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/model-versions",
      pricingSource: "https://cloud.google.com/gemini-enterprise-agent-platform/generative-ai/pricing",
      pricingSeen: "2026-10-08"
    },
    {
      aliases: [],
      kind: "model",
      announced: null,
      shutdownIsEarliest: false,
      replacements: ["gemini-3.8-flash", "gemini-3.1-flash-lite", "Gemma 4"],
      prices: [
        {
          replacement: "gemini-3.8-flash",
          retiring: {
            input: 0.1,
            output: 0.4
          },
          replacementPrice: {
            input: 0.75,
            output: 3.75
          },
          ratio: {
            input: 7.5,
            output: 9.38
          },
          until: "2026-12-31"
        },
        {
          replacement: "gemini-3.8-flash",
          retiring: {
            input: 0.1,
            output: 0.4
          },
          replacementPrice: {
            input: 1.5,
            output: 7.5
          },
          ratio: {
            input: 15,
            output: 18.8
          },
          from: "2027-01-01"
        },
        {
          replacement: "gemini-3.1-flash-lite",
          retiring: {
            input: 0.1,
            output: 0.4
          },
          replacementPrice: {
            input: 0.25,
            output: 1.5
          },
          ratio: {
            input: 2.5,
            output: 3.75
          }
        }
      ],
      breaks: [
        {
          short: "temperature, top_p and top_k are deprecated and should be removed",
          text: "For Gemini 3.x models, temperature, top_p and top_k are deprecated: Google says to remove them from every request and to use a system instruction for determinism.",
          source: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/migrate"
        },
        {
          short: "thinking_budget gives way to thinking_level",
          text: "thinking_budget is deprecated on Gemini 3.x in favour of thinking_level.",
          source: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/migrate"
        },
        {
          short: "a function response that does not match its call returns an empty answer, not an error",
          text: "Every FunctionResponse must carry the id and name of its FunctionCall, exactly one per call. Google says the API does not yet return an error for a mismatch; the model returns an empty response with finish_reason STOP instead.",
          source: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/migrate"
        }
      ],
      notes: [
        "On the Gemini API (ai.google.dev) the same model ID had no shutdown date announced when checked on 8 October 2026; Google limits 2.5 access there to projects that used it before. This date is for Vertex AI, now Gemini Enterprise Agent Platform.",
        "Google says retirement dates on this page may be extended but will not be moved earlier."
      ],
      seen: "2026-10-08",
      provider: "vertex-ai",
      id: "gemini-2.5-flash-lite",
      shutdown: "2026-10-20",
      source: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/model-versions",
      pricingSource: "https://cloud.google.com/gemini-enterprise-agent-platform/generative-ai/pricing",
      pricingSeen: "2026-10-08"
    },
    {
      aliases: [],
      kind: "model",
      announced: null,
      shutdownIsEarliest: false,
      replacements: ["gemini-3.8-flash", "gemini-3.5-flash"],
      prices: [
        {
          replacement: "gemini-3.8-flash",
          retiring: {
            input: 1.25,
            output: 10
          },
          replacementPrice: {
            input: 0.75,
            output: 3.75
          },
          ratio: {
            input: 0.6,
            output: 0.375
          },
          until: "2026-12-31"
        },
        {
          replacement: "gemini-3.8-flash",
          retiring: {
            input: 1.25,
            output: 10
          },
          replacementPrice: {
            input: 1.5,
            output: 7.5
          },
          ratio: {
            input: 1.2,
            output: 0.75
          },
          from: "2027-01-01"
        },
        {
          replacement: "gemini-3.5-flash",
          retiring: {
            input: 1.25,
            output: 10
          },
          replacementPrice: {
            input: 1.5,
            output: 9
          },
          ratio: {
            input: 1.2,
            output: 0.9
          }
        }
      ],
      breaks: [
        {
          short: "temperature, top_p and top_k are deprecated and should be removed",
          text: "For Gemini 3.x models, temperature, top_p and top_k are deprecated: Google says to remove them from every request and to use a system instruction for determinism.",
          source: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/migrate"
        },
        {
          short: "thinking_budget gives way to thinking_level",
          text: "thinking_budget is deprecated on Gemini 3.x in favour of thinking_level.",
          source: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/migrate"
        },
        {
          short: "a function response that does not match its call returns an empty answer, not an error",
          text: "Every FunctionResponse must carry the id and name of its FunctionCall, exactly one per call. Google says the API does not yet return an error for a mismatch; the model returns an empty response with finish_reason STOP instead.",
          source: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/migrate"
        }
      ],
      notes: [
        "On the Gemini API (ai.google.dev) the same model ID had no shutdown date announced when checked on 8 October 2026; Google limits 2.5 access there to projects that used it before. This date is for Vertex AI, now Gemini Enterprise Agent Platform.",
        "Google says retirement dates on this page may be extended but will not be moved earlier."
      ],
      seen: "2026-10-08",
      provider: "vertex-ai",
      id: "gemini-2.5-pro",
      shutdown: "2026-10-20",
      source: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/model-versions",
      pricingSource: "https://cloud.google.com/gemini-enterprise-agent-platform/generative-ai/pricing",
      pricingSeen: "2026-10-08"
    },
    {
      aliases: [],
      kind: "fine-tune",
      announced: "2026-04-22",
      shutdownIsEarliest: false,
      replacements: ["gpt-5.6-terra"],
      prices: [],
      breaks: [],
      notes: [],
      seen: "2026-10-08",
      provider: "openai",
      id: "ft-babbage-002",
      shutdown: "2026-10-23",
      source: "https://developers.openai.com/api/docs/deprecations",
      priceNote: "A fine-tune's replacement is a base model you would fine-tune again or prompt instead, so a per-token ratio would compare unlike things; none is given.",
      finetunePrefixes: ["ft:babbage-002:"]
    },
    {
      aliases: [],
      kind: "fine-tune",
      announced: "2026-04-22",
      shutdownIsEarliest: false,
      replacements: ["gpt-5.6-terra"],
      prices: [],
      breaks: [],
      notes: [],
      seen: "2026-10-08",
      provider: "openai",
      id: "ft-davinci-002",
      shutdown: "2026-10-23",
      source: "https://developers.openai.com/api/docs/deprecations",
      priceNote: "A fine-tune's replacement is a base model you would fine-tune again or prompt instead, so a per-token ratio would compare unlike things; none is given.",
      finetunePrefixes: ["ft:davinci-002:"]
    },
    {
      aliases: [],
      kind: "fine-tune",
      announced: "2026-04-22",
      shutdownIsEarliest: false,
      replacements: ["gpt-5.6-terra"],
      prices: [],
      breaks: [],
      notes: [],
      seen: "2026-10-08",
      provider: "openai",
      id: "ft-gpt-3.5-turbo",
      shutdown: "2026-10-23",
      source: "https://developers.openai.com/api/docs/deprecations",
      priceNote: "A fine-tune's replacement is a base model you would fine-tune again or prompt instead, so a per-token ratio would compare unlike things; none is given.",
      finetunePrefixes: ["ft:gpt-3.5-turbo:", "ft:gpt-3.5-turbo-"]
    },
    {
      aliases: [],
      kind: "fine-tune",
      announced: "2026-04-22",
      shutdownIsEarliest: false,
      replacements: ["gpt-5.6-sol"],
      prices: [],
      breaks: [],
      notes: [],
      seen: "2026-10-08",
      provider: "openai",
      id: "ft-gpt-4",
      shutdown: "2026-10-23",
      source: "https://developers.openai.com/api/docs/deprecations",
      priceNote: "A fine-tune's replacement is a base model you would fine-tune again or prompt instead, so a per-token ratio would compare unlike things; none is given.",
      finetunePrefixes: ["ft:gpt-4:", "ft:gpt-4-0613:"]
    },
    {
      aliases: [],
      kind: "fine-tune",
      announced: "2026-04-22",
      shutdownIsEarliest: false,
      replacements: ["gpt-5.6-luna"],
      prices: [],
      breaks: [],
      notes: [],
      seen: "2026-10-08",
      provider: "openai",
      id: "ft-gpt-4.1-nano-2025-04-14",
      shutdown: "2026-10-23",
      source: "https://developers.openai.com/api/docs/deprecations",
      priceNote: "A fine-tune's replacement is a base model you would fine-tune again or prompt instead, so a per-token ratio would compare unlike things; none is given.",
      finetunePrefixes: ["ft:gpt-4.1-nano-2025-04-14:"]
    },
    {
      aliases: [],
      kind: "fine-tune",
      announced: "2026-04-22",
      shutdownIsEarliest: false,
      replacements: ["gpt-5.6-terra"],
      prices: [],
      breaks: [],
      notes: [],
      seen: "2026-10-08",
      provider: "openai",
      id: "ft-o4-mini-2025-04-16",
      shutdown: "2026-10-23",
      source: "https://developers.openai.com/api/docs/deprecations",
      priceNote: "A fine-tune's replacement is a base model you would fine-tune again or prompt instead, so a per-token ratio would compare unlike things; none is given.",
      finetunePrefixes: ["ft:o4-mini-2025-04-16:"]
    },
    {
      aliases: ["gpt-3.5-turbo", "gpt-3.5-turbo-completions"],
      kind: "model",
      announced: "2026-04-22",
      shutdownIsEarliest: false,
      replacements: ["gpt-5.6-terra"],
      prices: [
        {
          replacement: "gpt-5.6-terra",
          retiring: {
            input: 0.5,
            output: 1.5
          },
          replacementPrice: {
            input: 2,
            output: 12
          },
          ratio: {
            input: 4,
            output: 8
          }
        }
      ],
      breaks: [],
      notes: [],
      seen: "2026-10-08",
      provider: "openai",
      id: "gpt-3.5-turbo-0125",
      shutdown: "2026-10-23",
      source: "https://developers.openai.com/api/docs/deprecations",
      pricingSource: "https://developers.openai.com/api/docs/pricing",
      pricingSeen: "2026-10-08"
    },
    {
      aliases: ["gpt-4", "gpt-4-0613-completions", "gpt-4-completions"],
      kind: "model",
      announced: "2026-04-22",
      shutdownIsEarliest: false,
      replacements: ["gpt-5.6-sol"],
      prices: [
        {
          replacement: "gpt-5.6-sol",
          retiring: {
            input: 30,
            output: 60
          },
          replacementPrice: {
            input: 4,
            output: 20
          },
          ratio: {
            input: 0.133,
            output: 0.333
          },
          note: "OpenAI lists gpt-5.6-sol's $4 / $20 as promotional pricing, available at least through 21 November 2026 (its model page, read 8 October 2026)."
        }
      ],
      breaks: [],
      notes: [],
      seen: "2026-10-08",
      provider: "openai",
      id: "gpt-4-0613",
      shutdown: "2026-10-23",
      source: "https://developers.openai.com/api/docs/deprecations",
      pricingSource: "https://developers.openai.com/api/docs/pricing",
      pricingSeen: "2026-10-08"
    },
    {
      aliases: [],
      kind: "model",
      announced: "2026-04-22",
      shutdownIsEarliest: false,
      replacements: ["gpt-5.6-sol"],
      prices: [],
      breaks: [],
      notes: [
        "OpenAI's page also lists gpt-4-1106-preview under the shutdown of 26 March 2026 (announced 26 September 2025); this page uses the later announcement of 22 April 2026, which gives 23 October 2026."
      ],
      seen: "2026-10-08",
      provider: "openai",
      id: "gpt-4-1106-preview",
      shutdown: "2026-10-23",
      source: "https://developers.openai.com/api/docs/deprecations",
      priceNote: "Not listed on OpenAI's pricing page when checked on 8 October 2026, so no ratio is given."
    },
    {
      aliases: ["gpt-4-turbo-2024-04-09", "gpt-4-turbo-completions"],
      kind: "model",
      announced: "2026-04-22",
      shutdownIsEarliest: false,
      replacements: ["gpt-5.6-sol"],
      prices: [
        {
          replacement: "gpt-5.6-sol",
          retiring: {
            input: 10,
            output: 30
          },
          replacementPrice: {
            input: 4,
            output: 20
          },
          ratio: {
            input: 0.4,
            output: 0.667
          },
          note: "OpenAI lists gpt-5.6-sol's $4 / $20 as promotional pricing, available at least through 21 November 2026 (its model page, read 8 October 2026)."
        }
      ],
      breaks: [],
      notes: [],
      seen: "2026-10-08",
      provider: "openai",
      id: "gpt-4-turbo",
      shutdown: "2026-10-23",
      source: "https://developers.openai.com/api/docs/deprecations",
      pricingSource: "https://developers.openai.com/api/docs/pricing",
      pricingSeen: "2026-10-08"
    },
    {
      aliases: ["gpt-4.1-nano-2025-04-14"],
      kind: "model",
      announced: "2026-04-22",
      shutdownIsEarliest: false,
      replacements: ["gpt-5.6-luna"],
      prices: [
        {
          replacement: "gpt-5.6-luna",
          retiring: {
            input: 0.1,
            output: 0.4
          },
          replacementPrice: {
            input: 0.2,
            output: 1.2
          },
          ratio: {
            input: 2,
            output: 3
          }
        }
      ],
      breaks: [],
      notes: [],
      seen: "2026-10-08",
      provider: "openai",
      id: "gpt-4.1-nano",
      shutdown: "2026-10-23",
      source: "https://developers.openai.com/api/docs/deprecations",
      pricingSource: "https://developers.openai.com/api/docs/pricing",
      pricingSeen: "2026-10-08"
    },
    {
      aliases: [],
      kind: "model",
      announced: "2026-04-22",
      shutdownIsEarliest: false,
      replacements: ["gpt-5.6-sol"],
      prices: [
        {
          replacement: "gpt-5.6-sol",
          retiring: {
            input: 5,
            output: 15
          },
          replacementPrice: {
            input: 4,
            output: 20
          },
          ratio: {
            input: 0.8,
            output: 1.33
          },
          note: "OpenAI lists gpt-5.6-sol's $4 / $20 as promotional pricing, available at least through 21 November 2026 (its model page, read 8 October 2026)."
        }
      ],
      breaks: [],
      notes: [],
      seen: "2026-10-08",
      provider: "openai",
      id: "gpt-4o-2024-05-13",
      shutdown: "2026-10-23",
      source: "https://developers.openai.com/api/docs/deprecations",
      pricingSource: "https://developers.openai.com/api/docs/pricing",
      pricingSeen: "2026-10-08"
    },
    {
      aliases: ["o1"],
      kind: "model",
      announced: "2026-04-22",
      shutdownIsEarliest: false,
      replacements: ["gpt-5.6-sol"],
      prices: [
        {
          replacement: "gpt-5.6-sol",
          retiring: {
            input: 15,
            output: 60
          },
          replacementPrice: {
            input: 4,
            output: 20
          },
          ratio: {
            input: 0.267,
            output: 0.333
          },
          note: "OpenAI lists gpt-5.6-sol's $4 / $20 as promotional pricing, available at least through 21 November 2026 (its model page, read 8 October 2026)."
        }
      ],
      breaks: [],
      notes: [],
      seen: "2026-10-08",
      provider: "openai",
      id: "o1-2024-12-17",
      shutdown: "2026-10-23",
      source: "https://developers.openai.com/api/docs/deprecations",
      pricingSource: "https://developers.openai.com/api/docs/pricing",
      pricingSeen: "2026-10-08"
    },
    {
      aliases: ["o1-pro"],
      kind: "model",
      announced: "2026-04-22",
      shutdownIsEarliest: false,
      replacements: ["gpt-5.6-sol"],
      prices: [],
      breaks: [
        {
          short: "the replacement needs reasoning.mode set to pro",
          text: "OpenAI's replacement is gpt-5.6-sol with reasoning.mode set to pro, not the default mode.",
          source: "https://developers.openai.com/api/docs/deprecations"
        }
      ],
      notes: [],
      seen: "2026-10-08",
      provider: "openai",
      id: "o1-pro-2025-03-19",
      shutdown: "2026-10-23",
      source: "https://developers.openai.com/api/docs/deprecations",
      priceNote: "No price for gpt-5.6-sol with reasoning.mode pro was listed on OpenAI's pricing page when checked on 8 October 2026, so no ratio is given.",
      replacementNote: "reasoning.mode: pro"
    },
    {
      aliases: ["o3-mini"],
      kind: "model",
      announced: "2026-04-22",
      shutdownIsEarliest: false,
      replacements: ["gpt-5.6-sol"],
      prices: [
        {
          replacement: "gpt-5.6-sol",
          retiring: {
            input: 1.1,
            output: 4.4
          },
          replacementPrice: {
            input: 4,
            output: 20
          },
          ratio: {
            input: 3.64,
            output: 4.55
          },
          note: "OpenAI lists gpt-5.6-sol's $4 / $20 as promotional pricing, available at least through 21 November 2026 (its model page, read 8 October 2026)."
        }
      ],
      breaks: [],
      notes: [],
      seen: "2026-10-08",
      provider: "openai",
      id: "o3-mini-2025-01-31",
      shutdown: "2026-10-23",
      source: "https://developers.openai.com/api/docs/deprecations",
      pricingSource: "https://developers.openai.com/api/docs/pricing",
      pricingSeen: "2026-10-08"
    },
    {
      aliases: ["o4-mini"],
      kind: "model",
      announced: "2026-04-22",
      shutdownIsEarliest: false,
      replacements: ["gpt-5.6-terra"],
      prices: [
        {
          replacement: "gpt-5.6-terra",
          retiring: {
            input: 1.1,
            output: 4.4
          },
          replacementPrice: {
            input: 2,
            output: 12
          },
          ratio: {
            input: 1.82,
            output: 2.73
          }
        }
      ],
      breaks: [],
      notes: [],
      seen: "2026-10-08",
      provider: "openai",
      id: "o4-mini-2025-04-16",
      shutdown: "2026-10-23",
      source: "https://developers.openai.com/api/docs/deprecations",
      pricingSource: "https://developers.openai.com/api/docs/pricing",
      pricingSeen: "2026-10-08"
    },
    {
      aliases: [],
      kind: "model",
      announced: null,
      shutdownIsEarliest: false,
      replacements: ["gemini-3.8-flash"],
      prices: [
        {
          replacement: "gemini-3.8-flash",
          retiring: {
            input: 0.75,
            output: 3.75
          },
          replacementPrice: {
            input: 0.75,
            output: 3.75
          },
          ratio: {
            input: 1,
            output: 1
          },
          note: "Agent Platform lists both models at $0.75 / $3.75 through 31 December 2026 and $1.50 / $7.50 from 1 January 2027."
        }
      ],
      breaks: [],
      notes: [
        "A short-term availability model: Google posts a fixed retirement date at least 45 days ahead.",
        "On the Gemini API (ai.google.dev) the same model ID had no shutdown date announced when checked on 8 October 2026."
      ],
      seen: "2026-10-08",
      provider: "vertex-ai",
      id: "gemini-3.6-flash",
      shutdown: "2026-11-19",
      source: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/model-versions",
      pricingSource: "https://cloud.google.com/gemini-enterprise-agent-platform/generative-ai/pricing",
      pricingSeen: "2026-10-08"
    },
    {
      aliases: ["claude-sonnet-4-5"],
      kind: "model",
      announced: "2026-09-30",
      shutdownIsEarliest: false,
      replacements: ["claude-sonnet-5-5"],
      prices: [
        {
          replacement: "claude-sonnet-5-5",
          retiring: {
            input: 3,
            output: 15
          },
          replacementPrice: {
            input: 2,
            output: 10
          },
          ratio: {
            input: 0.667,
            output: 0.667
          }
        }
      ],
      breaks: [
        {
          short: "a non-default temperature, top_p or top_k returns a 400 error",
          text: "Claude 4.7 and later models return a 400 error when temperature, top_p or top_k is set to a non-default value. Anthropic's Python SDK v1.0 and later removes these parameters, so passing them raises a TypeError. Omit them and guide the model with the prompt.",
          source: "https://platform.claude.com/docs/en/about-claude/model-deprecations"
        },
        {
          short: "a newer tokenizer counts about 30% more tokens for the same text",
          text: "Claude 4.7 and later models use a newer tokenizer that produces approximately 30% more tokens for the same text, so the same prompt can cost more than the per-token ratio suggests. Measure on your own prompts.",
          source: "https://platform.claude.com/docs/en/about-claude/pricing"
        }
      ],
      notes: [
        "Dates apply to the Claude API, Claude Platform on AWS and Microsoft Foundry. Amazon Bedrock and Google Cloud set their own retirement schedules."
      ],
      seen: "2026-10-08",
      provider: "anthropic",
      id: "claude-sonnet-4-5-20250929",
      shutdown: "2026-11-30",
      source: "https://platform.claude.com/docs/en/about-claude/model-deprecations",
      pricingSource: "https://platform.claude.com/docs/en/about-claude/pricing",
      pricingSeen: "2026-10-08",
      aliasSource: "https://platform.claude.com/docs/en/about-claude/models/model-ids-and-versions"
    },
    {
      aliases: ["gpt-5"],
      kind: "model",
      announced: "2026-06-11",
      shutdownIsEarliest: false,
      replacements: ["gpt-5.6-sol"],
      prices: [
        {
          replacement: "gpt-5.6-sol",
          retiring: {
            input: 1.25,
            output: 10
          },
          replacementPrice: {
            input: 4,
            output: 20
          },
          ratio: {
            input: 3.2,
            output: 2
          },
          note: "OpenAI lists gpt-5.6-sol's $4 / $20 as promotional pricing, available at least through 21 November 2026 (its model page, read 8 October 2026)."
        }
      ],
      breaks: [],
      notes: [],
      seen: "2026-10-08",
      provider: "openai",
      id: "gpt-5-2025-08-07",
      shutdown: "2026-12-11",
      source: "https://developers.openai.com/api/docs/deprecations",
      pricingSource: "https://developers.openai.com/api/docs/pricing",
      pricingSeen: "2026-10-08",
      aliasSource: "https://developers.openai.com/api/docs/models/gpt-5"
    },
    {
      aliases: ["gpt-5-mini"],
      kind: "model",
      announced: "2026-06-11",
      shutdownIsEarliest: false,
      replacements: ["gpt-5.6-terra"],
      prices: [
        {
          replacement: "gpt-5.6-terra",
          retiring: {
            input: 0.25,
            output: 2
          },
          replacementPrice: {
            input: 2,
            output: 12
          },
          ratio: {
            input: 8,
            output: 6
          }
        }
      ],
      breaks: [],
      notes: [],
      seen: "2026-10-08",
      provider: "openai",
      id: "gpt-5-mini-2025-08-07",
      shutdown: "2026-12-11",
      source: "https://developers.openai.com/api/docs/deprecations",
      pricingSource: "https://developers.openai.com/api/docs/pricing",
      pricingSeen: "2026-10-08",
      aliasSource: "https://developers.openai.com/api/docs/models/gpt-5-mini"
    },
    {
      aliases: ["gpt-5-nano"],
      kind: "model",
      announced: "2026-06-11",
      shutdownIsEarliest: false,
      replacements: ["gpt-5.6-luna"],
      prices: [
        {
          replacement: "gpt-5.6-luna",
          retiring: {
            input: 0.05,
            output: 0.4
          },
          replacementPrice: {
            input: 0.2,
            output: 1.2
          },
          ratio: {
            input: 4,
            output: 3
          }
        }
      ],
      breaks: [],
      notes: [],
      seen: "2026-10-08",
      provider: "openai",
      id: "gpt-5-nano-2025-08-07",
      shutdown: "2026-12-11",
      source: "https://developers.openai.com/api/docs/deprecations",
      pricingSource: "https://developers.openai.com/api/docs/pricing",
      pricingSeen: "2026-10-08",
      aliasSource: "https://developers.openai.com/api/docs/models/gpt-5-nano"
    },
    {
      aliases: ["gpt-5-pro"],
      kind: "model",
      announced: "2026-06-11",
      shutdownIsEarliest: false,
      replacements: ["gpt-5.6-sol"],
      prices: [],
      breaks: [
        {
          short: "the replacement needs reasoning.mode set to pro",
          text: "OpenAI's replacement is gpt-5.6-sol with reasoning.mode set to pro, not the default mode.",
          source: "https://developers.openai.com/api/docs/deprecations"
        }
      ],
      notes: [],
      seen: "2026-10-08",
      provider: "openai",
      id: "gpt-5-pro-2025-10-06",
      shutdown: "2026-12-11",
      source: "https://developers.openai.com/api/docs/deprecations",
      priceNote: "No price for gpt-5.6-sol with reasoning.mode pro was listed on OpenAI's pricing page when checked on 8 October 2026, so no ratio is given.",
      aliasSource: "https://developers.openai.com/api/docs/models/gpt-5-pro",
      replacementNote: "reasoning.mode: pro"
    },
    {
      aliases: ["o3"],
      kind: "model",
      announced: "2026-06-11",
      shutdownIsEarliest: false,
      replacements: ["gpt-5.6-sol"],
      prices: [
        {
          replacement: "gpt-5.6-sol",
          retiring: {
            input: 2,
            output: 8
          },
          replacementPrice: {
            input: 4,
            output: 20
          },
          ratio: {
            input: 2,
            output: 2.5
          },
          note: "OpenAI lists gpt-5.6-sol's $4 / $20 as promotional pricing, available at least through 21 November 2026 (its model page, read 8 October 2026)."
        }
      ],
      breaks: [],
      notes: [],
      seen: "2026-10-08",
      provider: "openai",
      id: "o3-2025-04-16",
      shutdown: "2026-12-11",
      source: "https://developers.openai.com/api/docs/deprecations",
      pricingSource: "https://developers.openai.com/api/docs/pricing",
      pricingSeen: "2026-10-08",
      aliasSource: "https://developers.openai.com/api/docs/models/o3"
    },
    {
      aliases: ["o3-pro"],
      kind: "model",
      announced: "2026-06-11",
      shutdownIsEarliest: false,
      replacements: ["gpt-5.6-sol"],
      prices: [],
      breaks: [
        {
          short: "the replacement needs reasoning.mode set to pro",
          text: "OpenAI's replacement is gpt-5.6-sol with reasoning.mode set to pro, not the default mode.",
          source: "https://developers.openai.com/api/docs/deprecations"
        }
      ],
      notes: [],
      seen: "2026-10-08",
      provider: "openai",
      id: "o3-pro-2025-06-10",
      shutdown: "2026-12-11",
      source: "https://developers.openai.com/api/docs/deprecations",
      priceNote: "No price for gpt-5.6-sol with reasoning.mode pro was listed on OpenAI's pricing page when checked on 8 October 2026, so no ratio is given.",
      aliasSource: "https://developers.openai.com/api/docs/models/o3-pro",
      replacementNote: "reasoning.mode: pro"
    },
    {
      aliases: [],
      kind: "model",
      announced: null,
      shutdownIsEarliest: false,
      replacements: ["gemini-3.8-flash"],
      prices: [
        {
          replacement: "gemini-3.8-flash",
          retiring: {
            input: 1.5,
            output: 7.5
          },
          replacementPrice: {
            input: 1.5,
            output: 7.5
          },
          ratio: {
            input: 1,
            output: 1
          },
          note: "Agent Platform lists both models at $0.75 / $3.75 through 31 December 2026 and $1.50 / $7.50 from 1 January 2027."
        }
      ],
      breaks: [],
      notes: [
        "A short-term availability model: Google posts a fixed retirement date at least 45 days ahead.",
        "On the Gemini API (ai.google.dev) the same model ID had no shutdown date announced when checked on 8 October 2026."
      ],
      seen: "2026-10-08",
      provider: "vertex-ai",
      id: "gemini-3.7-flash",
      shutdown: "2027-01-28",
      source: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/model-versions",
      pricingSource: "https://cloud.google.com/gemini-enterprise-agent-platform/generative-ai/pricing",
      pricingSeen: "2026-10-08"
    },
    {
      aliases: [],
      kind: "model",
      announced: "2026-10-01",
      shutdownIsEarliest: false,
      replacements: ["gpt-6-sol"],
      prices: [
        {
          replacement: "gpt-6-sol",
          retiring: {
            input: 1.25,
            output: 10
          },
          replacementPrice: {
            input: 2,
            output: 10
          },
          ratio: {
            input: 1.6,
            output: 1
          }
        }
      ],
      breaks: [],
      notes: [],
      seen: "2026-10-08",
      provider: "openai",
      id: "gpt-5.1",
      shutdown: "2027-04-01",
      source: "https://developers.openai.com/api/docs/deprecations",
      pricingSource: "https://developers.openai.com/api/docs/pricing",
      pricingSeen: "2026-10-08"
    },
    {
      aliases: [],
      kind: "model",
      announced: "2026-10-01",
      shutdownIsEarliest: false,
      replacements: ["gpt-6-sol"],
      prices: [
        {
          replacement: "gpt-6-sol",
          retiring: {
            input: 1.75,
            output: 14
          },
          replacementPrice: {
            input: 2,
            output: 10
          },
          ratio: {
            input: 1.14,
            output: 0.714
          }
        }
      ],
      breaks: [],
      notes: [],
      seen: "2026-10-08",
      provider: "openai",
      id: "gpt-5.3-codex",
      shutdown: "2027-04-01",
      source: "https://developers.openai.com/api/docs/deprecations",
      pricingSource: "https://developers.openai.com/api/docs/pricing",
      pricingSeen: "2026-10-08"
    },
    {
      aliases: [],
      kind: "model",
      announced: "2026-10-01",
      shutdownIsEarliest: false,
      replacements: ["gpt-6-luna"],
      prices: [
        {
          replacement: "gpt-6-luna",
          retiring: {
            input: 0.2,
            output: 1.25
          },
          replacementPrice: {
            input: 0.1,
            output: 0.5
          },
          ratio: {
            input: 0.5,
            output: 0.4
          }
        }
      ],
      breaks: [],
      notes: [],
      seen: "2026-10-08",
      provider: "openai",
      id: "gpt-5.4-nano",
      shutdown: "2027-04-01",
      source: "https://developers.openai.com/api/docs/deprecations",
      pricingSource: "https://developers.openai.com/api/docs/pricing",
      pricingSeen: "2026-10-08"
    },
    {
      aliases: [],
      kind: "model",
      announced: null,
      shutdownIsEarliest: true,
      replacements: ["gemini-3.5-flash-lite"],
      prices: [
        {
          replacement: "gemini-3.5-flash-lite",
          retiring: {
            input: 0.25,
            output: 1.5
          },
          replacementPrice: {
            input: 0.3,
            output: 2.5
          },
          ratio: {
            input: 1.2,
            output: 1.67
          }
        }
      ],
      breaks: [],
      notes: [
        "Google lists this as the earliest possible shutdown date and says it will give the exact date with advance notice."
      ],
      seen: "2026-10-08",
      provider: "gemini-api",
      id: "gemini-3.1-flash-lite",
      shutdown: "2027-05-07",
      source: "https://ai.google.dev/gemini-api/docs/deprecations",
      pricingSource: "https://ai.google.dev/gemini-api/docs/pricing",
      pricingSeen: "2026-10-08"
    }
  ]
};

// src/version.ts
import { readFileSync } from "fs";
var cached;
function version() {
  if (cached !== void 0) return cached;
  try {
    cached = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")).version;
  } catch {
    cached = "0.0.0";
  }
  return cached;
}

// src/data.ts
var DATA_URL = "https://agentwares-agentcheck.vercel.app/models/retirements.json";
var PAGES_URL = "https://agentwares-agentcheck.vercel.app/models";
var TIMEOUT_MS = 8e3;
var BUNDLED = retirements_default;
function isDataset(x) {
  if (!x || typeof x !== "object") return false;
  const d = x;
  return d.version === 1 && typeof d.updated === "string" && !!d.providers && Array.isArray(d.entries) && d.entries.every(
    (e) => typeof e?.id === "string" && typeof e.shutdown === "string" && Array.isArray(e.aliases) && Array.isArray(e.replacements) && Array.isArray(e.prices) && Array.isArray(e.breaks) && !!d.providers?.[e.provider]
  );
}
async function loadData(opts) {
  if (opts.offline) return { data: BUNDLED, source: "bundled", warnings: [] };
  const url = opts.url ?? DATA_URL;
  const doFetch = opts.fetch ?? fetch;
  let why;
  try {
    const res = await doFetch(url, {
      headers: { accept: "application/json", "user-agent": `model-migrate/${version()}` },
      signal: AbortSignal.timeout(TIMEOUT_MS)
    });
    if (res.ok) {
      const body2 = await res.json();
      if (isDataset(body2)) {
        if (body2.updated >= BUNDLED.updated) return { data: body2, source: "live", warnings: [] };
        return { data: BUNDLED, source: "bundled", warnings: [] };
      }
      why = `${url} answered with a document that is not retirement data (version 1)`;
    } else {
      why = `${url} answered HTTP ${res.status}`;
    }
  } catch (e) {
    why = `GET ${url} failed: ${e instanceof Error ? e.message : String(e)}`;
  }
  return {
    data: BUNDLED,
    source: "bundled",
    warnings: [
      {
        code: "DATA_FETCH_FAILED",
        cause: `${why}; using the data bundled with model-migrate ${version()} (checked ${BUNDLED.updated})`,
        fix: "retry for the latest dates, or pass --offline to use the bundled data without the request",
        retryable: true
      }
    ]
  };
}

// src/errors.ts
var CliError = class extends Error {
  code;
  cause;
  fix;
  retryable;
  /** 2 for a usage mistake, 1 for anything else */
  exitCode;
  constructor(p, exitCode = 1) {
    super(`${p.code}: ${p.cause}`);
    this.name = "CliError";
    this.code = p.code;
    this.cause = p.cause;
    this.fix = p.fix;
    this.retryable = p.retryable;
    this.exitCode = exitCode;
  }
  toJSON() {
    return { code: this.code, cause: this.cause, fix: this.fix, retryable: this.retryable };
  }
};
function usage(cause, fix) {
  return new CliError({ code: "BAD_ARGUMENTS", cause, fix, retryable: false }, 2);
}

// src/main.ts
import { stat as stat2 } from "fs/promises";
import path4 from "path";
import { fileURLToPath } from "url";
import { parseArgs as parseArgs2 } from "util";

// src/providers.ts
var KEY_ENV = {
  openai: ["OPENAI_API_KEY"],
  anthropic: ["ANTHROPIC_API_KEY"],
  gemini: ["GEMINI_API_KEY", "GOOGLE_API_KEY"]
};
var ENDPOINT = {
  openai: "https://api.openai.com/v1/chat/completions",
  anthropic: "https://api.anthropic.com/v1/messages",
  gemini: "https://generativelanguage.googleapis.com/v1beta/models"
};
function providerFor(model) {
  const m = model.toLowerCase().replace(/^(openai|anthropic|gemini|models)\//, "");
  if (/^(gpt-|o\d|chatgpt-|codex-|ft:|davinci|babbage)/.test(m)) return "openai";
  if (m.startsWith("claude-")) return "anthropic";
  if (m.startsWith("gemini-")) return "gemini";
  return void 0;
}
function keyFor(provider, env) {
  for (const name of KEY_ENV[provider]) {
    const v = env[name];
    if (v && v.trim()) return v.trim();
  }
  throw new CliError({
    code: "KEY_MISSING",
    cause: `no ${KEY_ENV[provider].join(" or ")} in the environment`,
    fix: `export ${KEY_ENV[provider][0]}=<your own key>; model-migrate sends it only to ${new URL(ENDPOINT[provider]).host}`,
    retryable: false
  });
}
function hasKey(provider, env) {
  return KEY_ENV[provider].some((n) => !!env[n]?.trim());
}
var REFUSAL_TEXT = /^\s*(i('| a)m sorry,? but i (can('|no)t|won't|am unable to)|i can('|no)t (help|assist) with|i('| a)m (not able|unable) to (help|assist) with)/i;
function refusedText(text) {
  return REFUSAL_TEXT.test(text);
}
function parseArgs(raw) {
  if (typeof raw !== "string") return raw ?? {};
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}
function body(req, provider) {
  if (provider === "openai") {
    return {
      model: req.model,
      messages: req.messages,
      max_completion_tokens: req.maxTokens,
      ...req.tools?.length ? {
        tools: req.tools.map((t) => ({
          type: "function",
          function: {
            name: t.name,
            description: t.description ?? "",
            parameters: t.parameters ?? { type: "object", properties: {} }
          }
        }))
      } : {}
    };
  }
  if (provider === "anthropic") {
    const system2 = req.messages.filter((m) => m.role === "system").map((m) => m.content).join("\n\n");
    return {
      model: req.model,
      max_tokens: req.maxTokens,
      ...system2 ? { system: system2 } : {},
      messages: req.messages.filter((m) => m.role !== "system").map((m) => ({ role: m.role, content: m.content })),
      ...req.tools?.length ? {
        tools: req.tools.map((t) => ({
          name: t.name,
          description: t.description ?? "",
          input_schema: t.parameters ?? { type: "object", properties: {} }
        }))
      } : {}
    };
  }
  const system = req.messages.filter((m) => m.role === "system").map((m) => m.content).join("\n\n");
  return {
    ...system ? { systemInstruction: { parts: [{ text: system }] } } : {},
    contents: req.messages.filter((m) => m.role !== "system").map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    })),
    generationConfig: { maxOutputTokens: req.maxTokens },
    ...req.tools?.length ? {
      tools: [
        {
          functionDeclarations: req.tools.map((t) => ({
            name: t.name,
            description: t.description ?? "",
            parameters: t.parameters ?? { type: "object", properties: {} }
          }))
        }
      ]
    } : {}
  };
}
var obj = (v) => v && typeof v === "object" && !Array.isArray(v) ? v : {};
var arr = (v) => Array.isArray(v) ? v.map(obj) : [];
var num = (v) => typeof v === "number" ? v : Number(v ?? 0) || 0;
var s = (v) => typeof v === "string" ? v : v == null ? "" : String(v);
function parseReply(provider, json) {
  const j = obj(json);
  if (provider === "openai") {
    const choice = arr(j["choices"])[0] ?? {};
    const msg = obj(choice["message"]);
    const text2 = s(msg["content"]);
    const usage2 = obj(j["usage"]);
    const details = obj(usage2["completion_tokens_details"]);
    return {
      text: text2,
      tool_calls: arr(msg["tool_calls"]).map((c) => {
        const fn = obj(c["function"]);
        return { name: s(fn["name"]), args: parseArgs(fn["arguments"]) };
      }),
      refused: !!msg["refusal"] || refusedText(text2),
      finish: s(choice["finish_reason"]),
      usage: {
        input_tokens: num(usage2["prompt_tokens"]),
        output_tokens: num(usage2["completion_tokens"]),
        ...details["reasoning_tokens"] !== void 0 ? { reasoning_tokens: num(details["reasoning_tokens"]) } : {}
      }
    };
  }
  if (provider === "anthropic") {
    const content = arr(j["content"]);
    const text2 = content.filter((b) => b["type"] === "text").map((b) => s(b["text"])).join("");
    const usage2 = obj(j["usage"]);
    const stop = s(j["stop_reason"]);
    return {
      text: text2,
      tool_calls: content.filter((b) => b["type"] === "tool_use").map((b) => ({ name: s(b["name"]), args: b["input"] ?? {} })),
      refused: stop === "refusal" || refusedText(text2),
      finish: stop,
      usage: {
        input_tokens: num(usage2["input_tokens"]),
        output_tokens: num(usage2["output_tokens"])
      }
    };
  }
  const cand = arr(j["candidates"])[0] ?? {};
  const parts = arr(obj(cand["content"])["parts"]);
  const text = parts.filter((p) => typeof p["text"] === "string" && !p["thought"]).map((p) => s(p["text"])).join("");
  const meta = obj(j["usageMetadata"]);
  const thoughts = num(meta["thoughtsTokenCount"]);
  const finish = s(cand["finishReason"]) || s(obj(j["promptFeedback"])["blockReason"]);
  return {
    text,
    tool_calls: parts.filter((p) => p["functionCall"]).map((p) => {
      const fc = obj(p["functionCall"]);
      return { name: s(fc["name"]), args: fc["args"] ?? {} };
    }),
    refused: /^(SAFETY|PROHIBITED_CONTENT|BLOCKLIST|SPII|RECITATION)$/.test(finish) || refusedText(text),
    finish,
    usage: {
      input_tokens: num(meta["promptTokenCount"]),
      output_tokens: num(meta["candidatesTokenCount"]) + thoughts,
      ...thoughts ? { reasoning_tokens: thoughts } : {}
    }
  };
}
async function call(provider, req, key, doFetch = fetch) {
  const model = req.model.replace(/^(openai|anthropic|gemini|models)\//, "");
  const url = provider === "gemini" ? `${ENDPOINT.gemini}/${encodeURIComponent(model)}:generateContent` : ENDPOINT[provider];
  const headers = { "content-type": "application/json" };
  if (provider === "openai") headers["authorization"] = `Bearer ${key}`;
  if (provider === "anthropic") {
    headers["x-api-key"] = key;
    headers["anthropic-version"] = "2023-06-01";
  }
  if (provider === "gemini") headers["x-goog-api-key"] = key;
  const res = await doFetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body({ ...req, model }, provider)),
    signal: AbortSignal.timeout(12e4)
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = void 0;
  }
  if (!res.ok) {
    const j = json;
    const message = j?.error?.message ?? text.slice(0, 200);
    const retryable = res.status === 429 || res.status >= 500;
    throw new CliError({
      code: res.status === 404 ? "MODEL_NOT_FOUND" : res.status === 401 || res.status === 403 ? "KEY_REJECTED" : "PROVIDER_ERROR",
      cause: `${provider} answered HTTP ${res.status} for ${model}: ${message}`,
      fix: res.status === 404 ? "check the model ID; a model past its shutdown date cannot be called" : res.status === 401 || res.status === 403 ? `check ${KEY_ENV[provider][0]}: the provider refused it` : retryable ? "retry later, or lower --concurrency" : "check the prompt file entry this error names",
      retryable
    });
  }
  return parseReply(provider, json);
}

// src/capture.ts
var DEFAULT_LIMIT = 100;
var MAX_LIMIT = 1e3;
function resolveProvider(model) {
  const p = providerFor(model);
  if (!p)
    throw new CliError({
      code: "UNKNOWN_PROVIDER",
      cause: `cannot tell which provider serves "${model}"`,
      fix: "use an OpenAI (gpt-\u2026, o\u2026), Anthropic (claude-\u2026) or Gemini API (gemini-\u2026) model ID",
      retryable: false
    });
  return p;
}
async function runModel(model, prompts, opts) {
  const provider = resolveProvider(model);
  const key = keyFor(provider, opts.env);
  const now = opts.now ?? (() => /* @__PURE__ */ new Date());
  const delay = opts.retryDelayMs ?? 2e3;
  const records = new Array(prompts.length);
  let next = 0;
  const worker = async () => {
    while (next < prompts.length) {
      const i = next++;
      const p = prompts[i];
      const request = {
        messages: p.messages,
        ...p.tools ? { tools: p.tools } : {},
        max_tokens: p.max_tokens
      };
      const started = Date.now();
      const base = { id: p.id, model, provider, at: now().toISOString(), request };
      const attempt = () => call(
        provider,
        { model, messages: p.messages, tools: p.tools, maxTokens: p.max_tokens },
        key,
        opts.fetch
      );
      let record;
      try {
        let result;
        try {
          result = await attempt();
        } catch (e) {
          if (!(e instanceof CliError) || !e.retryable) throw e;
          await new Promise((r) => setTimeout(r, delay));
          result = await attempt();
        }
        record = {
          ...base,
          ...p.expect ? { expect: p.expect } : {},
          result,
          latency_ms: Date.now() - started
        };
      } catch (e) {
        const error = e instanceof CliError ? e.toJSON() : {
          code: "CALL_FAILED",
          cause: e instanceof Error ? e.message : String(e),
          fix: "check the network and retry",
          retryable: true
        };
        if (error.code === "MODEL_NOT_FOUND" || error.code === "KEY_REJECTED") throw e;
        record = {
          ...base,
          ...p.expect ? { expect: p.expect } : {},
          error,
          latency_ms: Date.now() - started
        };
      }
      records[i] = record;
    }
  };
  const n = Math.max(1, Math.min(opts.concurrency ?? 2, 8));
  await Promise.all(Array.from({ length: Math.min(n, prompts.length) }, worker));
  return records;
}
function applyLimit(prompts, limit) {
  const cap = limit ?? DEFAULT_LIMIT;
  if (!Number.isInteger(cap) || cap < 1 || cap > MAX_LIMIT)
    throw new CliError(
      {
        code: "BAD_ARGUMENTS",
        cause: `--limit must be a whole number from 1 to ${MAX_LIMIT}`,
        fix: "e.g. --limit 50",
        retryable: false
      },
      2
    );
  return prompts.slice(0, cap);
}

// src/catalog.ts
var CATALOG_SEEN = "2026-10-08";
var FLASH_3X = [
  { input: 0.75, output: 3.75, until: "2026-12-31" },
  { input: 1.5, output: 7.5, from: "2027-01-01" }
];
var CATALOG = {
  // OpenAI
  "gpt-6-astra": [{ input: 10, output: 50 }],
  "gpt-6.1-sol": [{ input: 2, output: 10 }],
  "gpt-6-sol": [{ input: 2, output: 10 }],
  "gpt-6-luna": [{ input: 0.1, output: 0.5 }],
  "gpt-5.6-sol": [
    { input: 4, output: 20, note: "promotional, available at least through 21 Nov 2026" }
  ],
  "gpt-5.6-terra": [{ input: 2, output: 12 }],
  "gpt-5.6-luna": [{ input: 0.2, output: 1.2 }],
  // Anthropic
  "claude-fable-5-1": [{ input: 10, output: 50 }],
  "claude-opus-5-5": [{ input: 4, output: 20 }],
  "claude-sonnet-5-5": [{ input: 2, output: 10 }],
  "claude-haiku-5-5": [{ input: 0.1, output: 0.5, note: "prompts up to 100,000 tokens" }],
  "claude-opus-4-8": [{ input: 5, output: 25 }],
  "claude-sonnet-4-6": [{ input: 3, output: 15 }],
  "claude-haiku-4-5-20251001": [{ input: 1, output: 5 }],
  // Gemini API
  "gemini-3.8-flash": FLASH_3X,
  "gemini-3.7-flash": FLASH_3X,
  "gemini-3.6-flash": FLASH_3X,
  "gemini-3.5-flash": [{ input: 1.5, output: 9 }],
  "gemini-3.5-flash-lite": [{ input: 0.3, output: 2.5 }],
  "gemini-3.1-flash-lite": [{ input: 0.25, output: 1.5 }],
  "gemini-3.1-pro-preview": [{ input: 2, output: 12, note: "prompts up to 200,000 tokens" }]
};
var bare = (model) => model.replace(/^(openai|anthropic|gemini|models)\//, "");
function priceOf(model, day, data) {
  const m = bare(model);
  const periods = CATALOG[m];
  if (periods)
    return periods.find((p2) => (!p2.from || p2.from <= day) && (!p2.until || day <= p2.until));
  const e = data && findEntry(data, m);
  const p = e?.prices[0];
  return p ? { input: p.retiring.input, output: p.retiring.output } : void 0;
}
function findEntry(data, model) {
  const m = bare(model);
  const hits = data.entries.filter((e) => e.id === m || e.aliases.includes(m));
  return hits.find((e) => e.provider !== "vertex-ai") ?? hits[0];
}
function costPer1000(price, meanInput, meanOutput) {
  return 1e3 * (meanInput * price.input + meanOutput * price.output) / 1e6;
}
var current = (provider) => Object.keys(CATALOG).filter((m) => providerFor(m) === provider && !m.includes("preview"));
function defaultCandidates(retiring, data, day) {
  const entry = findEntry(data, retiring);
  const recommended = entry?.replacements.find((r) => providerFor(r));
  const out = [];
  if (!recommended) return out;
  out.push({ model: recommended, why: "recommended replacement" });
  const rp = priceOf(recommended, day, data);
  const provider = providerFor(recommended);
  if (rp) {
    const cheaper = current(provider).filter((m) => m !== recommended).map((m) => ({ m, p: priceOf(m, day) })).filter((x) => x.p.output < rp.output).sort((a, b) => b.p.output - a.p.output || b.p.input - a.p.input)[0];
    if (cheaper) out.push({ model: cheaper.m, why: "cheaper sibling" });
    const others = ["openai", "anthropic", "gemini"].filter((p) => p !== provider).flatMap(current).map((m) => ({ m, p: priceOf(m, day) })).sort(
      (a, b) => Math.abs(a.p.output - rp.output) - Math.abs(b.p.output - rp.output) || a.p.output - b.p.output
    )[0];
    if (others) out.push({ model: others.m, why: "another provider" });
  }
  return out;
}

// src/checks.ts
var SHORT_LABEL = 40;
var LENGTH_RANGE = [0.5, 2];
function normalize(text) {
  return text.toLowerCase().replace(/[\p{P}\p{S}]+/gu, " ").replace(/\s+/g, " ").trim();
}
function parseJsonLoose(text) {
  const t = text.trim();
  const fenced = /^```(?:json)?\s*\n([\s\S]*?)\n?```$/i.exec(t);
  const body2 = fenced ? fenced[1] : t;
  if (!/^[[{]/.test(body2.trim())) return { ok: false };
  try {
    return { ok: true, value: JSON.parse(body2) };
  } catch {
    return { ok: false };
  }
}
function typeOf(v) {
  if (v === null) return "null";
  if (Array.isArray(v)) return "array";
  if (typeof v === "number") return Number.isInteger(v) ? "integer" : "number";
  return typeof v;
}
function validateSchema(value, schema, at = "$") {
  const errors = [];
  const t = schema["type"];
  if (t !== void 0) {
    const types = Array.isArray(t) ? t : [t];
    const actual = typeOf(value);
    const ok = types.some((x) => x === actual || x === "number" && actual === "integer");
    if (!ok) return [`${at}: expected ${types.join(" or ")}, got ${actual}`];
  }
  if (Array.isArray(schema["enum"]) && !schema["enum"].some((e) => JSON.stringify(e) === JSON.stringify(value)))
    errors.push(`${at}: not one of the allowed values`);
  if ("const" in schema && JSON.stringify(schema["const"]) !== JSON.stringify(value))
    errors.push(`${at}: not the required value`);
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const o = value;
    const props = schema["properties"] ?? {};
    for (const r of schema["required"] ?? [])
      if (!(r in o)) errors.push(`${at}.${r}: missing`);
    for (const [k, v] of Object.entries(o)) {
      if (props[k]) errors.push(...validateSchema(v, props[k], `${at}.${k}`));
      else if (schema["additionalProperties"] === false) errors.push(`${at}.${k}: not allowed`);
    }
  }
  if (Array.isArray(value) && schema["items"] && typeof schema["items"] === "object")
    value.forEach(
      (v, i) => errors.push(...validateSchema(v, schema["items"], `${at}[${i}]`))
    );
  return errors;
}
function argKeys(args) {
  return args && typeof args === "object" && !Array.isArray(args) ? Object.keys(args).sort().join(",") : typeof args;
}
function checkPair(baseline, candidate) {
  const id = baseline.id;
  if (!baseline.result)
    return { id, pass: null, checks: [], error: "the retiring model's call failed" };
  if (!candidate?.result)
    return {
      id,
      pass: false,
      checks: [],
      error: candidate?.error ? `${candidate.error.code}: ${candidate.error.cause}` : "no answer"
    };
  const expect = baseline.expect ?? {};
  const b = baseline.result;
  const c = candidate.result;
  const checks = [];
  const baseJson = parseJsonLoose(b.text);
  const wantsJson = expect.json === true || !!expect.schema || baseJson.ok && b.text.trim() !== "";
  const isLabel = !wantsJson && b.tool_calls.length === 0 && b.text.trim().length > 0 && b.text.trim().length <= SHORT_LABEL;
  checks.push({
    name: "exact",
    pass: b.text.trim() === c.text.trim(),
    gating: expect.match === "exact"
  });
  checks.push({
    name: "normalized",
    pass: normalize(b.text) === normalize(c.text),
    gating: expect.match === "normalized" || expect.match === void 0 && isLabel
  });
  if (wantsJson) {
    const cj = parseJsonLoose(c.text);
    checks.push({
      name: "json",
      pass: cj.ok,
      gating: true,
      ...cj.ok ? {} : { detail: "not valid JSON" }
    });
    if (expect.schema) {
      const errs = cj.ok ? validateSchema(cj.value, expect.schema) : ["not JSON"];
      checks.push({
        name: "schema",
        pass: errs.length === 0,
        gating: true,
        ...errs.length ? { detail: errs.slice(0, 3).join("; ") } : {}
      });
    }
  }
  if (b.tool_calls.length || expect.tool) {
    const names = (x) => x.tool_calls.map((t) => t.name);
    let pass;
    let detail;
    if (expect.tool && !b.tool_calls.length) {
      pass = c.tool_calls[0]?.name === expect.tool;
      if (!pass) detail = `expected ${expect.tool}, got ${names(c).join(", ") || "no tool call"}`;
    } else {
      const sameNames = names(b).join(">") === names(c).join(">");
      const sameArgs = sameNames && b.tool_calls.every((t, i) => argKeys(t.args) === argKeys(c.tool_calls[i]?.args));
      pass = sameNames && sameArgs;
      if (!sameNames)
        detail = `${names(b).join(" > ")} became ${names(c).join(" > ") || "no tool call"}`;
      else if (!sameArgs) detail = "same tools, different argument names";
    }
    checks.push({ name: "tool_call", pass, gating: true, ...detail ? { detail } : {} });
  }
  checks.push({
    name: "refusal",
    pass: !(c.refused && !b.refused),
    gating: true,
    ...c.refused && !b.refused ? { detail: "refused where the retiring model answered" } : {}
  });
  const bl = b.text.trim().length;
  if (bl >= 20) {
    const ratio = c.text.trim().length / bl;
    const pass = ratio >= LENGTH_RANGE[0] && ratio <= LENGTH_RANGE[1];
    checks.push({
      name: "length",
      pass,
      gating: true,
      ...pass ? {} : { detail: `${ratio.toFixed(2)}\xD7 the retiring model's length` }
    });
  }
  return { id, pass: checks.filter((x) => x.gating).every((x) => x.pass), checks };
}

// src/store.ts
import { mkdir, readFile, readdir, writeFile } from "fs/promises";
import path from "path";

// src/install.ts
var ON_NPM = false;
var NAME = "model-migrate";
var REPO = `https://github.com/agentwares/${NAME}`;
var INSTALL = ON_NPM ? `npx ${NAME}` : `npx --allow-git=root github:agentwares/${NAME}`;
var RUN = ON_NPM ? `npx -y ${NAME}@latest` : `npx -y --allow-git=root github:agentwares/${NAME}`;

// src/store.ts
var STORE_DIR = ".model-migrate";
function fileFor(model) {
  return `${model.replace(/[^A-Za-z0-9._-]/g, "_")}.jsonl`;
}
async function writeCaptures(cwd, model, records, replayOf) {
  const root = path.join(cwd, STORE_DIR);
  await mkdir(root, { recursive: true });
  await writeFile(path.join(root, ".gitignore"), "*\n");
  const dir = replayOf ? path.join(root, "replays", fileFor(replayOf).slice(0, -6)) : root;
  await mkdir(dir, { recursive: true });
  const file = path.join(dir, fileFor(model));
  await writeFile(file, records.map((r) => JSON.stringify(r)).join("\n") + "\n");
  return path.relative(cwd, file).split(path.sep).join("/");
}
async function readCaptures(cwd, model) {
  const file = path.join(cwd, STORE_DIR, fileFor(model));
  let text;
  try {
    text = await readFile(file, "utf8");
  } catch {
    throw new CliError({
      code: "NO_CAPTURE",
      cause: `no capture for ${model} in ${STORE_DIR}/`,
      fix: `run \`${INSTALL} capture <prompts.jsonl> --model ${model}\` first, while the model still answers`,
      retryable: false
    });
  }
  return text.split("\n").filter((l) => l.trim()).map((l) => JSON.parse(l));
}
async function capturedModels(cwd) {
  try {
    const names = await readdir(path.join(cwd, STORE_DIR));
    return names.filter((n) => n.endsWith(".jsonl")).map((n) => n.slice(0, -".jsonl".length));
  } catch {
    return [];
  }
}

// src/compare.ts
var MAX_CANDIDATES = 4;
function meanTokens(records) {
  const ok = records.filter((r) => r.result);
  if (!ok.length) return null;
  const sum = (f) => ok.reduce((n, r) => n + f(r), 0) / ok.length;
  return {
    mean_input: Math.round(sum((r) => r.result.usage.input_tokens)),
    mean_output: Math.round(sum((r) => r.result.usage.output_tokens))
  };
}
function cost(price, t) {
  return price && t ? Math.round(costPer1000(price, t.mean_input, t.mean_output) * 100) / 100 : null;
}
function breaksFor(model, data) {
  const seen = /* @__PURE__ */ new Map();
  for (const e of data.entries)
    if (e.replacements.includes(model))
      for (const b of e.breaks) seen.set(b.text, { text: b.text, source: b.source });
  return [...seen.values()];
}
function promptsFrom(baseline) {
  return baseline.filter((r) => r.result).map((r) => ({
    id: r.id,
    messages: r.request.messages,
    ...r.request.tools ? { tools: r.request.tools } : {},
    ...r.expect ? { expect: r.expect } : {},
    max_tokens: r.request.max_tokens
  }));
}
function summarize(pairs) {
  const compared = pairs.filter((p) => p.pass !== null);
  const passed = compared.filter((p) => p.pass).length;
  const counts = /* @__PURE__ */ new Map();
  const examples = [];
  for (const p of compared) {
    if (p.pass) continue;
    if (p.error) {
      counts.set("call", (counts.get("call") ?? 0) + 1);
      if (examples.length < 3) examples.push({ id: p.id, detail: p.error });
      continue;
    }
    for (const c of p.checks.filter((x) => x.gating && !x.pass)) {
      counts.set(c.name, (counts.get(c.name) ?? 0) + 1);
      if (examples.length < 3)
        examples.push({ id: p.id, detail: `${c.name}: ${c.detail ?? "differs"}` });
    }
  }
  return {
    compared: compared.length,
    passed,
    pass_rate: compared.length ? Math.round(passed / compared.length * 1e3) / 10 : null,
    failures: [...counts.entries()].map(([check, count]) => ({ check, count })).sort((a, b) => b.count - a.count),
    examples
  };
}
async function compare(opts) {
  const baseline = await readCaptures(opts.cwd, opts.retiring);
  const prompts = applyLimit(promptsFrom(baseline), opts.limit);
  if (!prompts.length)
    throw new CliError({
      code: "NO_ANSWERS",
      cause: `the capture for ${opts.retiring} has no successful answers to compare against`,
      fix: "run capture again; every call in it failed",
      retryable: true
    });
  const chosen = opts.candidates?.length ? opts.candidates.map((model) => ({ model, why: "your choice" })) : defaultCandidates(opts.retiring, opts.data, opts.today);
  if (!chosen.length)
    throw new CliError(
      {
        code: "NO_CANDIDATES",
        cause: `no replacement for ${opts.retiring} is in the retirement data`,
        fix: "name 1 to 4 models: --candidates gpt-5.6-terra,claude-sonnet-5-5",
        retryable: false
      },
      2
    );
  if (chosen.length > MAX_CANDIDATES)
    throw new CliError(
      {
        code: "BAD_ARGUMENTS",
        cause: `${chosen.length} candidates; compare runs at most ${MAX_CANDIDATES}`,
        fix: "name up to four models in --candidates",
        retryable: false
      },
      2
    );
  const entry = findEntry(opts.data, opts.retiring);
  const baseTokens = meanTokens(baseline);
  const basePrice = priceOf(opts.retiring, entry?.shutdown ?? opts.today, opts.data) ?? null;
  const byId = new Map(baseline.map((r) => [r.id, r]));
  const reports = [];
  for (const cand of chosen) {
    const provider = providerFor(cand.model) ?? null;
    const price = priceOf(cand.model, opts.today, opts.data) ?? null;
    const base = {
      model: cand.model,
      provider,
      why: cand.why,
      breaks: breaksFor(cand.model, opts.data),
      price
    };
    const skip = (reason) => ({
      ...base,
      status: "skipped",
      skipped_reason: reason,
      compared: 0,
      passed: 0,
      pass_rate: null,
      failures: [],
      examples: [],
      tokens: null,
      cost_per_1000_calls: null
    });
    if (!provider) {
      reports.push(skip("not an OpenAI, Anthropic or Gemini API model ID"));
      continue;
    }
    if (!hasKey(provider, opts.run.env)) {
      reports.push(skip(`no ${KEY_ENV[provider].join(" or ")} in the environment`));
      continue;
    }
    const records = await runModel(cand.model, prompts, opts.run);
    const file = await writeCaptures(opts.cwd, cand.model, records, opts.retiring);
    const recById = new Map(records.map((r) => [r.id, r]));
    const pairs = prompts.map((p) => checkPair(byId.get(p.id), recById.get(p.id)));
    const tokens = meanTokens(records);
    reports.push({
      ...base,
      status: "ran",
      capture_file: file,
      ...summarize(pairs),
      tokens,
      cost_per_1000_calls: cost(price, tokens)
    });
  }
  return {
    retiring: {
      model: opts.retiring,
      prompts: baseline.length,
      answered: prompts.length,
      tokens: baseTokens,
      price: basePrice,
      cost_per_1000_calls: cost(basePrice, baseTokens),
      shutdown: entry?.shutdown ?? null,
      page_url: entry ? `${PAGES_URL}/${entry.provider}/${entry.id}?ref=model-migrate` : null
    },
    candidates: reports
  };
}

// src/export.ts
import { writeFile as writeFile2 } from "fs/promises";
import path2 from "path";
var AGENTCHECK_URL = "https://agentwares-agentcheck.vercel.app";
function toAgentcheck(records) {
  return {
    source: "agentcheck_record",
    traces: records.filter((r) => r.result).map((r) => ({
      name: `${r.model} \xB7 ${r.id}`.slice(0, 120),
      input: { messages: r.request.messages },
      // a tool-only answer still needs an output for agentcheck's import
      output: r.result.text || r.result.tool_calls.map((t) => `${t.name}()`).join(" "),
      toolCalls: r.result.tool_calls.map((t) => ({ name: t.name, args: t.args })),
      model: r.model
    }))
  };
}
async function exportAgentcheck(cwd, model, out) {
  const records = await readCaptures(cwd, model);
  const doc = toAgentcheck(records);
  if (!doc.traces.length)
    throw new CliError({
      code: "NO_ANSWERS",
      cause: `the capture for ${model} has no successful answers to export`,
      fix: "run capture again; every call in it failed",
      retryable: true
    });
  const file = out ?? path2.join(STORE_DIR, "agentcheck-traces.json");
  await writeFile2(path2.resolve(cwd, file), JSON.stringify(doc, null, 2) + "\n");
  return { file: file.split(path2.sep).join("/"), traces: doc.traces.length };
}
function uploadHint(file) {
  return [
    "To keep re-running these with agentcheck, import them on a target you monitor (your own key,",
    "free at /dashboard/keys); nothing has been sent:",
    "",
    `  curl -X POST ${AGENTCHECK_URL}/api/v1/targets/<target-id>/traces \\`,
    '    -H "authorization: Bearer $AGENTCHECK_API_KEY" -H "content-type: application/json" \\',
    `    --data @${file}`
  ].join("\n");
}

// src/prompts.ts
import { readFile as readFile2 } from "fs/promises";
var DEFAULT_MAX_TOKENS = 1024;
var bad = (line, cause, fix) => new CliError({
  code: "PROMPTS_INVALID",
  cause: `line ${line}: ${cause}`,
  fix,
  retryable: false
});
function parsePrompts(text) {
  const out = [];
  const ids = /* @__PURE__ */ new Set();
  text.split(/\r?\n/).forEach((raw, i) => {
    const line = i + 1;
    const t = raw.trim();
    if (!t || t.startsWith("//")) return;
    let o;
    try {
      o = JSON.parse(t);
    } catch {
      throw bad(line, "not valid JSON", "write one JSON object per line (JSONL)");
    }
    if (!o || typeof o !== "object" || Array.isArray(o))
      throw bad(line, "not a JSON object", "write one JSON object per line (JSONL)");
    let messages;
    if (typeof o["prompt"] === "string") messages = [{ role: "user", content: o["prompt"] }];
    else if (Array.isArray(o["messages"])) {
      messages = o["messages"].map((m, k) => {
        const mm = m;
        if (!mm || !["system", "user", "assistant"].includes(String(mm.role)) || typeof mm.content !== "string")
          throw bad(
            line,
            `messages[${k}] needs role system|user|assistant and string content`,
            'e.g. {"role": "user", "content": "\u2026"}'
          );
        return { role: mm.role, content: mm.content };
      });
    } else
      throw bad(line, "needs `messages` or `prompt`", 'add "prompt": "\u2026" or "messages": [...]');
    if (!messages.some((m) => m.role === "user"))
      throw bad(line, "has no user message", "add a message with role user");
    const id = typeof o["id"] === "string" && o["id"] ? o["id"] : `line-${line}`;
    if (ids.has(id)) throw bad(line, `id "${id}" is used twice`, "give each prompt its own id");
    ids.add(id);
    const tools = o["tools"];
    if (tools !== void 0 && !Array.isArray(tools))
      throw bad(line, "`tools` must be an array", 'e.g. [{"name": "lookup", "parameters": {\u2026}}]');
    for (const [k, tool] of (tools ?? []).entries())
      if (!tool || typeof tool.name !== "string")
        throw bad(line, `tools[${k}] has no name`, "give each tool a string name");
    const max = o["max_tokens"];
    out.push({
      id,
      messages,
      ...tools ? { tools } : {},
      ...o["expect"] && typeof o["expect"] === "object" ? { expect: o["expect"] } : {},
      max_tokens: typeof max === "number" && max > 0 ? Math.min(max, 32e3) : DEFAULT_MAX_TOKENS
    });
  });
  if (!out.length)
    throw new CliError({
      code: "PROMPTS_EMPTY",
      cause: "the prompt file has no prompts",
      fix: 'add one JSON object per line, e.g. {"prompt": "\u2026"}',
      retryable: false
    });
  return out;
}
async function readPrompts(file) {
  let text;
  try {
    text = await readFile2(file, "utf8");
  } catch {
    throw new CliError({
      code: "PROMPTS_NOT_FOUND",
      cause: `cannot read ${file}`,
      fix: `pass a JSONL file of your own prompts, e.g. \`${INSTALL} capture prompts.jsonl --model gpt-5-mini\``,
      retryable: false
    });
  }
  return parsePrompts(text);
}

// src/render.ts
var DAY_MS = 864e5;
var SHORT = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC"
});
function shortDate(iso) {
  return SHORT.format(/* @__PURE__ */ new Date(`${iso}T00:00:00Z`)).replace("Sept", "Sep");
}
function daysUntil(e, today) {
  return Math.round(
    (Date.parse(`${e.shutdown}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / DAY_MS
  );
}
function pageUrl(e) {
  return `${PAGES_URL}/${e.provider}/${e.id}?ref=model-migrate`;
}
function times(x) {
  const v = x >= 10 ? Math.round(x) : x >= 1 ? Math.round(x * 10) / 10 : Math.round(x * 100) / 100;
  return `${v}\xD7`;
}
function period(p) {
  if (p.until) return ` until ${shortDate(p.until)}`;
  if (p.from) return ` from ${shortDate(p.from)}`;
  return "";
}
function when(e, today) {
  const d = daysUntil(e, today);
  const earliest = e.shutdownIsEarliest ? " (earliest possible date)" : "";
  if (d > 0) return `${shortDate(e.shutdown)}, in ${d} day${d === 1 ? "" : "s"}${earliest}`;
  if (d === 0) return `${shortDate(e.shutdown)}, today${earliest}`;
  return `${shortDate(e.shutdown)}, ${-d} day${d === -1 ? "" : "s"} ago${earliest}: requests to it now fail`;
}
function place(l) {
  return l.envName ? `${l.file} (${l.envName})` : `${l.file}:${l.line}`;
}
function wrap(items, indent, width = 100) {
  const lines = [];
  let cur = "";
  for (const item of items) {
    const next = cur ? `${cur}, ${item}` : item;
    if (cur && indent.length + next.length > width) {
      lines.push(`${cur},`);
      cur = item;
    } else cur = next;
  }
  if (cur) lines.push(cur);
  return lines.join(`
${indent}`);
}
var PAD = "               ";
function findingText(f, data, today) {
  const e = f.entry;
  const p = data.providers[e.provider];
  const out = [];
  const named = f.names.join(", ");
  out.push(named === e.id ? `${e.id}  \xB7  ${p.platform}` : `${named} \u2192 ${e.id}  \xB7  ${p.platform}`);
  out.push(`  shutdown     ${when(e, today)}`);
  const repl = e.replacements.length ? e.replacements.join(" or ") + (e.replacementNote ? ` (${e.replacementNote})` : "") : e.replacementNote ?? "none named";
  out.push(`  replacement  ${repl}`);
  if (e.prices.length) {
    e.prices.forEach((pr, i) => {
      const label = i === 0 ? "  price        " : PAD;
      const promo = pr.note && /promotional/i.test(pr.note) ? ", at its promotional price" : "";
      out.push(
        `${label}${pr.replacement}: ${times(pr.ratio.input)} input, ${times(pr.ratio.output)} output per token${period(pr)}${promo}`
      );
    });
  } else if (e.kind === "fine-tune") {
    out.push("  price        no ratio: the replacement for a fine-tune is a base model");
  } else {
    out.push(`  price        no ratio: ${e.priceNote ?? "not listed"}`);
  }
  if (e.breaks.length) {
    e.breaks.forEach((b, i) => out.push(`${i === 0 ? "  breaks       " : PAD}${b.short}`));
    const sampling = [...new Set(f.locations.flatMap((l) => l.sampling ?? []))];
    const concerned = e.breaks.some((b) => /temperature|top_p/.test(b.text));
    if (concerned && sampling.length) {
      const files = [...new Set(f.locations.filter((l) => l.sampling).map((l) => l.file))];
      out.push(`${PAD}this code sets ${sampling.join(", ")} in ${files.join(", ")}`);
    }
  } else {
    out.push(`  breaks       none documented by ${p.name}`);
  }
  out.push(`  found in     ${wrap(f.locations.map(place), PAD)}`);
  out.push(`  details      ${pageUrl(e)}`);
  return out.join("\n");
}
function renderText(result, loaded, today, shownRoot) {
  const { data } = loaded;
  const head = `model-migrate ${version()} \xB7 scanned ${result.filesRead} file${result.filesRead === 1 ? "" : "s"} in ${shownRoot} \xB7 retirement data checked ${shortDate(data.updated)} (${loaded.source})`;
  const out = [head, ""];
  for (const w of loaded.warnings) out.push(`warning ${w.code}: ${w.cause}`, `  fix: ${w.fix}`, "");
  const n = result.findings.length;
  if (n === 0) {
    out.push(
      "No model ID in these files has an announced shutdown on the OpenAI API, Claude API, Gemini API",
      "or Vertex AI pages this data is built from (language models only).",
      "",
      `Every announced shutdown, by date: ${PAGES_URL}`
    );
    return out.join("\n") + "\n";
  }
  const shut = result.findings.filter((f) => f.entry.shutdown <= today).length;
  out.push(
    `${n} model${n === 1 ? "" : "s"} in this code ${n === 1 ? "has" : "have"} a shutdown date${shut ? ` (${shut} already shut down)` : ""}:`,
    ""
  );
  for (const f of result.findings) out.push(findingText(f, data, today), "");
  if (shut < n)
    out.push(
      "Record each retiring model's answers on your own prompts before its date: after it, nobody can."
    );
  out.push(
    `Dates and replacements come from each provider's own deprecation page; prices from its pricing page.`
  );
  return out.join("\n") + "\n";
}
function renderJson(result, loaded, today, shownRoot) {
  const { data } = loaded;
  return JSON.stringify(
    {
      tool: "model-migrate",
      version: version(),
      command: "scan",
      today,
      scanned: {
        root: shownRoot,
        files_read: result.filesRead,
        files_skipped: result.filesSkipped
      },
      data: { source: loaded.source, updated: data.updated, scope: data.scope },
      findings: result.findings.map((f) => {
        const e = f.entry;
        return {
          names: f.names,
          provider: e.provider,
          platform: data.providers[e.provider].platform,
          model_id: e.id,
          matched_as: f.matchedAs,
          status: e.shutdown <= today ? "shut_down" : "retiring",
          shutdown_date: e.shutdown,
          shutdown_is_earliest_possible: e.shutdownIsEarliest,
          days_until_shutdown: daysUntil(e, today),
          replacements: e.replacements,
          ...e.replacementNote ? { replacement_note: e.replacementNote } : {},
          price_ratios: e.prices.map((p) => ({
            replacement: p.replacement,
            input: p.ratio.input,
            output: p.ratio.output,
            ...p.from ? { from: p.from } : {},
            ...p.until ? { until: p.until } : {}
          })),
          ...e.priceNote ? { price_note: e.priceNote } : {},
          breaks: e.breaks.map((b) => ({ text: b.text, source: b.source })),
          source_url: e.source,
          page_url: pageUrl(e),
          locations: f.locations.map((l) => ({
            file: l.file,
            line: l.line,
            ...l.envName ? { env_name: l.envName } : {},
            ...l.sampling ? { sets: l.sampling } : {}
          }))
        };
      }),
      warnings: loaded.warnings
    },
    null,
    2
  ) + "\n";
}
function renderError(e, json) {
  if (json) return JSON.stringify({ error: e }, null, 2) + "\n";
  return `model-migrate: ${e.code}: ${e.cause}
  fix: ${e.fix}
`;
}

// src/render-runs.ts
var PROVIDER_NAME = { openai: "OpenAI", anthropic: "Anthropic", gemini: "Gemini API" };
var money = (x) => x === null ? "no list price" : `$${x < 10 ? x.toFixed(2) : Math.round(x).toLocaleString("en-US")}`;
var tok = (t) => t ? `${t.mean_input} in / ${t.mean_output} out` : "-";
function deadline(model, data, today) {
  const e = findEntry(data, model);
  if (!e) return null;
  const d = daysUntil(e, today);
  return d > 0 ? `${model} shuts down ${shortDate(e.shutdown)}, in ${d} day${d === 1 ? "" : "s"}.` : `${model} was due to shut down ${shortDate(e.shutdown)}.`;
}
function renderCapture(model, provider, records, file, data, today) {
  const ok = records.filter((r) => r.result).length;
  const failed = records.filter((r) => r.error);
  const out = [
    `model-migrate ${version()} \xB7 captured ${records.length} prompt${records.length === 1 ? "" : "s"} on ${model} (${PROVIDER_NAME[provider]}, your key)`,
    "",
    `  answered     ${ok} of ${records.length}${failed.length ? `; ${failed.length} failed` : ""}`,
    `  tokens       ${tok(meanTokens(records))} per call (mean, as ${PROVIDER_NAME[provider]} reported them)`,
    `  saved        ${file} (prompts and answers stay on this machine; ${STORE_DIR}/ has its own .gitignore)`
  ];
  for (const f of failed.slice(0, 3))
    out.push(`  failed       ${f.id}: ${f.error.code}: ${f.error.cause}`);
  out.push("");
  const when2 = deadline(model, data, today);
  if (when2) out.push(when2);
  out.push(`Next: ${INSTALL} compare --from ${model}`);
  return out.join("\n") + "\n";
}
function renderCompare(r, data, today) {
  const ran = r.candidates.filter((c) => c.status === "ran");
  const out = [
    `model-migrate ${version()} \xB7 ${r.retiring.answered} prompt${r.retiring.answered === 1 ? "" : "s"} captured on ${r.retiring.model}, replayed on ${ran.length} candidate${ran.length === 1 ? "" : "s"} (your keys)`,
    ""
  ];
  const rows = [
    { cells: ["model", "why", "pass rate", "cost / 1,000 calls", "tokens per call"] },
    {
      cells: [
        r.retiring.model,
        "retiring",
        "baseline",
        money(r.retiring.cost_per_1000_calls),
        tok(r.retiring.tokens)
      ]
    },
    ...r.candidates.map(
      (c) => c.status === "skipped" ? { cells: [c.model, c.why], skipped: `skipped: ${c.skipped_reason}` } : {
        cells: [
          c.model,
          c.why,
          c.pass_rate === null ? "-" : `${c.passed}/${c.compared} (${c.pass_rate}%)`,
          money(c.cost_per_1000_calls),
          tok(c.tokens)
        ]
      }
    )
  ];
  const widths = [0, 1, 2, 3, 4].map(
    (i) => Math.max(...rows.map((row) => (row.cells[i] ?? "").length))
  );
  for (const row of rows) {
    const cells = row.cells.map((cell, i) => cell.padEnd(widths[i]));
    out.push(`  ${[...cells, ...row.skipped ? [row.skipped] : []].join("  ")}`.trimEnd());
  }
  out.push("");
  for (const c of ran) {
    if (c.failures.length) {
      out.push(
        `${c.model}: ${c.compared - c.passed} did not pass (${c.failures.map((f) => `${f.check} ${f.count}`).join(", ")})`
      );
      for (const ex of c.examples) out.push(`  ${ex.id}: ${ex.detail}`);
    } else {
      out.push(`${c.model}: every prompt passed`);
    }
    for (const b of c.breaks) out.push(`  documented change: ${b.text}`);
    if (c.capture_file) out.push(`  answers saved to ${c.capture_file}`);
    out.push("");
  }
  out.push(
    `Pass = every check that applies holds against ${r.retiring.model}'s answer: JSON and schema, tool calls and`,
    "argument names, no new refusal, length within 0.5-2x, and the same label for short answers. No LLM judge.",
    `Cost = the mean tokens each provider reported for these prompts x its list price (read ${shortDate(CATALOG_SEEN)});`,
    "cached input and batch discounts are not counted."
  );
  const when2 = deadline(r.retiring.model, data, today);
  if (when2) out.push("", when2);
  const page = r.retiring.page_url ?? "https://agentwares-agentcheck.vercel.app/models?ref=model-migrate";
  out.push(
    `To re-run these on your own endpoint whenever a provider ships a model, with history: agentcheck, ${page}#agentcheck`
  );
  return out.join("\n") + "\n";
}

// src/scan.ts
import { opendir, readFile as readFile3, stat } from "fs/promises";
import path3 from "path";
var CODE_EXT = /* @__PURE__ */ new Set([
  ".js",
  ".mjs",
  ".cjs",
  ".jsx",
  ".ts",
  ".mts",
  ".cts",
  ".tsx",
  ".py",
  ".yaml",
  ".yml",
  ".json"
]);
var SKIP_DIRS = /* @__PURE__ */ new Set([
  "node_modules",
  ".git",
  ".hg",
  ".svn",
  "dist",
  "build",
  "out",
  ".next",
  ".nuxt",
  ".turbo",
  ".vercel",
  "coverage",
  ".venv",
  "venv",
  "env",
  "__pycache__",
  ".mypy_cache",
  ".pytest_cache",
  ".tox",
  "site-packages",
  "vendor",
  ".model-migrate"
]);
var SKIP_FILES = /* @__PURE__ */ new Set(["package-lock.json", "pnpm-lock.yaml", "npm-shrinkwrap.json"]);
var MAX_FILE_BYTES = 1e6;
var MAX_FILES = 5e4;
function isEnvFile(name) {
  return name === ".env" || name.startsWith(".env.");
}
function isScannable(name) {
  if (SKIP_FILES.has(name)) return false;
  return isEnvFile(name) || CODE_EXT.has(path3.extname(name).toLowerCase());
}
async function* walk(root) {
  const dir = await opendir(root);
  for await (const d of dir) {
    if (d.isSymbolicLink()) continue;
    const full = path3.join(root, d.name);
    if (d.isDirectory()) {
      if (!SKIP_DIRS.has(d.name)) yield* walk(full);
    } else if (d.isFile() && isScannable(d.name)) {
      yield full;
    }
  }
}
var escape = (s2) => s2.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
function makeMatcher(data) {
  const byName = /* @__PURE__ */ new Map();
  const add = (name, t) => byName.set(name, [...byName.get(name) ?? [], t]);
  for (const entry of data.entries) {
    if (entry.kind === "fine-tune") continue;
    add(entry.id, { entry, matchedAs: "id" });
    for (const a of entry.aliases) add(a, { entry, matchedAs: "alias" });
  }
  const names = [...byName.keys()].sort((a, b) => b.length - a.length);
  const re = new RegExp(
    `(?<![A-Za-z0-9_.@:-])(${names.map(escape).join("|")})(?![A-Za-z0-9_.@]|-[A-Za-z0-9])`,
    "g"
  );
  const finetunes = data.entries.flatMap(
    (entry) => (entry.finetunePrefixes ?? []).map((prefix) => ({ entry, prefix }))
  );
  return function matchLine(text) {
    const out = [];
    for (const m of text.matchAll(re)) {
      const name = m[1];
      if (!name.includes("-") && !plainlyAValue(text, m.index, name.length)) continue;
      out.push({ name, targets: byName.get(name) });
    }
    let at = text.indexOf("ft:");
    while (at >= 0) {
      const rest = text.slice(at);
      const hits = finetunes.filter((f) => rest.startsWith(f.prefix)).map((f) => ({ entry: f.entry, matchedAs: "fine-tune" }));
      if (hits.length) out.push({ name: rest.split(/[^A-Za-z0-9_.:-]/)[0], targets: hits });
      at = text.indexOf("ft:", at + 3);
    }
    return out;
  };
}
function plainlyAValue(text, index, length) {
  const before = text.slice(0, index).trimEnd();
  const prev = before.charAt(before.length - 1);
  const after = text.slice(index + length);
  const next = after.charAt(0);
  if (/["'`]/.test(prev)) return next === prev;
  const tail = after.trim();
  const lineEnds = tail === "" || tail.startsWith("#") || tail.startsWith("//");
  if (prev === "=" || prev === ":") return lineEnds;
  if (prev === "/") return /["'`]/.test(next) || lineEnds;
  return false;
}
var SAMPLING = /\b(temperature|top_p|top_k|topP|topK)\b/g;
function samplingIn(text) {
  return [...new Set([...text.matchAll(SAMPLING)].map((m) => m[1]))].sort();
}
function scanText(file, text, matchLine) {
  const env = isEnvFile(path3.basename(file));
  const out = [];
  const lines = text.split(/\r?\n/);
  let sampling;
  lines.forEach((raw, i) => {
    let value = raw;
    let envName;
    if (env) {
      const m = /^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_.-]*)\s*=\s*(.*)$/.exec(raw);
      if (!m || raw.trimStart().startsWith("#")) return;
      envName = m[1];
      value = m[2];
    }
    for (const hit of matchLine(value)) {
      sampling ??= env ? [] : samplingIn(text);
      for (const { entry, matchedAs } of hit.targets) {
        out.push({
          entry,
          name: hit.name,
          matchedAs,
          location: {
            file,
            line: i + 1,
            ...envName ? { envName } : {},
            ...sampling.length ? { sampling } : {}
          }
        });
      }
    }
  });
  return out;
}
function byUrgency(today) {
  return (a, b) => {
    const pa = a.entry.shutdown <= today;
    const pb = b.entry.shutdown <= today;
    if (pa !== pb) return pa ? -1 : 1;
    const d = pa ? b.entry.shutdown.localeCompare(a.entry.shutdown) : a.entry.shutdown.localeCompare(b.entry.shutdown);
    return d || a.entry.provider.localeCompare(b.entry.provider) || a.entry.id.localeCompare(b.entry.id);
  };
}
async function scan(root, data, today) {
  const matchLine = makeMatcher(data);
  const found = /* @__PURE__ */ new Map();
  let filesRead = 0;
  let filesSkipped = 0;
  for await (const file of walk(root)) {
    if (filesRead >= MAX_FILES) {
      filesSkipped += 1;
      continue;
    }
    let text;
    try {
      if ((await stat(file)).size > MAX_FILE_BYTES) {
        filesSkipped += 1;
        continue;
      }
      text = await readFile3(file, "utf8");
    } catch {
      filesSkipped += 1;
      continue;
    }
    filesRead += 1;
    const rel = path3.relative(root, file).split(path3.sep).join("/");
    for (const hit of scanText(rel, text, matchLine)) {
      const key = `${hit.entry.provider}/${hit.entry.id}`;
      const f = found.get(key) ?? {
        entry: hit.entry,
        names: [],
        matchedAs: hit.matchedAs,
        locations: []
      };
      if (!f.names.includes(hit.name)) f.names.push(hit.name);
      if (!f.locations.some((l) => l.file === rel && l.line === hit.location.line))
        f.locations.push(hit.location);
      found.set(key, f);
    }
  }
  const findings = [...found.values()].sort(byUrgency(today));
  for (const f of findings)
    f.locations.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line);
  return { root, filesRead, filesSkipped, findings };
}

// src/main.ts
var HELP = `model-migrate ${version()} \u2014 find the LLM models your code uses that are being retired, and test the replacements

Usage
  ${INSTALL} scan [dir]
      every model ID in dir (default: .) with a shutdown date: the date, the provider's
      replacement, the replacement's price ratio per token, the API changes it documents, a page
      per model
  ${INSTALL} scan [dir] --json
      the same, as JSON; --offline uses the bundled data, no request
  ${INSTALL} demo
      the same scan on a synthetic app shipped with this package, with the bundled data: reads
      nothing of yours and makes no request

  ${INSTALL} capture <prompts.jsonl> --model <id>
      run your prompts on the retiring model, on your own key, and keep its answers and token
      counts in .model-migrate/ (before its date: after it, nobody can). --limit N (default 100),
      --concurrency N
  ${INSTALL} compare [--from <id>] [--candidates a,b,c]
      replay them on the recommended replacement, a cheaper sibling and a model from another
      provider (or the 1-4 you name), on your keys: pass rate against the retiring model's answers
      (no LLM judge), measured cost per 1,000 calls, documented API changes
  ${INSTALL} export --agentcheck [--from <id>] [--out <file>]
      write the captures as traces agentcheck can import; sends nothing

Keys: OPENAI_API_KEY, ANTHROPIC_API_KEY, GEMINI_API_KEY (or GOOGLE_API_KEY), your own, read from
the environment and sent only to that provider. Prompt file: one JSON object per line,
{"prompt": "..."} or {"messages": [...], "tools": [...], "expect": {...}}; see the README.

scan's one request: GET ${DATA_URL}. Nothing about your files is sent.
Every announced shutdown, by date: ${PAGES_URL}
`;
var defaultDeps = {
  stdout: (s2) => process.stdout.write(s2),
  stderr: (s2) => process.stderr.write(s2)
};
async function main(argv, deps = defaultDeps) {
  const json = argv.includes("--json");
  try {
    return await run(argv, deps);
  } catch (e) {
    if (e instanceof CliError) {
      (json ? deps.stdout : deps.stderr)(renderError(e.toJSON(), json));
      return e.exitCode;
    }
    throw e;
  }
}
var COMMANDS = ["scan", "demo", "capture", "compare", "export"];
var PACKAGE_ROOT = fileURLToPath(new URL("..", import.meta.url));
function int(v, name) {
  if (v === void 0) return void 0;
  const n = Number(v);
  if (!Number.isInteger(n) || n < 1)
    throw usage(`${name} must be a whole number`, `e.g. ${name} 50`);
  return n;
}
async function run(argv, deps) {
  let parsed;
  try {
    parsed = parseArgs2({
      args: argv,
      allowPositionals: true,
      options: {
        json: { type: "boolean" },
        offline: { type: "boolean" },
        model: { type: "string" },
        from: { type: "string" },
        candidates: { type: "string" },
        limit: { type: "string" },
        concurrency: { type: "string" },
        agentcheck: { type: "boolean" },
        out: { type: "string" },
        help: { type: "boolean", short: "h" },
        version: { type: "boolean", short: "v" }
      }
    });
  } catch (e) {
    throw usage(
      e instanceof Error ? e.message : String(e),
      `run \`${INSTALL} --help\` for the options`
    );
  }
  const { values, positionals } = parsed;
  if (values.version) {
    deps.stdout(`${version()}
`);
    return 0;
  }
  const [command, ...rest] = positionals;
  if (values.help || command === void 0 || command === "help") {
    deps.stdout(HELP);
    return 0;
  }
  if (!COMMANDS.includes(command))
    throw usage(
      `unknown command "${command}"`,
      `the commands are ${COMMANDS.join(", ")}; run \`${INSTALL} --help\``
    );
  const cwd = deps.cwd ?? process.cwd();
  const env = deps.env ?? process.env;
  const today = (deps.now?.() ?? /* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const runOpts = {
    env,
    fetch: deps.fetch,
    now: deps.now,
    concurrency: int(values.concurrency, "--concurrency"),
    retryDelayMs: deps.retryDelayMs
  };
  if (command === "scan") return runScan(rest, values, deps, cwd, today);
  if (command === "demo") {
    if (rest.length > 0) throw usage("demo takes no arguments", `run \`${INSTALL} demo\``);
    if (!values.json) deps.stdout("Synthetic app, written for this demo: not anyone's code.\n\n");
    const demo = { json: values.json, offline: true };
    return runScan(["examples/demo-app"], demo, deps, PACKAGE_ROOT, today);
  }
  if (command === "capture") {
    if (rest.length !== 1)
      throw usage(
        "capture takes one prompt file",
        `run \`${INSTALL} capture prompts.jsonl --model <retiring model>\``
      );
    if (!values.model)
      throw usage("capture needs --model", "name the retiring model, e.g. --model gpt-5-mini");
    const model = values.model;
    const provider = resolveProvider(model);
    keyFor(provider, env);
    const prompts = applyLimit(
      await readPrompts(path4.resolve(cwd, rest[0])),
      int(values.limit, "--limit")
    );
    const loaded = await loadData({ offline: values.offline, fetch: deps.fetch });
    const records = await runModel(model, prompts, runOpts);
    const file2 = await writeCaptures(cwd, model, records);
    deps.stdout(
      values.json ? JSON.stringify(
        {
          tool: "model-migrate",
          version: version(),
          command: "capture",
          model,
          provider,
          file: file2,
          prompts: records.length,
          answered: records.filter((r) => r.result).length,
          errors: records.filter((r) => r.error).map((r) => ({ id: r.id, ...r.error }))
        },
        null,
        2
      ) + "\n" : renderCapture(model, provider, records, file2, loaded.data, today)
    );
    return 0;
  }
  const from = values.from ?? await onlyCapture(cwd);
  if (command === "compare") {
    const loaded = await loadData({ offline: values.offline, fetch: deps.fetch });
    const candidates = values.candidates?.split(",").map((s2) => s2.trim()).filter(Boolean);
    const report = await compare({
      cwd,
      retiring: from,
      candidates,
      data: loaded.data,
      today,
      limit: int(values.limit, "--limit"),
      run: runOpts
    });
    deps.stdout(
      values.json ? JSON.stringify(
        { tool: "model-migrate", version: version(), command: "compare", today, ...report },
        null,
        2
      ) + "\n" : renderCompare(report, loaded.data, today)
    );
    return 0;
  }
  if (!values.agentcheck)
    throw usage("export needs a format", "the format in this version is --agentcheck");
  const { file, traces } = await exportAgentcheck(cwd, from, values.out);
  deps.stdout(
    values.json ? JSON.stringify(
      {
        tool: "model-migrate",
        version: version(),
        command: "export",
        format: "agentcheck",
        file,
        traces
      },
      null,
      2
    ) + "\n" : `model-migrate ${version()} \xB7 wrote ${traces} trace${traces === 1 ? "" : "s"} of ${from} to ${file}

${uploadHint(file)}
`
  );
  return 0;
}
async function onlyCapture(cwd) {
  const models = await capturedModels(cwd);
  if (models.length === 1) return models[0];
  throw usage(
    models.length ? `${models.length} captures in .model-migrate/: ${models.join(", ")}` : "no capture in .model-migrate/ yet",
    models.length ? "name the retiring model: --from <model>" : `run \`${INSTALL} capture prompts.jsonl --model <retiring model>\` first`
  );
}
async function runScan(rest, values, deps, cwd, today) {
  if (rest.length > 1)
    throw usage(`scan takes one directory, got ${rest.length}`, `run \`${INSTALL} scan [dir]\``);
  const shownRoot = rest[0] ?? ".";
  const root = path4.resolve(cwd, shownRoot);
  let info;
  try {
    info = await stat2(root);
  } catch {
    throw new CliError({
      code: "DIR_NOT_FOUND",
      cause: `no file or directory at ${shownRoot}`,
      fix: `pass the directory that holds your code, e.g. \`${INSTALL} scan .\``,
      retryable: false
    });
  }
  if (!info.isDirectory())
    throw new CliError({
      code: "NOT_A_DIRECTORY",
      cause: `${shownRoot} is a file, not a directory`,
      fix: `pass the directory that holds it, e.g. \`${INSTALL} scan .\``,
      retryable: false
    });
  const loaded = await loadData({ offline: values.offline, fetch: deps.fetch });
  const result = await scan(root, loaded.data, today);
  deps.stdout((values.json ? renderJson : renderText)(result, loaded, today, shownRoot));
  return 0;
}

// src/index.ts
var SAMPLE_DATE = "2026-10-08";
export {
  BUNDLED,
  CliError,
  DATA_URL,
  PAGES_URL,
  SAMPLE_DATE,
  isDataset,
  loadData,
  main,
  makeMatcher,
  scan,
  scanText
};
//# sourceMappingURL=index.js.map