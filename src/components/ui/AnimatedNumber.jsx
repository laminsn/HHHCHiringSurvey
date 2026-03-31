import { useAnimatedValue } from '../../hooks/useAnimatedValue.js';

export function AnimatedNumber({ value, duration = 1200, suffix = '', className = '', style = {} }) {
  const animated = useAnimatedValue(value, duration);
  return <span className={className} style={style}>{animated}{suffix}</span>;
}
