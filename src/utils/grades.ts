/**
 * grades.ts — Shared grade calculation utilities
 *
 * Centralised here so every page (Grades, CoursePage, Courses, Dashboard)
 * uses the exact same scale and colours. If the scale ever changes, you
 * only edit this one file.
 *
 * Ontario College grading scale:
 *   A+ ≥ 90  |  A ≥ 80  |  B+ ≥ 73  |  B ≥ 67
 *   C+ ≥ 60  |  C ≥ 53  |  D < 53
 */

export interface LetterGrade {
  letter: string
  color: string
}

export function getLetterGrade(percentage: number): LetterGrade {
  if (percentage >= 90) return { letter: 'A+', color: '#22C55E' }
  if (percentage >= 80) return { letter: 'A',  color: '#22C55E' }
  if (percentage >= 73) return { letter: 'B+', color: '#06B6D4' }
  if (percentage >= 67) return { letter: 'B',  color: '#06B6D4' }
  if (percentage >= 60) return { letter: 'C+', color: '#F97316' }
  if (percentage >= 53) return { letter: 'C',  color: '#F97316' }
  return { letter: 'D', color: '#EF4444' }
}

/**
 * Returns a colour based on a raw score percentage — used for rubric
 * progress bars and individual mark highlights.
 *   Green  ≥ 80%   Good
 *   Orange ≥ 60%   Acceptable
 *   Red    < 60%   Needs improvement
 */
export function getScoreColor(scorePct: number): string {
  if (scorePct >= 80) return '#22C55E'
  if (scorePct >= 60) return '#F97316'
  return '#EF4444'
}
