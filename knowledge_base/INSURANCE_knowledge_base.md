# INSURANCE-SPECIFIC KNOWLEDGE BASE
# Confido Health Clinic - Insurance Verification & Billing

## Purpose
This knowledge base provides detailed insurance information to support the AI agent in handling insurance verification queries, eligibility questions, and billing-related matters. This supplements the main clinic knowledge base.

---

## ACCEPTED INSURANCE PROVIDERS (Detailed List)

### Commercial/Private Insurance Plans

#### Blue Cross Blue Shield (BCBS)
- **All Plans Accepted**: PPO, HMO, EPO, POS
- **State Plans**: Illinois Blue Cross, Blue Cross Blue Shield of Texas, Florida Blue, all state BCBS affiliates
- **Federal Employee Program (FEP)**: Accepted
- **BlueCard Program**: Accepted (for out-of-state members)
- **Typical Copays**: $20-$50 primary care, $40-$75 specialist
- **Notes**: One of our most common insurance providers. Pre-authorization may be required for certain procedures.

#### Aetna
- **All Plans Accepted**: PPO, HMO, EPO, POS
- **Medicare Advantage Plans**: Accepted
- **Aetna International**: Not accepted (domestic plans only)
- **Typical Copays**: $25-$50 primary care
- **Notes**: Usually requires referral for specialist visits on HMO plans

#### UnitedHealthcare (UHC) / UMR
- **All Plans Accepted**: PPO, HMO, EPO, POS, Choice Plus
- **UMR (Self-funded employer plans)**: Accepted
- **Medicare Advantage**: United Medicare Advantage plans accepted
- **Oxford**: Accepted (UHC subsidiary)
- **Typical Copays**: $20-$50 primary care
- **Notes**: Very common provider. Online eligibility verification available.

#### Cigna
- **All Plans Accepted**: PPO, HMO, EPO, Open Access Plus
- **Cigna Healthspring**: Accepted (Medicare Advantage)
- **Typical Copays**: $25-$50 primary care
- **Notes**: Pre-authorization required for imaging and specialist procedures

#### Humana
- **Commercial Plans**: Accepted
- **Medicare Advantage**: Accepted (most plans)
- **Medicaid Plans**: Accepted
- **Typical Copays**: Varies widely by plan
- **Notes**: Verify specific plan, as some narrow network plans may not include us

#### Anthem Blue Cross
- **All Plans Accepted**: PPO, HMO, EPO
- **Anthem Medicare Advantage**: Accepted
- **State Coverage**: Multiple states (CA, CO, IN, KY, etc.)
- **Typical Copays**: $20-$50 primary care

#### Other Commercial Plans Accepted
- **Health Alliance**: All plans (local IL provider)
- **Coventry Health Care**: Most plans
- **Multiplan**: PPO networks
- **Beech Street**: PPO networks
- **PHCS**: PPO networks
- **First Health**: PPO networks

### Government Programs

#### Medicare
- **Medicare Part A**: Hospital insurance - not directly billed for office visits
- **Medicare Part B**: Medical insurance - WE ACCEPT AND BILL DIRECTLY
- **Medicare Part C (Medicare Advantage)**: Most plans accepted (verify specific plan)
- **Medicare Part D**: Prescription drug coverage - not billed by us
- **Medicare Supplement Plans (Medigap)**: All accepted as secondary insurance
- **Assignment**: We accept Medicare assignment (accept Medicare-approved amount)
- **Typical Patient Responsibility**: 20% coinsurance after Part B deductible ($240 in 2025)
- **Common Services Covered**: Annual wellness visits (100% covered), preventive screenings, chronic care management
- **Notes**: Must bring Medicare card to every visit. Some services may require deductible or coinsurance.

#### Medicaid (Illinois)
- **Illinois State Medicaid**: Accepted
- **Medicaid HMO Plans Accepted**:
  - **Meridian Health Plan**: Accepted
  - **CountyCare**: Accepted (Cook County)
  - **IlliniCare Health**: Accepted
  - **Blue Cross Community Health Plans (formerly Health Alliance)**: Accepted
  - **Molina Healthcare**: Accepted
- **Patient Responsibility**: Usually $0 copay for most services
- **Notes**: Must verify eligibility at each visit. Some plans require PCP designation.
- **Emergency Medicaid**: Accepted for qualifying emergency services only

#### Tricare
- **Tricare Prime**: Accepted (requires referral from PCM)
- **Tricare Select**: Accepted (no referral needed)
- **Tricare for Life**: Accepted (secondary to Medicare)
- **Active Duty**: Accepted
- **Retirees**: Accepted
- **Family Members**: Accepted
- **Notes**: May require pre-authorization for certain services. Verify eligibility.

#### Veterans Affairs (VA)
- **VA Healthcare**: We do not file claims to VA directly
- **Note**: Veterans may use private insurance if they have secondary coverage, or pay out of pocket with reimbursement through VA Community Care program

### NOT CURRENTLY IN-NETWORK

#### Kaiser Permanente
- **Kaiser HMO Plans**: NOT accepted (closed network)
- **Kaiser PPO Plans**: Accepted (out-of-network benefits)
- **Notes**: Kaiser members should contact Kaiser for in-network care

#### Workers' Compensation Insurance
- **Status**: Requires prior authorization and referral
- **Process**: Must be pre-approved; work-related injuries should go through employer's workers' comp process
- **Notes**: We can see work-related injuries if properly authorized and referred

#### Some Narrow Network HMO Plans
- Certain marketplace/exchange plans with very limited networks
- Must verify specific plan enrollment
- Patient can call member services to confirm our participation

---

## INSURANCE VERIFICATION PROCESS

### What We Can Verify at the Front Desk (AI Agent Level)

1. **General Plan Acceptance**: "Do you accept [Insurance Name]?"
   - Answer: Yes/No based on the list above
   - Example: "Yes, we do accept Blue Cross Blue Shield."

2. **Provider In-Network Status**: "Are you in-network with my insurance?"
   - Answer: Confirm if plan is in our accepted list
   - Example: "Yes, we're in-network with Aetna PPO plans."

3. **Basic Insurance Requirements**
   - Referral requirements for HMO plans
   - Whether pre-authorization might be needed
   - General information about Medicare/Medicaid acceptance

### What Requires Billing Department Transfer (Beyond AI Agent Scope)

Transfer to billing (555-123-4570) for:

1. **Specific Benefit Verification**
   - Exact copay amounts for patient's specific plan
   - Deductible amounts and how much has been met
   - Coinsurance percentages
   - Out-of-pocket maximum status
   
2. **Coverage for Specific Services**
   - Whether specific procedures are covered (e.g., "Is my vasectomy covered?")
   - Prior authorization requirements for specific services
   - Medical necessity determinations
   
3. **Claims and Billing Issues**
   - Outstanding claim status
   - Billing disputes or appeals
   - Payment plan setup
   - Itemized bills
   
4. **Pre-Authorization Coordination**
   - Initiating pre-auth for procedures
   - Pre-auth status checks
   
5. **Complex Multi-Insurance Scenarios**
   - Coordination of benefits (primary vs. secondary insurance)
   - Medicare + supplement insurance coordination
   - Determining which insurance is primary

### Information to Collect for Insurance Verification

**Minimum Required:**
1. Patient full name (as it appears on insurance card)
2. Patient date of birth
3. Insurance company/carrier name
4. Policy/Member/Subscriber ID number
5. Group number (if applicable)

**Additional Helpful Information:**
6. Policy holder name (if different from patient)
7. Policy holder date of birth
8. Reason for visit/service needed
9. Whether this is HMO, PPO, EPO, or POS plan (if patient knows)

**How to Collect Policy Numbers:**
- Collect character by character: "Is that A as in alpha, B as in bravo, C as in Charlie, 1, 2, 3...?"
- Repeat back: "I have ABC123456. Is that correct?"
- Note: Policy numbers can contain letters, numbers, and sometimes hyphens

---

## COMMON INSURANCE SCENARIOS & RESPONSES

### Scenario 1: "Do you take my insurance?"

**Patient says**: "Do you take Blue Cross?"

**AI Response**: 
"Yes, we do accept Blue Cross Blue Shield insurance, including PPO, HMO, and EPO plans. Would you like me to verify your specific coverage, or would you like to schedule an appointment?"

**If they want verification**: 
"I'd be happy to help verify your coverage. May I have your full name and member ID number? Then I can transfer you to our billing team who can check your specific plan details."

---

### Scenario 2: "What will my copay be?"

**Patient says**: "How much will my visit cost?" or "What's my copay?"

**AI Response**: 
"Copay amounts vary by specific plan. We accept your [insurance name], and our billing department can look up your exact copay and deductible information. Would you like me to transfer you to billing, or I can have them call you back after your appointment is scheduled?"

**Alternative**: 
"Typically, copays for primary care visits range from $20 to $50, but your specific plan determines the exact amount. Our billing team can verify your exact copay. Would you like me to transfer you?"

---

### Scenario 3: "Is this procedure covered?"

**Patient says**: "Will my insurance cover a skin biopsy?" or "Is allergy testing covered?"

**AI Response**: 
"Coverage for specific procedures depends on your individual plan and whether it's considered medically necessary. Our billing department can verify coverage for [procedure name] with your insurance. Would you like me to transfer you to billing so they can check that for you?"

---

### Scenario 4: "Do I need a referral?"

**Patient says**: "Do I need a referral to see you?"

**AI Response - For PPO/EPO**: 
"If you have a PPO or EPO plan, you typically don't need a referral. However, I recommend checking with your insurance to be certain."

**AI Response - For HMO**: 
"If you have an HMO plan, you may need a referral from your primary care physician. Have you already obtained a referral, or should I transfer you to our billing team to verify your plan requirements?"

**AI Response - Don't Know Plan Type**: 
"Referral requirements depend on your plan type. If you have an HMO plan, you'll likely need a referral. If you have a PPO or EPO, you typically don't. Would you like me to transfer you to billing to verify your specific plan requirements?"

---

### Scenario 5: "Do you take Medicare?"

**Patient says**: "Do you accept Medicare?"

**AI Response**: 
"Yes, we accept Medicare Parts A and B, as well as most Medicare Advantage plans. We accept Medicare assignment, which means we accept the Medicare-approved amount as payment in full. You'll be responsible for any deductible and the 20% coinsurance. Do you also have a Medicare supplement or secondary insurance?"

**Follow-up if they have supplement**: 
"Perfect. We'll bill both Medicare and your supplement insurance. Please bring both insurance cards to your appointment."

---

### Scenario 6: "Do you take Medicaid?"

**Patient says**: "Do you accept Medicaid?"

**AI Response**: 
"Yes, we accept Illinois Medicaid and several Medicaid HMO plans including Meridian, CountyCare, IlliniCare, and Blue Cross Community Health Plans. Which Medicaid plan do you have?"

**Follow-up**: 
"Great, we accept [plan name]. Please bring your Medicaid card to your appointment. There's typically no copay for Medicaid patients."

---

### Scenario 7: Insurance Card Not Available

**Patient says**: "I don't have my insurance card with me."

**AI Response**: 
"That's okay. I can still schedule your appointment. However, please bring your insurance card with you to the visit, or you can call us back with your insurance information once you have your card. Do you remember which insurance company you have?"

**If they don't know**: 
"No problem. When you find your card, you can call us at (555) 123-4567 or update your insurance information through our patient portal. For now, let's get your appointment scheduled."

---

### Scenario 8: Out-of-Network Insurance

**Patient says**: "I have [insurance we don't accept], can I still be seen?"

**AI Response**: 
"We're currently out-of-network with [insurance name]. However, you have a few options:

1. You may have out-of-network benefits that will cover a portion of the cost. Our billing team can verify this for you.
2. You can choose to pay out-of-pocket and submit the receipt to your insurance for potential reimbursement.
3. We offer self-pay discounted rates for patients without insurance coverage.

Would you like me to transfer you to our billing department to discuss these options?"

---

### Scenario 9: Pre-Authorization Questions

**Patient says**: "Do I need pre-authorization?" or "How do I get pre-authorized?"

**AI Response**: 
"Pre-authorization requirements depend on your specific insurance plan and the service you need. Once you see the provider, if any procedure or service requires pre-authorization, our billing team will handle that process with your insurance company. We'll contact you if we need any additional information from you."

**If patient has referral/pre-auth from another provider**: 
"Perfect. Please bring that pre-authorization or referral documentation with you to your appointment."

---

### Scenario 10: Workers' Compensation

**Patient says**: "This is a work-related injury. Do you take workers' comp?"

**AI Response**: 
"For work-related injuries covered by workers' compensation, we need prior authorization and a referral from your employer's workers' comp insurance carrier. Have you already reported this injury to your employer and received authorization for treatment?"

**If yes**: 
"Great. Please bring your workers' comp authorization and claim number to your appointment. Let me transfer you to our billing department to verify the authorization details."

**If no**: 
"You'll need to report the injury to your employer first. They'll provide you with information about their workers' comp insurance and authorize your treatment. Once you have that authorization, you can call us back to schedule."

---

### Scenario 11: Multiple Insurance Plans (COB - Coordination of Benefits)

**Patient says**: "I have two insurance plans. Which one do I use?"

**AI Response**: 
"When you have multiple insurance plans, one is considered 'primary' and the other 'secondary.' We'll bill both. Typically, the insurance through your own employer is primary, and a spouse's insurance is secondary. Our billing team can help determine which is primary. Please bring both insurance cards to your appointment, and we'll coordinate the billing for you."

---

### Scenario 12: Insurance Changed Recently

**Patient says**: "I just got new insurance. What do I need to do?"

**AI Response**: 
"Congratulations on your new coverage. Please bring your new insurance card to your next appointment, or you can update your insurance information by:
1. Calling us at (555) 123-4567
2. Updating it through our patient portal at confidohealth.com/portal
3. Stopping by our front desk

It's important to update this before your appointment to avoid any billing issues. Would you like to provide the new insurance information now, or will you update it later?"

---

### Scenario 13: High Deductible Health Plans (HDHP)

**Patient says**: "I have a high deductible plan. What does that mean for my visit?"

**AI Response**: 
"With a high deductible health plan, you're responsible for the full cost of services until you meet your deductible amount. After that, your insurance will cover services according to your plan benefits. Our billing team can verify your deductible amount and how much you've met so far. Would you like me to transfer you to billing?"

**Additional info**: 
"We do accept HSA and FSA cards as payment. You can also set up a payment plan if needed."

---

### Scenario 14: Marketplace/ACA Plans

**Patient says**: "I have insurance through the marketplace/healthcare.gov."

**AI Response**: 
"We accept most marketplace plans. Can you tell me which insurance company your plan is through? For example, Blue Cross, Aetna, or Ambetter?"

**Once they provide company name**: 
- If we accept: "Yes, we accept [company] marketplace plans. Let's get you scheduled."
- If unsure: "Let me transfer you to our billing department to verify that specific marketplace plan."

---

### Scenario 15: Uninsured/No Insurance

**Patient says**: "I don't have insurance. Can I still be seen?"

**AI Response**: 
"Absolutely. We welcome patients without insurance. We offer:
1. Self-pay discounted rates (lower than billed insurance rates)
2. Payment plans for balances over $500
3. Information about community assistance programs

Our billing department can discuss specific costs and payment options. Would you like me to transfer you to billing, or would you like to schedule your appointment first?"

---

## INSURANCE-RELATED EDGE CASES

### Edge Case 1: Insurance Expired/Terminated
**Situation**: Insurance shows as inactive or terminated

**Response**: 
"I'm showing that your insurance may be inactive. This could be due to:
- Recent job change
- Non-payment of premiums
- Plan renewal period

I recommend contacting your insurance company to verify your coverage status. You can still be seen as a self-pay patient, or we can reschedule once you verify your coverage. What would you prefer?"

---

### Edge Case 2: Patient Has Insurance But It's Not Accepted
**Situation**: Patient insists we accept their insurance, but we don't

**Response**: 
"I understand the confusion. While we do accept many [Insurance Company] plans, we may not be in-network with your specific plan or network. Our billing team can verify your exact plan enrollment. You do have options:
1. Verify out-of-network benefits (you may have partial coverage)
2. Self-pay with potential reimbursement from insurance
3. We can recommend in-network providers if you prefer

Would you like me to transfer you to billing to explore these options?"

---

### Edge Case 3: Insurance Requires PCP Designation
**Situation**: Patient's HMO requires them to choose a primary care physician

**Response**: 
"Your insurance plan requires you to designate a primary care physician. If you'd like one of our providers to be your PCP, you'll need to contact your insurance company to make that designation. Once that's done, you'll be able to schedule appointments with us. Would you like information on our providers to help you choose?"

---

### Edge Case 4: Patient Recently Turned 26 (Lost Parent's Coverage)
**Situation**: Young adult aged out of parent's insurance

**Response**: 
"I understand you recently turned 26 and lost coverage under your parent's plan. You have several options:
1. Enroll in your employer's insurance if available
2. Purchase marketplace insurance through healthcare.gov
3. COBRA continuation coverage (temporary)
4. Our self-pay rates if you're currently uninsured

We can still see you. Would you like to schedule as self-pay, or do you need time to secure new insurance first?"

---

### Edge Case 5: Snowbird/Seasonal Resident
**Situation**: Patient has out-of-state insurance but is temporarily in Illinois

**Response**: 
"Many insurance plans provide coverage when you're traveling or temporarily in another state. We accept most major insurance carriers. Our billing team can verify your out-of-state plan coverage. Many plans like Blue Cross have reciprocal agreements through BlueCard. Would you like me to transfer you to billing to verify?"

---

### Edge Case 6: Patient's Insurance Requires Pre-Authorization for Office Visit
**Situation**: Rare, but some plans require pre-auth even for office visits

**Response**: 
"Some insurance plans do require pre-authorization for office visits. If your plan requires this, you'll need to contact your insurance company or your primary care physician's office to obtain authorization before we can see you. Do you have an authorization number already?"

---

### Edge Case 7: Insurance Doesn't Cover Routine Physicals
**Situation**: Patient's plan has limited preventive coverage

**Response**: 
"While most insurance plans cover annual wellness visits at 100%, some limited plans may not. Our billing team can verify your preventive care coverage. If it's not covered, we can discuss:
1. Self-pay pricing for the physical
2. Splitting the visit into problem-focused visits that may be covered
3. Preventive screenings that are covered separately

Would you like me to transfer you to billing to check your coverage?"

---

### Edge Case 8: Foreign Insurance/Travel Insurance
**Situation**: Patient has insurance from another country

**Response**: 
"We typically don't bill international insurance directly. However, we can provide you with an itemized receipt (superbill) that you can submit to your insurance company for reimbursement. You would pay out-of-pocket at the time of service. Does that work for you?"

---

### Edge Case 9: Dental or Vision Insurance for Medical Issue
**Situation**: Patient wants to use dental or vision insurance for medical problem

**Response**: 
"For medical issues, we bill your medical insurance, not dental or vision insurance. For example, if you have an eye infection, that's billed to medical insurance. Routine vision exams would go to vision insurance, but those are typically done by optometrists. We can address medical eye concerns and bill your medical insurance. Does that make sense?"

---

### Edge Case 10: Insurance Lapsed Due to Non-Payment
**Situation**: Patient admits insurance lapsed

**Response**: 
"I understand. If you're able to catch up on payments and reinstate your insurance, we can reschedule your appointment. Otherwise, we can see you as a self-pay patient. We offer payment plans for balances over $500. What would work best for you?"

---

## PAYMENT INFORMATION

### Self-Pay (Uninsured) Pricing
- **New Patient Visit**: $150-$200
- **Established Patient Follow-up**: $100-$150
- **Annual Physical**: $200-$250
- **Urgent Visit**: $125-$175
- **Lab Work**: Varies by tests ordered
- **Procedures**: Varies by complexity

**Discounts**: 20% discount for payment at time of service

### Payment Methods Accepted
- Cash
- Check (with valid ID)
- Credit/Debit Cards: Visa, Mastercard, Discover, American Express
- HSA (Health Savings Account) cards
- FSA (Flexible Spending Account) cards
- Apple Pay / Google Pay (at front desk)

### Payment Plans
- Available for balances over $500
- No interest if paid within agreed timeframe
- Contact billing at (555) 123-4570 to arrange
- Minimum monthly payment based on balance

### Financial Assistance
- Sliding fee scale for low-income uninsured patients (based on income verification)
- Community health resources and assistance programs
- Prescription assistance programs
- Contact billing department for confidential discussion

---

## BILLING DEPARTMENT CONTACT INFORMATION

**Billing Department Phone**: (555) 123-4570  
**Hours**: Monday-Friday, 9:00 AM - 5:00 PM IST  
**Email**: billing@confidohealth.com (for non-urgent inquiries)  
**Fax**: (555) 123-4568

### When to Transfer to Billing:
1. Specific copay/deductible/coinsurance amounts
2. Coverage verification for specific procedures
3. Pre-authorization coordination
4. Claims status or billing disputes
5. Payment plan setup
6. Out-of-network benefit verification
7. Complex insurance scenarios (multiple plans, COB)
8. Financial assistance requests

---

## QUICK REFERENCE: INSURANCE VERIFICATION SCRIPT

**For AI Agent:**

1. **Collect patient name**: "May I have your full name?"

2. **Collect insurance provider**: "Which insurance company do you have?"

3. **Check acceptance**: 
   - If we accept: "Yes, we do accept [insurance name]."
   - If we don't accept: "We're currently out-of-network with [insurance name], but you may have out-of-network benefits."

4. **Collect member ID** (if patient wants verification): "Can you provide your member ID number? I'll take it character by character."

5. **Set expectations**: "We do accept your insurance. For specific copay amounts and coverage details, let me transfer you to our billing department who can access your exact plan information."

6. **Transfer or schedule**: 
   - "Would you like me to transfer you to billing now?"
   - OR "Would you like to schedule your appointment first and we can verify coverage details afterward?"

---

## INSURANCE ACRONYMS & TERMS

**Common Insurance Acronyms:**
- **HMO**: Health Maintenance Organization (requires PCP, referrals needed)
- **PPO**: Preferred Provider Organization (no PCP required, no referrals)
- **EPO**: Exclusive Provider Organization (no out-of-network coverage except emergency)
- **POS**: Point of Service (hybrid of HMO/PPO)
- **HDHP**: High Deductible Health Plan (lower premiums, higher deductible)
- **HSA**: Health Savings Account (tax-advantaged savings for medical expenses)
- **FSA**: Flexible Spending Account (use-it-or-lose-it medical expense account)
- **COB**: Coordination of Benefits (multiple insurance plans)
- **EOB**: Explanation of Benefits (statement from insurance, not a bill)
- **PCP**: Primary Care Physician
- **MA**: Medicare Advantage

**Insurance Terms:**
- **Premium**: Amount paid for insurance coverage (usually monthly)
- **Deductible**: Amount patient pays before insurance coverage begins
- **Copay**: Fixed amount paid per visit
- **Coinsurance**: Percentage of costs paid by patient (e.g., 20%)
- **Out-of-Pocket Maximum**: Maximum amount patient pays in a year
- **Pre-authorization**: Insurance approval required before certain services
- **In-Network**: Providers contracted with insurance (lower cost)
- **Out-of-Network**: Providers not contracted (higher cost or no coverage)
- **Covered Service**: Service paid for by insurance
- **Non-Covered Service**: Service not paid for by insurance
- **Medical Necessity**: Services deemed necessary by medical standards

---

## TIPS FOR AI AGENT HANDLING INSURANCE QUERIES

1. **Be Confident About What We Accept**: Clearly state yes or no for insurance acceptance
2. **Set Expectations Early**: Let patients know billing can provide specific financial details
3. **Don't Guess**: If unsure about coverage specifics, transfer to billing
4. **Collect Accurately**: Take member ID numbers character by character
5. **Empathize**: Understand insurance is confusing: "I know insurance can be complicated. Let me help you figure this out."
6. **Offer Options**: If insurance isn't accepted, provide alternatives (out-of-network benefits, self-pay)
7. **Document**: Make note of insurance provider for billing to follow up
8. **Educate Gently**: Briefly explain HMO vs PPO if patient is confused
9. **Privacy**: Remind patients not to share full Social Security numbers over the phone
10. **Follow-Up**: "Our billing team will call you within 24 hours if there are any issues with your insurance coverage."

---

**Last Updated**: November 16, 2025  
**For Questions**: Contact Billing Manager at (555) 123-4570
