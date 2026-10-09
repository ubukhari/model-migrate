# Synthetic example for model-migrate's tests and README. Not real code.
import anthropic

client = anthropic.Anthropic()


def triage(ticket: str) -> str:
    msg = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=512,
        temperature=0.2,
        messages=[{"role": "user", "content": ticket}],
    )
    return msg.content[0].text


# Bedrock sets its own dates for Claude, so this form is not matched.
BEDROCK_MODEL = "anthropic.claude-sonnet-4-5-20250929-v1:0"
