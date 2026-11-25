import type { ClassBand, Formula } from '@/lib/cgpa'

export interface Source {
  title: string
  url: string
  publisher: string
  date: string
  quote: string
  /** When the source text was read for this page. */
  accessed: string
}

export interface Scheme {
  id: string
  label: string
  appliesTo: string
  formula: Formula
  exampleCgpa: number
  source: Source
  supportingSources?: Source[]
  caveat: string
  equivalence?: {
    basis: 'cgpa' | 'percentage'
    bands: ClassBand[]
    note: string
  }
}

export interface Notice {
  title: string
  url: string
  text: string
}

export interface Faq {
  question: string
  answer: string
}

export interface Preset {
  slug: string
  name: string
  shortName: string
  kind: 'board' | 'university'
  region: string
  scale: number
  defaultScheme: string
  schemes: Scheme[]
  title: string
  description: string
  h1: string
  intro: string
  body: string[]
  faqs: Faq[]
  notices?: Notice[]
}

const CHECKED = '2026-11-25'

export const PRESETS: Preset[] = [
  {
    slug: 'cbse',
    name: 'Central Board of Secondary Education',
    shortName: 'CBSE',
    kind: 'board',
    region: 'India',
    scale: 10,
    defaultScheme: 'cce-2010',
    title: 'CBSE CGPA to Percentage Calculator',
    description:
      'Convert CBSE CGPA to an indicative percentage with the 9.5 multiplier from Circular No. 24 of 2010, or reverse it. The formula is cited and calculated in your browser.',
    h1: 'CBSE CGPA to percentage calculator',
    intro:
      'CBSE’s indicative conversion is percentage = 9.5 × CGPA. A CGPA of 8 is 76%, and a CGPA of 10 is 95%, not 100. Use it only when you actually have a CGPA from the Board’s grading scheme.',
    body: [
      'CBSE Circular No. 24, dated 28 May 2010, sets an indicative equivalence for the grading scheme introduced for Classes IX and X: subject-wise indicative percentage of marks = 9.5 × the grade point of the subject, and overall indicative percentage of marks = 9.5 × CGPA. The CGPA on the statement of subject-wise performance excludes the additional sixth subject.',
      'The 9.5 factor follows the grade bands of that scheme. The top band, A1, is 91–100 marks and grade point 10, so a perfect CGPA lines up with 95%, not with a flat multiply-by-10 conversion. Multiplying by 10 instead will overstate the indicative percentage.',
      'This is not a rule for turning today’s Class X or XII marks into a percentage. CBSE’s notice of 30 November 2023 says the Board does not calculate, declare, or inform a percentage of marks, and that an admitting institution or employer may calculate one if it needs it. If your marksheet already shows marks, use marks obtained divided by maximum marks.',
      'A university CGPA is a different number. VTU, AKTU, Anna University, Mumbai University and the other presets on this site publish their own formulas. Do not run a college CGPA through the CBSE 9.5 rule.',
    ],
    notices: [
      {
        title: 'CBSE notice, 30 November 2023: calculation of percentage of Class X and XII',
        url: 'https://www.cbse.gov.in/cbsenew/documents/Calculation_Percentage_Class_X_XII_30112023.pdf',
        text: 'The Board does not calculate, declare, or inform a percentage of marks. An admitting institution or employer may calculate one if it needs it.',
      },
    ],
    schemes: [
      {
        id: 'cce-2010',
        label: 'Indicative equivalence, Circular No. 24 of 2010',
        appliesTo: 'CBSE grading scheme described in the 28 May 2010 circular',
        formula: { kind: 'multiply', factor: 9.5, rounding: 'none' },
        exampleCgpa: 8,
        caveat:
          'The circular calls the result indicative. CBSE’s 30 November 2023 notice says the Board itself does not declare a percentage for Class X and XII.',
        source: {
          title: 'CBSE Circular No. 24 (28 May 2010)',
          url: 'https://www.cbse.gov.in/circulars/cir24-2010.pdf',
          publisher: 'Central Board of Secondary Education',
          date: '2010-05-28',
          quote:
            'Overall indicative percentage of marks = 9.5 × CGPA. Subject wise indicative percentage of marks = 9.5 × GP of the subject.',
          accessed: CHECKED,
        },
      },
    ],
    faqs: [
      {
        question: 'How do I convert CBSE CGPA to percentage?',
        answer:
          'Multiply the CGPA by 9.5. That is the overall indicative percentage in CBSE Circular No. 24 of 28 May 2010. A CGPA of 9.2 is 87.4%.',
      },
      {
        question: 'Why does CBSE use 9.5 and not 10?',
        answer:
          'The 2010 circular fixes the indicative percentage at 9.5 times the grade point. On that scheme the top grade band starts at 91 marks, so a CGPA of 10 corresponds to 95%, not 100%.',
      },
      {
        question: 'How do I convert a CBSE percentage back to CGPA?',
        answer:
          'Divide the indicative percentage by 9.5. 76% ÷ 9.5 is a CGPA of 8. This reverses the circular. It does not create a CGPA from a marks-based marksheet.',
      },
      {
        question: 'Does CBSE still declare a percentage?',
        answer:
          'The × 9.5 rule belongs to the grading scheme in the 2010 circular. The Board’s notice of 30 November 2023 says CBSE does not calculate or declare a percentage for Class X and XII, and leaves any calculation to the institution or employer that asked for one.',
      },
      {
        question: 'How is CBSE CGPA calculated?',
        answer:
          'The 2010 circular describes CGPA as the average of grade points in the subjects counted under the scheme of studies, excluding an additional sixth subject. This page converts a CGPA you already have. It does not rebuild subject grades.',
      },
    ],
  },
  {
    slug: 'vtu',
    name: 'Visvesvaraya Technological University',
    shortName: 'VTU',
    kind: 'university',
    region: 'Karnataka',
    scale: 10,
    defaultScheme: '2022',
    title: 'VTU CGPA to Percentage Calculator',
    description:
      'Convert VTU CGPA to percentage with CGPA × 10 for the 2022 regulations, or (CGPA − 0.75) × 10 for the 2015–2018 schemes. Both are cited from VTU.',
    h1: 'VTU CGPA to percentage calculator',
    intro:
      'VTU uses two different conversions. The 2022 regulations say percentage = CGPA × 10. The 2015, 2017 and 2018 schemes use percentage = (CGPA − 0.75) × 10. The same 8.20 is 82% under one rule and 74.5% under the other.',
    body: [
      'VTU’s own “CGPA standard formula” page states the conversion for the 2015, 2017 and 2018 schemes only: Percentage = (CGPA − 0.75) × 10. The 2018-19 B.E./B.Tech regulations, clause 18OB 7.1, give the same formula and the illustration P = (8.20 − 0.75) × 10 = 74.5%.',
      'The B.E./B.Tech regulations published for students admitted from 2022-23, clause 22OB 6.7, say percentage of marks secured M = CGPA earned × 10, illustrated as 8.20 × 10 = 82.0%. The PDF on vtu.ac.in is marked “DRAFT COPY”. The same × 10 formula, with the same 8.20 → 82% illustration, is in the 2022 MBA, MCA and M.Tech regulations.',
      'Pick the scheme printed on your grade card or named in your regulations. Using the 0.75 deduction on a 2022-scheme CGPA understates the percentage by 7.5 points. Using × 10 on a 2018-scheme CGPA overstates it by the same amount.',
      'VTU computes CGPA from semester credit points: CGPA = Σ (credits × SGPA) / Σ credits, rounded to two decimal places. The semester averager on this page does that credit-weighted average, rounds to two decimals, then applies the scheme you selected. A transcript built from individual course grades can still differ by a few hundredths.',
    ],
    schemes: [
      {
        id: '2022',
        label: '2022 regulations · CGPA × 10',
        appliesTo: 'B.E./B.Tech regulations for admission from 2022-23, and the 2022 MBA, MCA and M.Tech regulations',
        formula: { kind: 'multiply', factor: 10, rounding: 'none' },
        exampleCgpa: 8.2,
        caveat:
          'The B.E./B.Tech 2022 PDF hosted by VTU is marked draft. Confirm the scheme on your grade card before you use a percentage on a form.',
        equivalence: {
          basis: 'percentage',
          bands: [
            { min: 70, label: 'First Class with Distinction' },
            { min: 60, label: 'First Class' },
            { min: 50, label: 'Second Class' },
            { min: 40, label: 'Pass Class' },
          ],
          note: 'Class bands in clause 22OB 6.8 of the 2022 B.E./B.Tech regulations, applied to the converted percentage.',
        },
        source: {
          title: 'VTU B.E./B.Tech Regulations, 2022 (clause 22OB 6.7)',
          url: 'https://vtu.ac.in/wp-content/uploads/2023/04/BE-BTech-Regulations-2022-05.04.2023.pdf',
          publisher: 'Visvesvaraya Technological University',
          date: '2023-04-05',
          quote:
            'Percentage of marks secured, M = CGPA Earned × 10. Illustration for a CGPA of 8.20: M = 8.20 × 10 = 82.0%.',
          accessed: CHECKED,
        },
        supportingSources: [
          {
            title: 'VTU MBA regulations 2022, clause 22OMB 7.1',
            url: 'https://vtu.ac.in/wp-content/uploads/2023/03/Regulations-Governing-the-award-of-MBA-2022-schem.pdf',
            publisher: 'Visvesvaraya Technological University',
            date: '2022-23',
            quote:
              'Percentage of marks secured, M = CGPA Earned × 10. Illustration for a CGPA of 8.20: M = 8.20 × 10 = 82.0.',
            accessed: CHECKED,
          },
        ],
      },
      {
        id: '2018',
        label: '2015, 2017 and 2018 schemes · (CGPA − 0.75) × 10',
        appliesTo: 'Schemes named on VTU’s CGPA standard formula page, including the 2018-19 B.E./B.Tech regulations',
        formula: { kind: 'offset', offset: 0.75, factor: 10, rounding: 'none' },
        exampleCgpa: 8.2,
        caveat:
          'VTU limits this formula to the 2015, 2017 and 2018 schemes. It is the wrong rule for a 2022-scheme CGPA.',
        equivalence: {
          basis: 'percentage',
          bands: [
            { min: 70, label: 'First Class with Distinction' },
            { min: 60, label: 'First Class' },
            { min: 0, label: 'Second Class' },
          ],
          note: 'Class bands in clause 18OB 7.2 of the 2018-19 regulations. That clause calls any converted percentage under 60% Second Class.',
        },
        source: {
          title: 'VTU CGPA standard formula',
          url: 'https://vtu.ac.in/cgpa-standard-formula/',
          publisher: 'Visvesvaraya Technological University',
          date: '2015–2018 schemes',
          quote: 'Percentage = (CGPA – 0.75) * 10, for the 2015, 2017 and 2018 schemes only.',
          accessed: CHECKED,
        },
        supportingSources: [
          {
            title: 'VTU B.E./B.Tech regulations 2018-19, clause 18OB 7.1',
            url: 'https://vtu.ac.in/wp-content/uploads/2019/03/be201819.pdf',
            publisher: 'Visvesvaraya Technological University',
            date: '2018-19',
            quote: 'Illustration for a CGPA of 8.20: P = (8.20 − 0.75) × 10 = 74.5%.',
            accessed: CHECKED,
          },
        ],
      },
    ],
    faqs: [
      {
        question: 'What is the VTU CGPA to percentage formula?',
        answer:
          'It depends on the scheme. For the 2022 regulations, percentage = CGPA × 10, so 8.20 becomes 82%. For the 2015, 2017 and 2018 schemes, percentage = (CGPA − 0.75) × 10, so 8.20 becomes 74.5%.',
      },
      {
        question: 'Which VTU scheme should I select?',
        answer:
          'Use the scheme named on your grade card or in the regulations for your year of admission. The 0.75 deduction is for the 2015, 2017 and 2018 schemes. The 2022 regulations use a straight multiply by 10. The wrong choice moves the result by 7.5 percentage points.',
      },
      {
        question: 'How do I convert a VTU percentage back to CGPA?',
        answer:
          'Reverse the scheme you started with. For 2022, divide the percentage by 10. For 2015–2018, divide by 10 and then add 0.75. 74.5% on the older scheme is a CGPA of 8.20.',
      },
      {
        question: 'How does VTU convert SGPA to CGPA?',
        answer:
          'CGPA is the credit-weighted average of semester SGPAs: total of (semester credits × SGPA) divided by total credits, reported to two decimal places. Enter each semester on this page and the average is converted with the scheme you picked.',
      },
      {
        question: 'Is the 2022 VTU formula final?',
        answer:
          'The B.E./B.Tech regulations file on vtu.ac.in that states CGPA × 10 is marked draft. The 2022 MBA, MCA and M.Tech regulations state the same × 10 formula. Check your grade card, or the university, before you rely on a percentage for an application.',
      },
    ],
  },
  {
    slug: 'aktu',
    name: 'Dr. A.P.J. Abdul Kalam Technical University',
    shortName: 'AKTU',
    kind: 'university',
    region: 'Uttar Pradesh',
    scale: 10,
    defaultScheme: '2018-revised',
    title: 'AKTU CGPA to Percentage Calculator',
    description:
      'Convert AKTU CGPA to percentage with the revised B.Tech ordinance: percentage = CGPA × 10. The clause is quoted and the maths stays in your browser.',
    h1: 'AKTU CGPA to percentage calculator',
    intro:
      'AKTU’s revised B.Tech ordinance, clause 15, says the conversion of CGPA into percentage is (CGPA) × 10. A CGPA of 8.66 is 86.6%.',
    body: [
      'Clause 15 of the revised rules for the undergraduate B.Tech course on the AICTE model curriculum, effective from the session 2018-19, states: “Conversion formula for the conversion of CGPA into Percentage is (CGPA) x 10 = Percentage of marks scored.”',
      'The ordinance copy linked below is the university document as hosted by an affiliated college. AKTU’s own ordinance index did not respond when this page was checked on 25 November 2026, so read the clause against the PDF your college or the university gives you if a form is going to depend on it.',
      'An earlier version of the same ordinance is often quoted online as (CGPA − 0.75) × 10, with the illustration (8.66 − 0.75) × 10 = 79.1%. That is not what the revised clause 15 says. Use the 0.75 form only when it is the formula printed on your own grade card. The custom calculator can apply it: multiplier 10, adjustment −7.5.',
      'The same ordinance defines CGPA as the credit-weighted average of semester SGPAs, rounded to two decimal places at the end of the programme. The semester tool on this page uses that average and then multiplies by 10.',
    ],
    schemes: [
      {
        id: '2018-revised',
        label: 'B.Tech ordinance 2018-19 (revised) · CGPA × 10',
        appliesTo: 'Revised B.Tech ordinance on the AICTE model curriculum, clause 15',
        formula: { kind: 'multiply', factor: 10, rounding: 'none' },
        exampleCgpa: 8.66,
        caveat:
          'The linked PDF is a college-hosted copy of the AKTU ordinance. An older unrevised text used (CGPA − 0.75) × 10. Use that older text only if your grade card says so.',
        source: {
          title: 'AKTU B.Tech ordinance 2018-19 (revised), clause 15',
          url: 'https://rrimt.ac.in/wp-content/uploads/2026/02/Ordinance-Effective-from-the-Session-2018-19-Revised.pdf',
          publisher: 'Dr. A.P.J. Abdul Kalam Technical University (copy hosted by RRIMT)',
          date: 'Session 2018-19, revised',
          quote:
            'Conversion formula for the conversion of CGPA into Percentage is (CGPA) x 10 = Percentage of marks scored.',
          accessed: CHECKED,
        },
      },
    ],
    faqs: [
      {
        question: 'How do I convert AKTU CGPA to percentage?',
        answer:
          'Multiply the CGPA by 10. Clause 15 of the revised B.Tech ordinance 2018-19 states that (CGPA) × 10 is the percentage of marks scored. A CGPA of 8.66 is 86.6%.',
      },
      {
        question: 'Why do some AKTU calculators subtract 0.75?',
        answer:
          'An earlier text of the 2018-19 ordinance used (CGPA − 0.75) × 10. The revised clause 15 does not. Subtract 0.75 only when that formula is the one printed for your batch.',
      },
      {
        question: 'How do I convert an AKTU percentage back to CGPA?',
        answer:
          'Divide the percentage by 10. 86.6% is a CGPA of 8.66 under the revised ordinance. This is the reverse of clause 15, not a separate university rule.',
      },
      {
        question: 'How do I average AKTU SGPA into CGPA?',
        answer:
          'The ordinance defines CGPA as the credit-weighted average of semester SGPAs, rounded to two decimal places. Enter each semester’s SGPA and credits, then the page multiplies that CGPA by 10.',
      },
    ],
  },
  {
    slug: 'anna-university',
    name: 'Anna University',
    shortName: 'Anna University',
    kind: 'university',
    region: 'Tamil Nadu',
    scale: 10,
    defaultScheme: 'r2021',
    title: 'Anna University CGPA to Percentage',
    description:
      'Convert Anna University CGPA to percentage with the regulation rule percentage = CGPA × 10, including Regulations 2021 for affiliated colleges.',
    h1: 'Anna University CGPA to percentage calculator',
    intro:
      'Anna University prints the percentage on the consolidated grade sheet as CGPA × 10. A CGPA of 8.50 is 85%.',
    body: [
      'Regulations 2021 for B.E./B.Tech programmes at non-autonomous affiliated institutions, clause 15.5.3, say: “In the consolidated grade sheet the CGPA earned shall be converted into percentage of marks as follows: Percentage of Marks = CGPA × 10.”',
      'The same sentence appears for university departments. Regulations 2023 for B.E./B.Tech at university departments, clause 13.5, and the 2023 postgraduate regulations, clause 13.5, both state Percentage of Marks = CGPA × 10. Later regulations, including M.Arch 2025 clause 19.7, keep % of Marks = CGPA × 10.',
      'CGPA here is the credit-weighted average of grade points in the courses that count, as defined in those regulations. Failed grades excluded by the regulation are already out of the CGPA on your grade sheet. This page does not re-decide which courses count. It converts the CGPA you enter, and it can average semester SGPAs by credits when that is all you have.',
    ],
    schemes: [
      {
        id: 'r2021',
        label: 'Regulations 2021 and 2023 · CGPA × 10',
        appliesTo:
          'Affiliated-college B.E./B.Tech Regulations 2021, and university-department UG and PG Regulations 2023',
        formula: { kind: 'multiply', factor: 10, rounding: 'none' },
        exampleCgpa: 8.5,
        caveat:
          'Autonomous colleges can have their own regulations. Use the formula printed on your grade sheet if it differs.',
        source: {
          title: 'Anna University Regulations 2021, clause 15.5.3',
          url: 'https://cac.annauniv.edu/aidetails/reg/Approved%20R2021/Undergraduate%20Programme%20-%20Academic%20Regulations%202021.pdf',
          publisher: 'Anna University',
          date: '2021',
          quote:
            'In the consolidated grade sheet the CGPA earned shall be converted into percentage of marks as follows: Percentage of Marks = CGPA × 10.',
          accessed: CHECKED,
        },
        supportingSources: [
          {
            title: 'Anna University Regulations 2023 (university departments), clause 13.5',
            url: 'https://cac.annauniv.edu/udregulations/R2023/01.%20UG%20Reg%202023.pdf',
            publisher: 'Anna University',
            date: '2023',
            quote:
              'In the consolidated grade sheet the CGPA earned shall be converted into percentage of marks as follows: Percentage of Marks = CGPA × 10.',
            accessed: CHECKED,
          },
        ],
      },
    ],
    faqs: [
      {
        question: 'How do I convert Anna University CGPA to percentage?',
        answer:
          'Multiply the CGPA by 10. Regulations 2021, clause 15.5.3, state that the consolidated grade sheet converts CGPA to percentage as CGPA × 10. A CGPA of 8.50 is 85%.',
      },
      {
        question: 'Is Anna University’s formula different for university departments?',
        answer:
          'No. Regulations 2023 for university-department B.E./B.Tech programmes, clause 13.5, and the 2023 postgraduate regulations use the same rule: Percentage of Marks = CGPA × 10.',
      },
      {
        question: 'How do I convert an Anna University percentage back to CGPA?',
        answer: 'Divide the percentage by 10. 85% is a CGPA of 8.50. That is the reverse of the regulation’s formula.',
      },
      {
        question: 'Does this include autonomous colleges under Anna University?',
        answer:
          'The cited clauses cover non-autonomous affiliated institutions and university departments. An autonomous college may publish a different rule. Use the formula on your own grade sheet when it differs.',
      },
    ],
  },
  {
    slug: 'mumbai-university',
    name: 'University of Mumbai',
    shortName: 'Mumbai University',
    kind: 'university',
    region: 'Maharashtra',
    scale: 10,
    defaultScheme: '2019',
    title: 'Mumbai University CGPA to Percentage',
    description:
      'Convert Mumbai University 10-point CGPA with the published formulas 7.1 × CGPA + 11 or 7.25 × CGPA + 11, then round up to the next whole number.',
    h1: 'Mumbai University CGPA to percentage calculator',
    intro:
      'The University of Mumbai did not use “multiply by 10”. Its circulars for the 10-point system say percentage = 7.1 × CGPA + 11, or in a 2018 Board circular, 7.25 × CGPI + 11, and then round up to the next whole number.',
    body: [
      'The circular dated 26 June 2019 (Exam/Result) restates the committee resolution of 20 May 2017. For the 10-point grading system it says Percentage (%) = 7.1 × CGPA + 11, and that the percentage can be rounded to the next full integer. For the 7-point system it says to use the actual marks, not a formula. A CGPA of 8 becomes 7.1 × 8 + 11 = 67.8, which rounds up to 68.',
      'A separate circular, Exam/Com of October 2018, was approved by the Board of Examinations and Evaluation on 4 September 2018 for graduate and postgraduate choice-based courses from the academic year 2016-17. That circular says Percentage (%) = 7.25 × CGPI + 11, again rounded to the next full integer. A CGPA of 8 becomes 69 exactly.',
      'Both documents say the conversion is an approximate representation, because a credit-weighted grade-point average is not the same thing as a percentage of marks. They are addressed to Arts, Science, Commerce and Management colleges and to the university departments named in each circular. Engineering colleges should follow the formula their own faculty circular specifies.',
      'The two official numbers disagree, so this page keeps both and names the document for each. The later circular, 26 June 2019, is selected by default. If a transcript or college instruction quotes 7.25, switch schemes. Do not average the two formulas.',
    ],
    schemes: [
      {
        id: '2019',
        label: 'Circular of 26 June 2019 · 7.1 × CGPA + 11',
        appliesTo: '10-point CBCS, as restated in the 26 June 2019 Exam/Result circular',
        formula: { kind: 'linear', slope: 7.1, intercept: 11, rounding: 'ceil-integer' },
        exampleCgpa: 8,
        caveat:
          'The university calls this approximate. The 7-point system uses actual marks. A 2018 Board circular instead says 7.25 × CGPI + 11.',
        source: {
          title: 'University of Mumbai circular, 26 June 2019',
          url: 'https://old.mu.ac.in/wp-content/uploads/2014/03/examresult1572019.pdf',
          publisher: 'University of Mumbai',
          date: '2019-06-26',
          quote:
            'For the 10 Point Grading System (CBCS), Percentage (%) = 7.1 × CGPA + 11. The percentage can be rounded to the next full integer.',
          accessed: CHECKED,
        },
      },
      {
        id: '2018',
        label: 'Board circular of October 2018 · 7.25 × CGPI + 11',
        appliesTo: '10-point choice-based graduate and postgraduate courses from 2016-17, as stated in the October 2018 circular',
        formula: { kind: 'linear', slope: 7.25, intercept: 11, rounding: 'ceil-integer' },
        exampleCgpa: 8,
        caveat:
          'This is the Board of Examinations formula of 2018. The later 26 June 2019 circular states 7.1 × CGPA + 11 instead. Use the one your college cites.',
        source: {
          title: 'University of Mumbai Exam/Com circular, October 2018',
          url: 'https://old.mu.ac.in/wp-content/uploads/2014/03/examcomm972018.pdf',
          publisher: 'University of Mumbai',
          date: '2018-10',
          quote:
            'For the 10 Point Grading System (CBCS), Percentage (%) = 7.25 × CGPI + 11. The percentage can be calculated using the above formula and rounded to the next full integer.',
          accessed: CHECKED,
        },
      },
    ],
    faqs: [
      {
        question: 'What is the Mumbai University CGPA to percentage formula?',
        answer:
          'For the 10-point system, the 26 June 2019 circular says percentage = 7.1 × CGPA + 11, rounded up to the next whole number. A CGPA of 8 is 67.8, which becomes 68. The October 2018 Board circular says 7.25 × CGPI + 11 instead.',
      },
      {
        question: 'Why is a Mumbai University CGPA of 10 not 100%?',
        answer:
          'Because the published formula is not “multiply by 10”. At a CGPA of 10 the 2019 formula gives 7.1 × 10 + 11 = 82, and the 2018 formula gives 7.25 × 10 + 11 = 83.5, which rounds up to 84. The university itself called the conversion approximate.',
      },
      {
        question: 'How do I convert a Mumbai University percentage back to CGPA?',
        answer:
          'Reverse the formula before rounding. For the 2019 circular, CGPA = (percentage − 11) ÷ 7.1. For the 2018 circular, CGPA = (percentage − 11) ÷ 7.25. Rounding means more than one CGPA can share the same whole-number percentage.',
      },
      {
        question: 'Does the 7.1 formula apply to engineering at Mumbai University?',
        answer:
          'The 2019 circular is addressed to Arts, Science, Commerce and Management. The 2018 circular covers the graduate and postgraduate choice-based courses it names. If you are in engineering, use the formula your college circular specifies rather than assuming 7.1 or 7.25.',
      },
      {
        question: 'What should I do for a 7-point Mumbai University grade?',
        answer:
          'Both circulars say that on the 7-point system the percentage is the percentage of actual marks, not a CGPA formula. Add the marks and divide by the maximum marks.',
      },
    ],
  },
  {
    slug: 'gtu',
    name: 'Gujarat Technological University',
    shortName: 'GTU',
    kind: 'university',
    region: 'Gujarat',
    scale: 10,
    defaultScheme: '2012',
    title: 'GTU CGPA to Percentage Calculator',
    description:
      'Convert GTU CPI or CGPA to percentage with Notification 1/2012: percentage = (CPI or CGPA − 0.5) × 10. The class bands are cited too.',
    h1: 'GTU CGPA to percentage calculator',
    intro:
      'GTU Notification 1/2012 says percentage marks = (CPI or CGPA − 0.5) × 10. A CGPA of 7.5 is 70%.',
    body: [
      'Notification 1/2012 of Gujarat Technological University, effective from the winter 2011 exams, states: “Percentage Marks = (CPI/CGPA − 0.5) × 10.” The same notification sets equivalent class on the CPI/CGPA itself: below 5.5 pass class, 5.5 and above second class, 6.5 and above first class, and 7.1 and above first class with distinction.',
      'GTU uses both CPI and CGPA in that sentence. For courses longer than two years, the notification says the degree uses the CGPA of the last four semesters. For two-year courses it uses CPI across all four semesters. Convert the index your transcript actually awards.',
      'The class label on this page follows those CGPA thresholds, not a second conversion. A CGPA of 7.10 is first class with distinction even though the percentage formula gives (7.10 − 0.5) × 10 = 66%.',
    ],
    schemes: [
      {
        id: '2012',
        label: 'Notification 1/2012 · (CGPA − 0.5) × 10',
        appliesTo: 'GTU courses graded on CPI or CGPA from the winter 2011 exams',
        formula: { kind: 'offset', offset: 0.5, factor: 10, rounding: 'none' },
        exampleCgpa: 7.5,
        caveat:
          'Class is decided from the CGPA thresholds in the same notification, not by re-banding the percentage.',
        equivalence: {
          basis: 'cgpa',
          bands: [
            { min: 7.1, label: 'First Class with Distinction' },
            { min: 6.5, label: 'First Class' },
            { min: 5.5, label: 'Second Class' },
            { min: 0, label: 'Pass Class' },
          ],
          note: 'Equivalent class from Notification 1/2012, read from CPI or CGPA rather than from the percentage.',
        },
        source: {
          title: 'GTU Notification 1/2012',
          url: 'https://old26.gtu.ac.in/ImpCircular/Notification_1_of_2012_Indicating_CPI_-CGPA_Equivalent_Class.pdf',
          publisher: 'Gujarat Technological University',
          date: '2012-04-13',
          quote: 'Percentage Marks = (CPI/CGPA − 0.5) × 10.',
          accessed: CHECKED,
        },
      },
    ],
    faqs: [
      {
        question: 'How do I convert GTU CGPA to percentage?',
        answer:
          'Subtract 0.5 from the CGPA or CPI, then multiply by 10. Notification 1/2012 states Percentage Marks = (CPI/CGPA − 0.5) × 10. A CGPA of 8 is 75%.',
      },
      {
        question: 'What is the difference between GTU CPI and CGPA?',
        answer:
          'The notification uses one percentage formula for both. It says degrees longer than two years use the CGPA of the last four semesters, and two-year courses use CPI across all four semesters. Convert the figure your transcript names.',
      },
      {
        question: 'How do I convert a GTU percentage back to CGPA?',
        answer: 'Divide the percentage by 10, then add 0.5. 70% is a CGPA of 7.5. That reverses Notification 1/2012.',
      },
      {
        question: 'How does GTU decide first class?',
        answer:
          'The notification sets class from the CPI or CGPA: 7.1 and above is first class with distinction, 6.5 and above is first class, 5.5 and above is second class, and below 5.5 is pass class.',
      },
    ],
  },
  {
    slug: 'ktu',
    name: 'APJ Abdul Kalam Technological University',
    shortName: 'KTU',
    kind: 'university',
    region: 'Kerala',
    scale: 10,
    defaultScheme: '2023',
    title: 'KTU CGPA to Percentage Calculator',
    description:
      'Convert KTU CGPA to percentage with the amended B.Tech 2019 rule, percentage = 10 × CGPA, from university order 1584/2023. The older “minus 2.5” rule is included.',
    h1: 'KTU CGPA to percentage calculator',
    intro:
      'From 29 June 2023, KTU’s amended B.Tech 2019 rule is percentage = 10 × CGPA. The regulation it replaced was 10 × CGPA − 2.5. A CGPA of 8.5 is 85% under the amended rule and 82.5% under the old one.',
    body: [
      'University Order No. 1584/2023/KTU, dated 29 June 2023, implements an Academic Council resolution to amend regulation R6.21 of the B.Tech 2019 scheme. The order says the regulation had been “Equivalent percentage mark shall be = 10 × CGPA − 2.5”, and that students had asked for the constant to be removed because it pushed them down rank lists. The amended line is “Equivalent percentage of mark shall be = 10 × CGPA”.',
      'The order is specific to the 2019 scheme amendment. It is the rule to use unless your own regulation still prints the older line. The pre-2023 formula is on this page for a percentage that was already fixed under R6.21 before the amendment. Do not subtract 2.5 from a CGPA that the amended rule covers: that costs you 2.5 percentage points the Academic Council voted to restore.',
      'The copy linked here is the university order as circulated by the College of Engineering Trivandrum, an affiliated college. The order number, date and quoted regulation text are in that PDF. If you need the file from ktu.edu.in itself, search the university’s orders for U.O. No. 1584/2023/KTU.',
    ],
    schemes: [
      {
        id: '2023',
        label: 'From 29 June 2023 · 10 × CGPA',
        appliesTo: 'B.Tech 2019 regulation R6.21 as amended by U.O. No. 1584/2023/KTU',
        formula: { kind: 'multiply', factor: 10, rounding: 'none' },
        exampleCgpa: 8.5,
        caveat:
          'The order amends the 2019 scheme. If your regulation text is different, follow the text on your document.',
        source: {
          title: 'KTU U.O. No. 1584/2023/KTU (29 June 2023)',
          url: 'https://www.ee.cet.ac.in/downloads/ktuDocs/1584-2023-KTU_R.6.21%20CGPA%20to%20Percentage%20Conversion.pdf',
          publisher: 'APJ Abdul Kalam Technological University (copy hosted by College of Engineering Trivandrum)',
          date: '2023-06-29',
          quote:
            'Amend the Regulation for B.Tech, 2019, R6.21: Equivalent percentage of mark shall be = 10 × CGPA.',
          accessed: CHECKED,
        },
      },
      {
        id: 'pre-2023',
        label: 'R6.21 before 29 June 2023 · 10 × CGPA − 2.5',
        appliesTo: 'B.Tech 2019 regulation R6.21 as quoted in the order, before the amendment',
        formula: { kind: 'linear', slope: 10, intercept: -2.5, rounding: 'none' },
        exampleCgpa: 8.5,
        caveat:
          'The Academic Council replaced this formula on 29 June 2023. Use it only for a percentage already fixed under the old line.',
        source: {
          title: 'KTU U.O. No. 1584/2023/KTU, quoting the unamended R6.21',
          url: 'https://www.ee.cet.ac.in/downloads/ktuDocs/1584-2023-KTU_R.6.21%20CGPA%20to%20Percentage%20Conversion.pdf',
          publisher: 'APJ Abdul Kalam Technological University (copy hosted by College of Engineering Trivandrum)',
          date: '2023-06-29',
          quote:
            'Currently, University uses the formula as in the Regulation for B.Tech, 2019, R6.21: Equivalent percentage mark shall be = 10 × CGPA − 2.5.',
          accessed: CHECKED,
        },
      },
    ],
    faqs: [
      {
        question: 'How do I convert KTU CGPA to percentage?',
        answer:
          'For the amended B.Tech 2019 rule, multiply the CGPA by 10. University Order 1584/2023, dated 29 June 2023, changed R6.21 to “equivalent percentage of mark shall be = 10 × CGPA”. A CGPA of 8.5 is 85%.',
      },
      {
        question: 'Why do some KTU calculators subtract 2.5?',
        answer:
          'Because that was the old R6.21 line: 10 × CGPA − 2.5. The same university order that quotes it also replaces it with 10 × CGPA. Subtract 2.5 only for a result that was fixed before 29 June 2023.',
      },
      {
        question: 'How do I convert a KTU percentage back to CGPA?',
        answer:
          'Under the amended rule, divide the percentage by 10. Under the old rule, add 2.5 and then divide by 10. 82.5% on the old rule is a CGPA of 8.5.',
      },
      {
        question: 'Does the June 2023 change apply to every KTU programme?',
        answer:
          'The order amends the B.Tech 2019 regulation R6.21. It does not, in the text read for this page, rewrite every older scheme. Use the formula printed in the regulation for your own programme.',
      },
    ],
  },
  {
    slug: 'jntuh',
    name: 'Jawaharlal Nehru Technological University Hyderabad',
    shortName: 'JNTUH',
    kind: 'university',
    region: 'Telangana',
    scale: 10,
    defaultScheme: 'r22',
    title: 'JNTUH CGPA to Percentage Calculator',
    description:
      'Convert JNTUH B.Tech CGPA to percentage with the R22 rule: percentage = (final CGPA − 0.5) × 10. Clause 11.2 is quoted on the page.',
    h1: 'JNTUH CGPA to percentage calculator',
    intro:
      'JNTUH’s R22 B.Tech regulations, clause 11.2, say the percentage of marks equivalent to the final CGPA is (final CGPA − 0.5) × 10. A CGPA of 8.00 is 75%.',
    body: [
      'Academic Regulations (R22) for B.Tech regular students, with effect from 2022-23, clause 11.2, state: “For final percentage of marks equivalent to the computed final CGPA, the following formula may be used. % of Marks = (final CGPA – 0.5) × 10.” The same line is in the revised R22 text modified on 27 January 2023.',
      'The word “may” is in the regulation. It is the university’s published equivalence for employment or a record that asks for a percentage, not a second set of marks. A CGPA of 10 becomes 95%, and a CGPA of 6 becomes 55%.',
      'JNTUH’s CGPA is computed from course grade points and credits across the semesters that count toward the 160-credit programme, rounded to two decimal places. Averaging semester SGPAs by credits is the right worksheet when those SGPAs are all you have, and it can differ slightly from the course-level CGPA on the memo.',
    ],
    schemes: [
      {
        id: 'r22',
        label: 'B.Tech R22 · (CGPA − 0.5) × 10',
        appliesTo: 'B.Tech regular students under Academic Regulations R22 from 2022-23',
        formula: { kind: 'offset', offset: 0.5, factor: 10, rounding: 'none' },
        exampleCgpa: 8,
        caveat:
          'Clause 11.2 says the formula “may be used” for the final percentage equivalent to the final CGPA. Other regulations can differ.',
        source: {
          title: 'JNTUH Academic Regulations (R22), clause 11.2',
          url: 'https://jntuh.ac.in/uploads/academics/R22B.Tech.RevisedAcademicRegulations.pdf',
          publisher: 'Jawaharlal Nehru Technological University Hyderabad',
          date: '2023-01-27',
          quote: '% of Marks = (final CGPA – 0.5) × 10.',
          accessed: CHECKED,
        },
      },
    ],
    faqs: [
      {
        question: 'How do I convert JNTUH CGPA to percentage?',
        answer:
          'Subtract 0.5 from the final CGPA and multiply by 10. Clause 11.2 of the R22 B.Tech regulations states % of Marks = (final CGPA − 0.5) × 10. A CGPA of 8.00 is 75%.',
      },
      {
        question: 'Why is a JNTUH CGPA of 10 equal to 95%?',
        answer:
          'Because the regulation subtracts 0.5 before multiplying by 10. (10 − 0.5) × 10 = 95. A straight multiply-by-10 conversion is a different rule and is not what clause 11.2 says.',
      },
      {
        question: 'How do I convert a JNTUH percentage back to CGPA?',
        answer: 'Divide the percentage by 10 and add 0.5. 75% is a CGPA of 8.00. That reverses clause 11.2.',
      },
      {
        question: 'Does the R22 formula apply to older JNTUH batches?',
        answer:
          'The clause cited here is in the R22 regulations for students from 2022-23, including the text revised on 27 January 2023. If you are on an older regulation, use the formula that regulation prints.',
      },
    ],
  },
]

export function getPreset(slug: string): Preset | undefined {
  return PRESETS.find((preset) => preset.slug === slug)
}

export function getScheme(preset: Preset, schemeId: string | null | undefined): Scheme {
  return (
    preset.schemes.find((scheme) => scheme.id === schemeId) ??
    preset.schemes.find((scheme) => scheme.id === preset.defaultScheme) ??
    preset.schemes[0]
  )
}

export const CUSTOM_PRESET_ID = 'custom'
