# Knowledge Base

This folder contains markdown files that will be used as the knowledge base for the Confido Health AI agent.

## How to Add Knowledge Base Files

1. Create markdown (.md) files in this directory
2. Upload them to your ElevenLabs agent through the dashboard:
   - Go to your agent settings
   - Navigate to Knowledge Base
   - Upload the files
   - Set usage mode to "auto"

## Recommended Files to Create

### insurance_providers.md
List of accepted insurance providers with details:
- Provider names
- In-network status
- Special notes or requirements

### clinic_information.md
Complete clinic details:
- Full address and directions
- Business hours
- Parking information
- Accessibility features
- Contact numbers for different departments
- Patient portal URL

### edge_cases.md
Special handling scenarios:
- After-hours emergencies
- Mental health crisis protocols
- Minor patients (under 18)
- Family member authorization
- Urgent same-day appointments

### services_offered.md
Medical services available:
- Primary care services
- Specialty services
- Preventive care
- Diagnostic services

## Markdown Format Tips

- Use clear headings (# ## ###)
- Use bullet points for lists
- Keep information concise and scannable
- Include specific details (phone numbers, addresses, hours)
- Update regularly with new information

## Example Structure

```markdown
# Insurance Providers

## Accepted Insurance

### Blue Cross Blue Shield
- Status: In-network
- All plans accepted
- No pre-authorization required for standard visits

### Aetna
- Status: In-network
- Most plans accepted
- Some plans require referral

...
```

