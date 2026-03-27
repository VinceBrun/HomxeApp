/**
 * Design System: Typography
 * Standardized font sizes and line heights for consistent text hierarchy.
 */

export type TypeScaleLabel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export type TypographyType = {
  fontSize: Record<TypeScaleLabel, number>;
  lineHeight: Record<TypeScaleLabel, number>;
};

const Typography: TypographyType = {
  fontSize: {
    h1: 26,
    h2: 20,
    h3: 16,
    h4: 25,
    h5: 14,
    h6: 12,
  },
  lineHeight: {
    h1: 33,
    h2: 25,
    h3: 20,
    h4: 19,
    h5: 18,
    h6: 16,
  },
};

export default Typography;
