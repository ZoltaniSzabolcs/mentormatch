interface Mentee {
  id: number;
  goals: string[];
  learningStyle: string;
  availability: string;
  experienceLevel: string;
}

interface Mentor {
  id: number;
  name: string;
  title: string;
  company: string;
  rating: number;
  sessions: number;
  bio: string;
  expertise: string[];
  skills?: string[];
  image: string;
  matchScore: number;
  location: string;
  availability: string;
}

// ─── Match Score Logic ────────────────────────────────────────────────────────
// Compares mentee goals against mentor expertise/skills.
// Each matching keyword between mentee goals and mentor skills adds weight.
// Final score is normalized to the 60–99 range so it always looks meaningful.

export function computeMatchScore(mentor: Mentor, mentee: Mentee | null): number {
  if (!mentee) return 75;

  const menteeKeywords = (mentee.goals || [])
    .join(' ')
    .toLowerCase()
    .split(/[\s,]+/)
    .filter(Boolean);

  const mentorKeywords = (mentor.skills || mentor.expertise || [])
    .join(' ')
    .toLowerCase()
    .split(/[\s,]+/)
    .filter(Boolean);

  if (menteeKeywords.length === 0 || mentorKeywords.length === 0) return 70;

  // Count overlapping tokens
  const matchCount = menteeKeywords.filter((kw) =>
    mentorKeywords.some((mk: string) => mk.includes(kw) || kw.includes(mk)),
  ).length;

  // Availability bonus — mentor.availability from API may be an array or undefined
  let mentorAvail = '';
  if (Array.isArray(mentor.availability)) {
    mentorAvail = mentor.availability.join(' ');
  } else if (typeof mentor.availability === 'string') {
    mentorAvail = mentor.availability;
  }
  const menteeAvail = typeof mentee.availability === 'string' ? mentee.availability : '';
  const availabilityMatch =
    mentorAvail && menteeAvail && mentorAvail.toLowerCase().includes(menteeAvail.toLowerCase()) ? 1 : 0;

  const rawScore = matchCount + availabilityMatch;
  const maxPossible = Math.max(menteeKeywords.length, 1);

  // Normalize to 60–99
  const normalized = Math.round(60 + (rawScore / maxPossible) * 39);
  console.log(`Computed match score for Mentor ${mentor.id} and Mentee ${mentee.id}: ${normalized} (raw: ${rawScore})`);
  return Math.min(99, Math.max(60, normalized));
}
